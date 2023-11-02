import React from "react"

export default function Start(props) {
  return (
    <div className="start-page">
      <h1 className="quizzical-title">Quizzical</h1>
      <p className="quizzical-description">Take A Quiz For Fun</p>
      <button onClick={props.handleStart} className="start-btn">
        Start quizz
      </button>
    </div>
  )
}
