import { QuestionType } from "./questions.js";
import {questions} from "./data/questions";

class Person {
    #name
    #advanced
    #met
    #question
    #id;

    constructor(name, advanced, id) {
        this.#name = name;
        this.#advanced = advanced;
        this.#met = {}
        this.#met[id] = 10000 // Makes sure some one does not meet themselves
        this.#question = {}
        this.#id = id;

        for (let qType in QuestionType)
            this.#question[QuestionType[qType]] = new Set(questions.getQuestions(QuestionType[qType]).map((q, i) => i));
    }

    getName() {
        return this.#name;
    }

    getAdvanced() {
        return this.#advanced;
    }

    getId() {
        return this.#id;
    }

    getMet() {
        return this.#met;
    }

    getNeverMet(people) {
        let neverMet = people.filter(person => !(person in this.#met));
        
        // find instead the people who have met this person the fewest times
        if (neverMet.length === 0) {
            let minScore = 1000;
            for (let person of people) {
                minScore = Math.min(minScore, this.#met[person]);
            }
            for (let person of people) {
                if (this.#met[person] === minScore) neverMet.push(+person);
            }
        }

        return neverMet;
    }

    getPossibleQuestions(questionType) {
        return this.#question[questionType];
    }

    meet(person, level) {
        if (!(person in this.#met)) this.#met[person] = level;
        else this.#met[person] += level;
    }

    doQuestion(q, qType) {
        this.#question[qType].delete(q);
    }
}

export {Person};