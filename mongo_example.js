const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1) 
}

const password = process.argv[2]

const url = `mongodb+srv://jgao:${password}@phonebookcontacts.yhoekul.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
        name: String,
        number: String,
        id: Number,
    })
    
const Contact = mongoose.model('Contact', contactSchema)

console.log(`Phonebook:`)
Contact.find({/*can add filters/restrictions here EXAMPLE: ----------important: true -------*/}).then(result => {
    result.forEach(contact => {
        console.log(`${contact.name} ${contact.number}`)
    })
    mongoose.connection.close()
    })
     
const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4],
})

if (contact.name && contact.number !== undefined) {
    contact.save().then(result => {
        console.log(`added ${contact.name} ${contact.number} to phonebook!`)
        mongoose.connection.close()
    })
}