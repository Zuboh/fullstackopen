require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('mongoose')
const app = express()

const Person = require('./models/person')

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// DEFAULT
app.get('/', (_request, response) => {
  response.send('<h1>Hello World!</h1>')
})

//GET
app.get('/api/persons', (_req, res, next) => {
  Person.find({}).then(persons => {
    res.json(persons)
  }).catch(error => next(error))
})


//GET ID
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    }).catch(error => next(error))
})

// POST
app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body
  if (!name || !number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  Person.findOne({ name }).then(existingPerson => {
    if (existingPerson) {
      return res.status(400).json({ error: 'name must be unique' })
    }

    const person = new Person({ name, number })
    person.save().then(savedPerson => res.json(savedPerson)).catch(error => next(error))
  })
})

// INFO
app.get('/info', (_req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      const now = new Date()
      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${now}</p>
      `)
    })
    .catch(error => next(error))
})

// DELETE
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      if (result) res.status(204).end()
      else res.status(404).json({ error: 'person not found' })
    }).catch(error => next(error))
})

// PUT
app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  Person.findByIdAndUpdate(
    req.params.id,
    { number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      if (updatedPerson) {
        res.json(updatedPerson)
      } else {
        res.status(404).json({ error: 'person not found' })
      }
    })
    .catch(error => next(error))
})

// MIDDLEWARE
const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, _request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}


app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
