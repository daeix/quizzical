import React from "react"
import { decode } from "html-entities"
import "./Quizz.css"
import { nanoid } from "nanoid"

export default function Qizz(props) {
  const [quizes, setQuizes] = React.useState([])
  const [selectedAnswers, setSelectedAnswers] = React.useState({})
  const [isAnswerChecked, setIsAnswerChecked] = React.useState(false)

  function checkAnswers() {
    if (Object.keys(selectedAnswers).length === 5) {
      setIsAnswerChecked(true)
    }
  }

  const handleAnswerChange = (e, questionId) => {
    const { value } = e.target
    setSelectedAnswers((prevS) => ({
      ...prevS,
      [questionId]: value,
    }))
  }

  const calculateScore = () => {
    let correctCount = 0

    quizes.forEach((quiz, index) => {
      const questionId = `question_${index}`
      const selectedAnswer = selectedAnswers[questionId]
      const correctAnswer = quiz.correct_answer

      if (selectedAnswer === correctAnswer) {
        correctCount++
      }
    })
    return correctCount
  }

  const quizzScore = calculateScore()

  function insertAnswerAtRandomPosition(array, item) {
    const newArray = [...array]
    const randomIndex = Math.floor(Math.random() * (newArray.length + 1))
    newArray.splice(randomIndex, 0, item)
    return newArray
  }

  React.useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&type=multiple")
      .then((res) => res.json())
      .then((data) => {
        const quizzesWithShuffledAnswers = data.results.map((quiz) => ({
          ...quiz,
          answersArray: insertAnswerAtRandomPosition(
            quiz.incorrect_answers,
            quiz.correct_answer
          ),
        }))
        setQuizes(quizzesWithShuffledAnswers)
      })

    return () => {
      setQuizes([])
      setSelectedAnswers({})
    }
  }, [])

  const questions = quizes.map((quiz, index) => {
    const questionId = `question_${index}`
    const correctAnswer = quiz.correct_answer

    const answers = []
    answers.push(quiz.correct_answer)
    for (let i = 0; i < quiz.incorrect_answers.length; i++) {
      answers.push(quiz.incorrect_answers[i])
    }

    const eachAnswer = answers?.map((answer) => {
      return (
        <label
          key={nanoid()}
          className={`answer-btn 
            ${selectedAnswers[questionId] === answer ? "checked-style" : ""}
            ${
              isAnswerChecked
                ? selectedAnswers[questionId] === answer &&
                  selectedAnswers[questionId] === correctAnswer
                  ? "correct-answer"
                  : selectedAnswers[questionId] === answer
                  ? "wrong-answer"
                  : ""
                : ""
            }
             
            }`}
        >
          <input
            checked={selectedAnswers[questionId] === answer}
            onChange={(event) => handleAnswerChange(event, questionId)}
            key={nanoid()}
            className="answer"
            type="radio"
            value={answer}
            disabled={isAnswerChecked}
          />
          {decode(answer)}
        </label>
      )
    })

    return (
      <div key={nanoid()}>
        <h3 className="question">{decode(quiz.question)}</h3>
        <div className="answers">{eachAnswer}</div>
        <div className="divider"></div>
      </div>
    )
  })

  return (
    <div className="quizz-page">
      <div>
        {questions}
        <div className="btn-container">
          {isAnswerChecked ? (
            <div className="score-container">
              <p className="score">
                {`You scored ${quizzScore}/5 correct answers`}{" "}
              </p>
              <button onClick={props.handleStart} className="play-again-btn">
                Play again
              </button>
            </div>
          ) : (
            <button
              onClick={checkAnswers}
              disabled={Object.keys(selectedAnswers).length === 0}
              className="submit-questions"
            >
              Check answers
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
