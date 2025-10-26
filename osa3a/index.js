const express = require('express')
const morgan = require('morgan');

const app = express()

// enable express json parser -middleware
app.use(express.json())

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
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find((p) => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} persons.</p><p>${new Date().toString()}</p>`)
})

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    //above javascript object is there because of the json parser is enabled

    if (!body.number || !body.name) {
        return response.status(400).json({
            error: "number or name missing in the request body"
        })
    }
    const newName = body.name
    if (persons.some(p => p.name === newName)) {
        return response.status(400).json({
            error: "name already in the phonebook"
        })
    }

    const person = {
        name: newName,
        number: body.number,
        id: getRandomInt(100, 1000000000)
    }
    persons = persons.concat(person)
    // console.log(person)
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter((p) => p.id !== id)
    response.status(204).end()
})

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})