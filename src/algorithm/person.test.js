import {Person} from "./person.js";
import {QuestionType} from "./questions.js";
import {questions} from "./data/questions";
import {people} from "./data/people";

describe("Questions working", () => {
    test("Default lengths valid", () => {
        const person = new Person("", false);

        for (let type in QuestionType)
        {
            let q = QuestionType[type];
            expect(person.getPossibleQuestions(q).size)
            .toBe(questions.getQuestions(q).length);
        }
    })

    test("Remove some easy questions", () => {
        const person = new Person("", false);

        person.doQuestion(3, QuestionType.Easy);
        person.doQuestion(5, QuestionType.Easy);
        person.doQuestion(0, QuestionType.Social);
        person.doQuestion(1, QuestionType.Social);

        expect(person.getPossibleQuestions(QuestionType.Hard).size)
        .toBe(questions.getQuestions(QuestionType.Hard).length);

        expect(person.getPossibleQuestions(QuestionType.Easy))
        .toEqual(new Set([0,1,2,4,6,7,8,9,10,11]));

        expect(person.getPossibleQuestions(QuestionType.Social))
        .toEqual(new Set([]));
    })
})

describe("People Choosing", () => {
    test("Everyone available by default", () => {
        const pep = people.map((p, i) => i);
        const person = people[0];

        expect(person.getNeverMet(pep)).toEqual([1,2,3,4,5,6,7,8,9]);
    })

    test("Once people are met fewer options considered", () => {
        const pep = people.map((p, i) => i);
        const person = people[0];

        person.meet(1, 1);
        person.meet(2, 1);
        person.meet(3,1);

        expect(person.getNeverMet(pep)).toEqual([4,5,6,7,8,9]);
    })

    test("If someone has met everyone, we only consider the people met fewer times", () => {
        const pep = people.map((p, i) => i);
        const person = people[1];

        [0,2,3,4,6,7,9].forEach(i => person.meet(i, 1));
        person.meet(5, 0.5);
        person.meet(8, 0.5);

        expect(person.getNeverMet(pep)).toEqual([5,8]);
    })
})