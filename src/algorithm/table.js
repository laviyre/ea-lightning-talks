import { QuestionType } from "./questions";

const Table = (() => {
    let tables = [0,0,0,0];

    const resetTables = () => {tables = [0,0,0,0];}

    const addToTable = (questionType, questionNo) => {
        let tableType = getTableType(questionType, questionNo);
        tables[tableType]++;
        if (tables[tableType] % 2 === 0) return tableType + 4;
        return tableType;
    }

    const getTableType = (questionType, questionNo) => {
        switch(questionType) {
            case QuestionType.Easy: 
                if (questionNo <= 3) return 1;
                if (questionNo <= 6) return 2;
                if (questionNo <= 10) return 3;
                return 4;
            case QuestionType.Medium: case QuestionType.Hard:
                if (questionNo <= 1) return 1;
                if (questionNo <= 4) return 2;
                if (questionNo <= 6) return 3;
                return 4;
            case QuestionType.Social: default:
                return 1 + Math.floor(4 * Math.random());
        }
    }

    const validSetup = () => {
        return tables.every(t => t <= 4);
    }

    return {resetTables, validSetup, addToTable};
})();

export default Table;