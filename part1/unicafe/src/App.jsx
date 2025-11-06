import { useState } from 'react'

const Header = ({ text }) => <h1>{text}</h1>

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const Statistics = ({ good, neutral, bad }) => {
  if (good + neutral + bad === 0) {
    return <p>No feedback given</p>
  }
	const totalCount = good + neutral + bad
	const totalScore = 1*good + 0*neutral + (-1)*bad
	const averageScore = (totalScore / totalCount).toFixed(2)
	const positivePercent = ((good / totalCount) * 100).toFixed(2)
  return (
    <>
      <table>
        <tbody>
          <tr>
            <td>Good:</td>
            <td>{good}</td>
          </tr>
          <tr>
            <td>Neutral:</td>
            <td>{neutral}</td>
          </tr>
          <tr>
            <td>Bad:</td>
            <td>{bad}</td>
          </tr>
          <tr>
            <td>All:</td>
            <td>{totalCount}</td>
          </tr>
          <tr>
            <td>Average:</td>
            <td>{averageScore}</td>
          </tr>
          <tr>
            <td>Positive:</td>
            <td>{positivePercent} %</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleFeedbackGenerator = (type) => {
    const handler = () => {
      console.log(type, "button clicked")
      if (type === 'good') setGood(g => g + 1)
      if (type === 'neutral') setNeutral(n => n + 1)
      if (type === 'bad') setBad(b => b + 1)
      
    }
    return handler
  }

  return (
    <>
      <Header text="give feedback" />
      <Button onClick={handleFeedbackGenerator('good')} text="good" />
      <Button onClick={handleFeedbackGenerator('neutral')} text="neutral" />
      <Button onClick={handleFeedbackGenerator('bad')} text="bad" />
      <Header text="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  )
}

export default App
