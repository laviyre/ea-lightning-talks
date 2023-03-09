import {Person} from "./person.js";
import { QuestionType } from "./questions.js";
import Table from "./table.js";

class QuestionAllocator {
    #people;
    #questions;
    #round;

    static #personRepeatPunish = 100;
    static #questionRepeatPunish = 500;
    static #repeatScalingFactor = 10;
    static #randomAttempts = 1000;
    static #defaultScoreThreshold = 0;
    static #scoreMultiplier = 2;

    constructor(people, questions) {
        this.#people = people;
        this.#questions = questions;
        this.#round = 1;
    }

    addPerson(name, level) {
        this.#people.push(new Person(name, level, this.#people.length));
    }

    getPair(pair) {
        return {
            personOne: this.#people[pair.personOne].getName(),
            personTwo: this.#people[pair.personTwo].getName(),
            question: this.#questions.getQuestion(pair.questionType, pair.questionNo),
        }
    }

    getRound() {
        let attempts = 0;
        let currentThreshold = QuestionAllocator.#defaultScoreThreshold;

        let cs = 0;

        outer: while (true) {
            let currPeople = this.#people.map((p,i) => i);
            let currPairs = [];
            cs = 0;
            Table.resetTables();

            if (++attempts >= QuestionAllocator.#randomAttempts) {
                currentThreshold = currentThreshold === 0 ? QuestionAllocator.#personRepeatPunish 
                : QuestionAllocator.#scoreMultiplier * currentThreshold;
                attempts %= QuestionAllocator.#randomAttempts;
            }

            while (currPeople.length > 1) {
                let {pairDetails, score} = this.findPair(currPeople);

                cs += score;
                if (cs > currentThreshold)
                {
                    continue outer;
                }

                currPairs.push(pairDetails);
                currPeople = currPeople.filter(p => p !== pairDetails.personOne && p !== pairDetails.personTwo);
            }

            if (currPeople.length === 1) {
                let [personThree] = currPeople;
                let found = false;

                for (let i = 0; i < currPairs.length; i++) {
                    let pair = currPairs[i];
                    let addScore = this.tripletPossible(pair, personThree);
                    if (cs + addScore <= currentThreshold) {
                        found = true;
                        pair["personThree"] = personThree;
                        break;
                    }
                }

                if (!found) 
                    continue;
            }

            if (!Table.validSetup())
                continue;

            currPairs.forEach(pair => {
                if ("personThree" in pair) {
                    this.#people[pair.personOne].meet(pair.personTwo, 0.5);
                    this.#people[pair.personTwo].meet(pair.personOne, 0.5);
                    this.#people[pair.personOne].meet(pair.personThree, 0.5);
                    this.#people[pair.personTwo].meet(pair.personThree, 0.5);
                    this.#people[pair.personThree].meet(pair.personTwo, 0.5);
                    this.#people[pair.personThree].meet(pair.personOne, 0.5);
                    
                    this.#people[pair.personOne].doQuestion(pair.questionNo, pair.questionType);
                    this.#people[pair.personTwo].doQuestion(pair.questionNo, pair.questionType);
                    this.#people[pair.personThree].doQuestion(pair.questionNo, pair.questionType);
                } else {
                    this.#people[pair.personOne].meet(pair.personTwo, 1);
                    this.#people[pair.personTwo].meet(pair.personOne, 1);
                    
                    this.#people[pair.personOne].doQuestion(pair.questionNo, pair.questionType);
                    this.#people[pair.personTwo].doQuestion(pair.questionNo, pair.questionType);
                }
            });

            this.#round++;

            return currPairs;
        }
    }

    findPair(currPeople) {
        let personOne = currPeople[Math.floor(currPeople.length * Math.random())];
        let otherPeople = this.#people[personOne].getNeverMet(currPeople);
        let personTwo = otherPeople[Math.floor(otherPeople.length * Math.random())];

        let currScore = this.getScorePersonClash(personOne, personTwo);

        let {questionType, questionNo, score} = this.getQuestion(this.#people[personOne], this.#people[personTwo]);
        currScore += score * QuestionAllocator.#questionRepeatPunish;

        let tableNo = Table.addToTable(questionType, questionNo);

        return {pairDetails: {personOne, personTwo, questionType, questionNo, tableNo}, score: currScore};
    }

    getScorePersonClash(personOne, personTwo) {
        let currScore = !(personTwo in this.#people[personOne].getMet()) ? 0 : this.#people[personOne].getMet()[personTwo];
        if (currScore !== 0) currScore = QuestionAllocator.#personRepeatPunish * Math.pow(QuestionAllocator.#repeatScalingFactor, currScore-1);

        return currScore;
    }

    tripletPossible(pair, personThree) {
        let {personOne, personTwo, questionType, questionNo} = pair;
        let score = 0;

        score += this.getScorePersonClash(personOne, personThree);
        score += this.getScorePersonClash(personTwo, personThree);
        if (!this.#people[personThree].getPossibleQuestions(questionType).has(questionNo)) score += QuestionAllocator.#questionRepeatPunish;

        return score;
    }

    getQuestion(personOne, personTwo) {
        // Is social
        if (this.#round % 5 === 1)
            return {questionType: QuestionType.Social, questionNo: Math.floor(this.#round/5)%2, score: 0}

        let potentialQuestions = [];
        if (!personOne.getAdvanced() || !personTwo.getAdvanced()) 
            potentialQuestions.push(this.#questionsOfType(personOne, personTwo, QuestionType.Easy));
        if (personOne.getAdvanced() || personTwo.getAdvanced())
            potentialQuestions.push(this.#questionsOfType(personOne, personTwo, QuestionType.Medium));
        if (personOne.getAdvanced() && personTwo.getAdvanced())
            potentialQuestions.push(this.#questionsOfType(personOne, personTwo, QuestionType.Hard));

        let possibleQuestions = potentialQuestions.filter(p => !p.clash);
        if (possibleQuestions.length === 0) {
            let qs = potentialQuestions[Math.floor(potentialQuestions.length * Math.random())];
            let q = qs.questions[Math.floor(qs.questions.length * Math.random())];
            return {questionType: qs.questionType, questionNo: q, score: 1};
        }

        let qs = possibleQuestions[Math.floor(possibleQuestions.length * Math.random())];
        let q = qs.questions[Math.floor(qs.questions.length * Math.random())];
        return {questionType: qs.questionType, questionNo: q, score: 0};   
    }

    #questionsOfType(personOne, personTwo, questionType) {
        let pOneQ = personOne.getPossibleQuestions(questionType);
        let pTwoQ = personTwo.getPossibleQuestions(questionType);

        if (pOneQ.size === 0 || pTwoQ.size === 0) return {questions: this.#questions.getQuestions(questionType), clash: true, questionType: questionType};

        let interQ = this.#intersection(pOneQ, pTwoQ);
        if (interQ.length === 0) return {questions: this.#questions.getQuestions(questionType), clash: true, questionType: questionType};

        return {questions: interQ, clash: false, questionType: questionType};
    }

    #intersection(setOne, setTwo) {
        return [...setOne].filter(x => setTwo.has(x));
    }

    getPersonName(id) {
        return this.#people[id].getName();
    }
}

export default QuestionAllocator;