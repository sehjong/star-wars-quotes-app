console.log('May Node be with you')

const express = require('express');
const bodyParser= require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()
const connectionString = process.env.DB_STRING

// MongoClient.connect(connectionString, (err, client) => {
//     if (err) return console.error(err)
//     console.log('Connected to Database')
// })

// MongoClient.connect(connectionString, {
//     useUnifiedTopology: true
// }, (err, client) => {
//     if (err) return console.error(err)
//     console.log('Connected to Database')
// })

MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('star-wars-quotes')
        const quotesCollection = db.collection('quotes')
        app.set('view engine', 'ejs')
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(express.static('public'))
        app.use(bodyParser.json())

        app.get('/', (req, res) => {
            // const cursor = db.collection('quotes').find().toArray()
            quotesCollection.find().toArray()
            .then(results => {
                console.log(results)
                res.render('index.ejs', {quotes: results})
            })
            .catch(error => console.error(error))
            //res.sendFile(__dirname + '/index.html')
        })
        app.post('/quotes', (req, res) => {
            //console.log(req.body)
            quotesCollection.insertOne(req.body)
                .then(result => {
                    console.log(result)
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })
        app.put('/quotes', (req, res) => {
            //console.log(req.body)
            quotesCollection.findOneAndUpdate(
                { name: 'Yoda' },
                {
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote,
                    }
                },
                {
                    upsert: true
                }
            )
            .then(result => {
                console.log(result)
                res.json('Success')
            })
            .catch(error => console.error(error))
        })
        app.delete('/quotes', (req, res) => {
            quotesCollection.deleteOne(
                {name: req.body.name}
            )
            .then(result => {
                if (result.deletedCount === 0) {
                    return res.json('No quote to delete')
                }
                res.json("Deleted Darth Vader's quote")
            })
            .catch(error => console.error(error))
        })
        app.listen(3000, function() {
            console.log('listening on 3000')
        })
    })
    .catch(error => console.error(error))

// app.get('/', (req, res) => {
//    res.send('Hello World')
// })

// app.post('/quotes', (req, res) => {
//     console.log('Hellooooooooooooooooo!')
// })