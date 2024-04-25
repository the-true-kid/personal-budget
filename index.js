//index.js
//Create an Express Application
const express = require('express');
const bodyParser = require('body-parser') // Import body-parser

const app = express();

//Middleware to parse JSON bodies
app.use(bodyParser.json());

//global variables
let envelopes = []; //array to store envelope objects
let totalBudget = 0; //total budget


//Create a Route
app.get('/', (req, res, next) =>{
    res.send('Hello, World');
});

app.post('/envelopes', (req, res, next) =>{
    //extract envelope information from request body
    const { id, name, amount } = req.body;

    const envelope = {
        id,
        name, 
        amount
    };

    //add the envelope to the envelopes array
    envelopes.push(envelope);

    //respond with the newly created envelope
    res.status(201).json(envelope);
});

app.get('/envelopes', (req, res, next) =>{
    //return all envelopes
    res.status(200).json(envelopes);
});

//Start the Server
const PORT = 3000;
app.listen(PORT, () =>{
    console.log(`Server is running on http://localhost:${PORT}`);
});