const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Usage: node mongo.js <password> [name] [number]')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://ADMIN:${password}@cluster0.tdnaq4w.mongodb.net/?appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const nameArg = process.argv[3]
const numberArg = process.argv[4]

if (nameArg && numberArg) {
  const person = new Person({
    name: nameArg,
    number: numberArg,
  })

  person.save().then(() => {
    console.log(`added ${nameArg} number ${numberArg} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Person.find({}).then(persons => {
    console.log('phonebook:')
    persons.forEach(p => {
      console.log(`${p.name} ${p.number}`)
    })
    mongoose.connection.close()
  })
}