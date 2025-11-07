const Header = ({ course }) => <h1>{course}</h1>

const Part = ({ name, exercises }) => <p>{name} {exercises}</p>

const Content = ({ parts }) => {
  const partElements = parts.map(part => 
    <Part key={part.id} name={part.name} exercises={part.exercises}/>
  )
  return (
    <>
      {partElements}
    </>
  )
}

const Total = ({ parts }) => {
  let sum = parts.reduce((acc, part) => acc + part.exercises, 0)
  console.log("Computed total:", sum)
  return (
    <p><strong>Number of exercises {sum}</strong></p>
  )
}

const Course = ({ course }) => {
  console.log("Rendering course:", course)
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}

export default Course