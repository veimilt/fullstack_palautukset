import { useState, useEffect } from 'react'

import phoneBookService from './services/phonebookservice'

import SearchFilter from './components/SearchFilter'
import AddPersonForm from './components/AddPersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import Footer from './components/Footer'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterString, setFilterString] = useState('')

  const [notificationStyle, setNotificationStyle] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    phoneBookService
      .getAll()
      .then(content => {
        setPersons(content)
      })
  }, [])

  const handleDeletePerson = (id, name) => {
    if (confirm(`Delete ${name}?`)) {
      phoneBookService
        .deletePerson(id)
        .then(responseData => {
          console.log(responseData)
          setPersons(persons.filter(p => p.id !== responseData.id))
        })
        .then(() => {
          setNotificationStyle('good')
          setNotificationMessage(`Deleted ${name}`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 3000)
        })
        .catch(error => {
          if (error.status === 404) {
            setNotificationStyle('bad')
            setNotificationMessage(`Information of ${name} already deleted from server!`)
            setTimeout(() => {
              setNotificationMessage(null)
            }, 3000)
          }
        })
    }
  }

  const handleNumberChange = (event) => {
    const number = event.target.value
    setNewNumber(number)
  }

  const handleNameChange = (event) => {
    const name = event.target.value
    setNewName(name)
  }

  const handleSearch = (event) => {
    const temp = event.target.value
    if (temp.length === 0) {
      setFilterString('')
    } else {
      setFilterString(temp)
    }
  }

  const filteredPersons = filterString
    ? persons.filter(person => person.name.toLowerCase().includes(filterString.toLowerCase()))
    : persons

  const onFormSubmit = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      if (confirm(`${newName} is already added to the phonebook, replace the old number with the new one?`)) {
        const currentPerson = persons.find(person => person.name === newName)
        const updatedPerson = { name: newName, number: newNumber }
        phoneBookService.update(currentPerson, updatedPerson)
          .then(returnedUpdated => {
            setPersons(persons.map(person => person.name !== newName ? person : returnedUpdated))
          })
        setNotificationStyle('good')
        setNotificationMessage(`Updated the number of ${newName}`)
        setTimeout(() => {
          setNotificationMessage(null)
        }, 3000)
      }
    } else {
      const newPerson = { name: newName, number: newNumber }
      phoneBookService.create(newPerson)
        .then(returnedPerson => {
          const copy = [...persons, returnedPerson]
          setPersons(copy)
        })
      setNotificationStyle('good')
      setNotificationMessage(`Added ${newName}`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 3000)
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <SearchFilter name="filter by string:" onChange={handleSearch} />
      <h2>Add a new person</h2>
      <AddPersonForm onSubmit={onFormSubmit} onNameChange={handleNameChange} onNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} onDeletePerson={handleDeletePerson} />
      <Notification message={notificationMessage} notificationType={notificationStyle} />
      <Footer />
    </div>
  )
}

export default App