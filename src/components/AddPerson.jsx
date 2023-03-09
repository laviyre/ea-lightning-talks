import {useState} from "react";

function AddPerson({add}) {
    let [name, setName] = useState("");
    let [advanced, setAdvanced] = useState(false);
    
    function updateName(e) {
        setName(e.target.value);
    }

    function updateAdvanced(e) {
        setAdvanced(!advanced);
    }

    function onSubmit() {
        add(name, advanced);
        setName("");
        setAdvanced(false);
    }

    return (
        <form>
            <label htmlFor = "name">Name</label>
            <input type = "text" name = "name" id = "name" value = {name} onChange = {updateName}/>
            <label htmlFor = "advanced">Advanced</label>
            <input type = "checkbox" name = "advanced" id = "advanced" checked = {advanced} onChange = {updateAdvanced}/>
            <button type = "button" onClick = {onSubmit}>Add Person</button>
        </form>
    )
}

export default AddPerson;