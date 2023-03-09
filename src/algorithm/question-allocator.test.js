import QuestionAllocator from "./question-allocator";
import { Person } from "./person";
import { people } from "./data/people";
import { questions } from "./data/questions";
import { QuestionType } from "./questions";

function duplicatePeople(people) {
    return people.map(person => new Person(person.getName(), person.getAdvanced(), person.getId()));
}

function convertToInt(questionType, n) {
    let conversion = n;
    switch (questionType) {
        case QuestionType.Medium:
            conversion+=100;
            break;
        case QuestionType.Hard:
            conversion+=200;
            break;
        case QuestionType.Social:
            conversion+=300;
            break;
        default:
            break;
    }
         
    return conversion;
}

describe("Testing that questions are successfully allocated", () => {
    test("generates a round", () => {
        let qa = new QuestionAllocator(duplicatePeople(people), questions);
        let round = qa.getRound();

        expect(round.length).toBe(people.length/2);
    })

    for (let j = 0; j < 100; j++) {
    test(`Multiple rounds do not contain people meeting same person Try: ${j}`, () => {
        let qa = new QuestionAllocator(duplicatePeople(people), questions);
        for (let i = 0; i < 7; i++)
            qa.addPerson("", true);
        let rounds = []
        for (let i = 0; i < 10; i++)
            rounds.push(qa.getRound());

        people.forEach(person => {
            let id = person.getId();
            let peopleMet = new Set([]);

            let conditionMet = true;

            rounds.forEach(round => {
                round.forEach(pair => {
                    if (pair.personOne === id) {
                        if (peopleMet.has(pair.personTwo))
                        {
                            conditionMet = false;
                        }
                            
                        peopleMet.add(pair.personTwo);
                    }
                    if (pair.personTwo === id) {
                        if (peopleMet.has(pair.personOne)) {
                            conditionMet = false;
                        }
                            
                        peopleMet.add(pair.personOne);
                    }
                })
            })

            expect(conditionMet).toBe(true);
        })
    })
    }

    for (let j = 0; j < 100; j++) {
        test(`Different Queastion Each time: Try: ${j}`, () => {
            let qa = new QuestionAllocator(duplicatePeople(people), questions);
        for (let i = 0; i < 5; i++)
            qa.addPerson("", true);
        let rounds = [];
        for (let i = 0; i < 10; i++)
            rounds.push(qa.getRound());

        people.forEach(person => {
            let conditionMet = true;

            let qs = new Set([]);

            rounds.forEach(round => {
                round.forEach(pair => {
                    if (pair.personOne === person.getId() || pair.personTwo === person.getId()) {
                        if (qs.has(convertToInt(pair.questionType, pair.questionNo)))
                            conditionMet = false;
                        else qs.add(convertToInt(pair.questionType, pair.questionNo));
                    }
                })
            })

            expect(conditionMet).toBe(true);
            })
        });
    }
})