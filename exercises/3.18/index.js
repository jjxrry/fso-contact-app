const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const Contacts = require('./models/contacts')

//MIDDLEWARE
const requestLogger = (req, resp, next) => {
  console.log('Method:', req.method)
  console.log('Path:  ', req.path)
  console.log('Body:  ', req.body)
  console.log('---')
  next()
}

const unknownEndpoint = (req, resp) => {
  resp.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, resp, next) => {
  console.log(error.message)

  if (error.name === `CastError`) {
    return resp.status(400).send({error: `malfomed id`})
  }
}

morgan.token('objectContent', function(req, resp) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :objectContent'))

//MIDDLEWARE END

app.use(cors())
app.use(requestLogger)
app.use(express.json())
app.use(express.static('dist'))

let persons = []

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

app.get('/info', (req, resp, next) => {
  Contacts.countDocuments()
    .then(length => {
      if (length) {
        resp.send(
          `<p>Phonebook has info for ${length} people</p>
          <p>${new Date()}</p>`
        )
      } else {
        resp.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, resp, next) => {
  Contacts.findById(req.params.id)
  .then(contact => {
    if (contact) {
      resp.json(contact)
    } else {
      resp.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, resp) => {
  Contacts.findByIdAndDelete(req.params.id)
    .then(result => {
      resp.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id',(req, resp, next) => {
  const body = req.body

  const contact = {
    name: body.name,
    number: body.number,
  }

  Contacts.findByIdAndUpdate(req.params.id, contact, {new: body.number})
    .then(updatedContact => {
      resp.json(updatedContact)
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`)
})