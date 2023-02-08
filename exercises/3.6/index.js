const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => {
  const newId = Math.floor(Math.random() * 1000)
  return newId
}

app.post('/api/persons', (req, resp) => {
  const body = req.body

  // const findName = persons.find(contact => contact.name === body.name)
  // console.log(findName);
  console.log(body.name);

  if (!body.name || !body.number) {
    return resp.status(400).json({
      error: 'Request content missing'
    })
  }

  const newContact = {
    id: generateId(),
    name: body.name,
    number: body.number,
    date: new Date(),
  }

  if(persons.find(c => c.name === body.name)) {
    return resp.status(400).json({
      error: 'Contact name must be unique'
    })
  }

  persons = persons.concat(newContact)

  resp.json(newContact)
})

app.get('/', (req, resp) => {
  resp.send(`<h1>HI LOB</h1>`)
})

app.get('/api/persons', (req, resp) => {
  resp.json(persons)
})

app.get('/info', (req, resp) => {
  const length = persons.length
  resp.send(
  `<p>Phonebook has info for ${length} people</p>
  <p>${new Date()}</p>`
  )
})

app.get('/api/persons/:id', (req, resp) => {
  const id = Number(req.params.id)
  const contact = persons.find(contact => contact.id === id)
  if (contact) {
    resp.json(contact)
  } else {
    resp.send(`Contact does not exist!`)
      resp.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, resp) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)
  
  resp.status(204).end()
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`)
})