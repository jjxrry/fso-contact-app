const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const Contacts = require('./models/contacts')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(requestLogger)
app.use(express.json())
app.use(express.static('dist'))


morgan.token('objectContent', function(req, resp) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :objectContent'))


let persons = [
]

const generateId = () => {
  const newId = Math.floor(Math.random() * 1000)
  return newId
}

app.post('/api/persons', (req, resp) => {
  const body = req.body

  console.log(body.name);

  if (!body.name || !body.number) {
    return resp.status(400).json({
      error: 'Request content missing'
    })
  }

  const newContact = new Contacts({
    id: generateId(),
    name: body.name,
    number: body.number,
    date: new Date(),
  })

  if(persons.find(c => c.name === body.name)) {
    return resp.status(400).json({
      error: 'Contact name must be unique'
    })
  }

  newContact.save().then(savedContact => {
    resp.json(savedContact)
  })
})

app.get('/api/persons', (req, resp) => {
  Contacts.find({}).then(contacts => {
    resp.json(contacts)
  })
})

app.get('/info', (req, resp) => {
  const length = persons.length
  resp.send(
  `<p>Phonebook has info for ${length} people</p>
  <p>${new Date()}</p>`
  )
})

app.get('/api/persons/:id', (req, resp) => {
  Contacts.findById(request.params.id).then(contact => {
    resp.json(contact)
  })
})

app.delete('/api/persons/:id', (req, resp) => {
  Contacts.findByIdAndDelete(req.params.id)
    .then(result => {
      resp.status(204).end()
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`)
})