//Enum for Question Type
export const QuestionType = {
    Easy: "easy",
    Medium: "medium",
    Hard: "hard",
    Social: "social",
}

class Questions {
    #questions

    constructor(easy, medium, hard, social) {
        this.#questions = {}
        this.#questions[QuestionType.Easy] = easy;
        this.#questions[QuestionType.Medium] = medium;
        this.#questions[QuestionType.Hard] = hard;
        this.#questions[QuestionType.Social] = social;
    }

    getQuestionLength(questionType) {
        return this.#questions[questionType].length;
    }

    getQuestions(questionType) {
        return this.#questions[questionType];
    }

    getQuestion(questionType, index) {
        return this.#questions[questionType][index];
    }
}

export {Questions};