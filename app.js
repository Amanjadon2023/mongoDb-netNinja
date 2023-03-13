const express = require('express');
const app = express();
const { ObjectId } = require("mongodb")

const { connectToDb, getDb } = require('./db.js')
let db;
app.use(express.json())
// var cors = require('cors');
const cors = require("cors");

app.options("*", cors({ origin: 'http://localhost:3000', optionsSuccessStatus: 200 }));

app.use(cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 }));
// app.use(cors());
connectToDb((err) => {

    app.listen('3001', () => {
        console.log('server is listening at 3000')
    })
    db = getDb()

})
app.get('/books', (req, res) => {
    let books = [];
    console.log(req,"skjdksk")
    let params = req.query;
    console.log(params)
    //pagination
    if (!(params.page && params.limit)) {
        db.collection('books').find().forEach(book => {
            books.push(book)
        }).then(() => {
            return res.json(books)
        }).catch(() => {
            res.send({ "erorr": "can not fetch a document" })
        })
    }
    else {
        const page = parseInt(params.page);
        const limit = parseInt(params.limit);
        let i=0;
        const pageStarting=page*limit;
        console.log(pageStarting)
        db.collection('books').find().forEach(book => {
            i++;
            if(i>pageStarting && i<=(pageStarting+limit))
                books.push(book)
        }).then(() => {
            return res.json(books)
        }).catch(() => {
            res.send({ "erorr": "can not fetch a document" })
        })
    }
    // res.json({'msg':'this is our api'})
})
app.get('/books/:id', (req, res) => {
    let books = [];
    const id = req.params.id;
    console.log(id + "j")
    db.collection('books').find().forEach(book => {
        const bookId = book._id + "";
        if (bookId === id)
            books.push(book)
    })
        .then(() => {
            return res.json(books)
        }).catch(() => {
            res.send({ "erorr": "can not fetch a document" })
        })
    // res.json({'msg':'this is our api'})
})
app.post('/books', (req, res) => {
    const booktoBeAdded = req.body;
    db.collection('books').insertOne(booktoBeAdded).then((result) => {
        return res.json(result);
    }).catch((err) => {
        return res.json({ "error": "can't add a document" })
    })
})
app.post('/', (req, res) => {
    const userData = req.body;
    db.collection('userTable').insertOne(userData).then((result) => {
        return res.json(result);
    }).catch((err) => {
        return res.json({ "error": "can't add a document" })
    })
})

//delete
app.delete('/books', (req, res) => {
    const id = req.query._id;
    console.log(id)
    db.collection('books').deleteOne({ _id: new ObjectId(id) })
        .then((result) => {
            return res.json(result)
        }).catch(() => {
            res.send({ "erorr": "not able to find document" })
        })
    // res.json({'msg':'this is our api'})
})
//update patch
app.patch('/books', (req, res) => {
    const id = req.query._id;
    console.log(id)
    db.collection('books').updateOne({ _id: new ObjectId(id) }, { $set: { rating: 9, pages: 500 } })
        .then((result) => {
            return res.json(result)
        }).catch(() => {
            res.send({ "erorr": "not able to update document" })
        })
    // res.json({'msg':'this is our api'})
})
