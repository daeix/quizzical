import React from "react"
import Start from "./Start.jsx"
import Quizz from "./Quizz.jsx"

export default function App() {
  const [quizzStarted, setQuizzStarted] = React.useState(false)

  function startQuizz() {
    setQuizzStarted((prevS) => !prevS)
  }

  return (
    <div>
      <img className="blob1-img" alt="bacground-img" src="/blob4.svg" />
      <img className="blob2-img" alt="background-img" src="/blob5.svg" />
      {quizzStarted ? (
        <Quizz handleStart={startQuizz} />
      ) : (
        <Start handleStart={startQuizz} />
      )}
    </div>
  )
}
