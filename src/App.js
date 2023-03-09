import AddPerson from "./components/AddPerson";
import DisplayPairs from "./components/DisplayPairs";
import {useState, useEffect} from 'react';
import QuestionAllocator from "./algorithm/question-allocator";
import { questions } from "./algorithm/data/questions";

function App() {
  const [questionAllocator, setQA] = useState();

  useEffect(() => {
      setQA(new QuestionAllocator([], questions))
  }, [])

  function add(name, advanced) {
    questionAllocator.addPerson(name, advanced);
  }

  return (
    <>
      <header><h1>Effective Altruism: Lightning Talks</h1></header>
      <AddPerson add = {add}/>
      <DisplayPairs questionAllocator={questionAllocator}/>
    </>
  );
}

export default App;