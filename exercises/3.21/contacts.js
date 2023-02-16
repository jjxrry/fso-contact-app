const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log(`connecting to ${url}`)

mongoose.connect(url)
    .then(result => {
        console.log(`connected to MongoDB`)
    })
    .catch((error) => {
        console.log(`error connecting to MongoDB`, error.message)
    })

const contactSchema = new mongoose.Schema({
        name: {
            type: String,
            minLength: 3,
            required: true,
        },
        number: {
            type: String,
            validate: {
                validator: (n) => {
                    return /\d{3}-\d{7}/.test(n) || /\d{2}-\d{8}/.test(n)
                },
                message: props => `${props.value} is not a valid phone number!`
            },
            required: [true, 'Contact number missing']
        },
        id: Number,
    })

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Contact', contactSchema)

// console.log(`Phonebook:`)
// Contact.find({/*can add filters/restrictions here EXAMPLE: ----------important: true -------*/}).then(result => {
//     result.forEach(contact => {
//         console.log(`${contact.name} ${contact.number}`)
//     })
//     mongoose.connection.close()
//     })
     
// const contact = new Contact({
//     name: process.argv[3],
//     number: process.argv[4],
// })

// if (contact.name && contact.number !== undefined) {
//     contact.save().then(result => {
//         console.log(`added ${contact.name} ${contact.number} to phonebook!`)
//         mongoose.connection.close()
//     })
// }