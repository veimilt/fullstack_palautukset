require('dotenv').config()
const express = require('express')
const morgan = require('morgan');
const cors = require('cors')
const Person = require('./models/contact')

const app = express()

// enable express json parser -middleware
app.use(express.json())

app.use(cors())

app.use(express.static('dist'))

// enable morgan
// luodaan oma token 'body'
morgan.token('body', (req) => JSON.stringify(req.body));

// luodaan oma formaatti, joka pohjautuu tinyn formattiin + bodyyn
app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}


let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": "1"
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": "2"
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": "3"
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": "4"
    }
]

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findById(id)
        .then(foundPerson => {
            if (foundPerson) {
                response.json(foundPerson)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
    // const person = persons.find((p) => p.id === id)
    // if (person) {
    //     response.json(person)
    // } else {
    //     response.status(404).end()
    // }
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} persons.</p><p>${new Date().toString()}</p>`)
})

// function getRandomInt(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    //above javascript object is there because of the json parser is enabled

    if (!body.number || !body.name) {
        return response.status(400).json({
            error: "number or name missing in the request body"
        })
    }
    const newName = body.name

    const newPerson = new Person({
        name: newName,
        number: body.number,
    })

    newPerson.save()
        .then(savedPerson => {
            console.log(`Added ${newName} number ${body.number} to phonebook`)
            response.json(newPerson)
        })
        .catch(error => next(error))

    // if (persons.some(p => p.name === newName)) {
    //     return response.status(400).json({
    //         error: "name already in the phonebook"
    //     })
    // }

    // const person = {
    //     name: newName,
    //     number: body.number,
    //     id: String(getRandomInt(100, 1000000000))
    // }
    // persons = persons.concat(person)
    // console.log(person)
})

app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    const { number } = request.body
    Person.findByIdAndUpdate(
        id,
        { number: number }
    )
        .then(oldPerson => {
            console.log(`updated the person ${id} number from ${oldPerson.number} to ${number}`)
            response.json({ ...oldPerson.toObject(), number })
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    // persons = persons.filter((p) => p.id !== id)
    Person.findByIdAndDelete(id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log("error message from the errorHandler\n", error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})