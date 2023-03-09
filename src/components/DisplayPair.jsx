function DisplayPair({pairData}) {
    let {people, question, table} = pairData;

    return (
        <section>
            <span>
                {people.map((person,i) => <div key = {i}>{person}</div>)}
            </span>
            <div>{question}</div>
            <div>Table {table}</div>
        </section>
    )
}

export default DisplayPair;