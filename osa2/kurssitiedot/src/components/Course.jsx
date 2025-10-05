const Header = ({ course }) => <h1>{course.name}</h1>

const Content = ({ course }) => {
  return (
    <>
      <ul>
        {course.parts.map(part => <Part key={part.id} part={part} />)}
      </ul>
      <Total course={course} />
    </>
  )
}

const Part = ({ part }) => <li>{part.name} {part.exercises}</li>

const Total = ({ course }) => {
  const total = course.parts.reduce((sum, part) => sum + part.exercises, 0)
  return (
    <p>total of {total} exercises</p>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course} />
      <Content course={course} />
    </div>
  )
}


export default Course