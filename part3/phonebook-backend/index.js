const express = require('express')
const morgan = require('morgan')

const app = express()

// Use express.json() middleware to parse the request body as JSON when appropriate
app.use(express.json())

// Use static middleware to serve the frontend build
app.use(express.static('dist'))

// Use and configure morgan middleware for logging
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data', {
    skip: (req) => req.method !== 'POST',
    stream: process.stdout
}))
app.use(morgan('tiny', {
    skip: (req) => req.method === 'POST'
}))
morgan.token('data', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '')

let persons = [
    {
      "id": "1",
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": "2",
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": "3",
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": "4",
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    const info = `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
    response.send(info)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).json({ error: `Person with id ${id} not found` })
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const { name, number } = request.body

    if (!name || !number) {
        return response.status(400).json({ error: 'Name or number is missing' })
    }

    const nameExists = persons.some(person => person.name === name)
    if (nameExists) {
        return response.status(400).json({ error: 'Name must be unique' })
    }

    const newPerson = {
        id: (Math.floor(Math.random() * 10000) + 1).toString(),
        name,
        number
    }

    persons = persons.concat(newPerson)
    response.status(201).json(newPerson)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
