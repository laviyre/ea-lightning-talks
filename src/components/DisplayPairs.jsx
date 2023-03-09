import DisplayPair from "./DisplayPair";
import { questions } from "../algorithm/data/questions";
import {useState} from "react";

function DisplayPairs({questionAllocator}) {
    let [pairs, setPairs] = useState([]);

    function generateRound() {
        let rounds = questionAllocator.getRound();
        let displayablePairs = rounds.map(round => {
            let people = [questionAllocator.getPersonName(round.personOne), 
                questionAllocator.getPersonName(round.personTwo)];
            if ("personThree" in round) people.push(questionAllocator.getPersonName(round.personThree));

            return {
                people: people,
                question: questions.getQuestion(round.questionType, round.questionNo),
                table: round.tableNo,
            }
        });

        setPairs(displayablePairs);
    }

    return (
        <main>
            <button onClick = {generateRound}>Generate Round</button>
            <article>
                {pairs.map((pair,i) => <DisplayPair pairData = {pair} key = {i}/>)}
            </article>
        </main>
    )
}

export default DisplayPairs;