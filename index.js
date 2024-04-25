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

// Hardcoded envelopes
const initialEnvelopes = [
    { id: 1, name: "Groceries", amount: 200 },
    { id: 2, name: "Rent", amount: 1000 },
    { id: 3, name: "Utilities", amount: 150 },
];

// Add initial envelopes to the envelopes array
envelopes.push(...initialEnvelopes);

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

//create a route to retrieve a specific envelope by ID
app.get('/envelopes/:id', (req, res, next) =>{
    //Extract envelope ID from reuest parameters
    const envelopeId = Number(req.params.id);

    //find the envelope with the specified ID
    const envelope = envelopes.find(envelope => envelope.id === envelopeId);

    //Check if envelope with the specified ID exists
    if(!envelope){
        //If envelope is not found, return 404 Not Found status
        return res.status(404).json({ error: 'Envelope not found' });
    }

    //If envelop is found, return envelope information
    res.status(200).json(envelope);

});

//Update specific envelope by ID
app.put('/envelopes/:id', (req, res, next) =>{
    //Extract envelope ID from request parameters
    const envelopeId = Number(req.params.id);

    //Find the index of the envelope with the specified ID
    const envelopeIndex = envelopes.findIndex(envelope => envelope.id === envelopeId);

    //Check if the envelope with the specified ID exists
    if(envelopeIndex === -1){
        //If envelope is not found, return 404 Not Found status
        return res.status(404).json({error : 'Envelope not found'});
    }

    //Extract updated envelope data from request body
    const { name, amount } = req.body;

    //update envelope data
    envelopes[envelopeIndex] = {
        ...envelopes[envelopeIndex],
        name: name || envelopes[envelopeIndex].name, //update name if provided, otherwise keep existing name
        amount: amount !== undefined ? amount : envelopes[envelopeIndex].amount, //Update amount if provided otherwise keep amount
    };

    //respond with the updated envelope
    res.status(200).json(envelopes[envelopeIndex]);
}); 

//delete specific envelope by ID
app.delete('/envelopes/:id', (req, res, next) =>{
    //extract envelope ID from request parameters
    const envelopeId = Number(req.params.id);

    //find the index of the envelope with the specified ID
    const envelopeIndex = envelopes.findIndex(envelope => envelope.id === envelopeId);

    //check if envelope with the specified ID exists
    if(envelopeIndex === -1){
        //if envelope is not found, return 404 not found status
        return res.status(404).json({ error: 'Envelope not found' });
    }

    //remove the envelope from the envelopes array
    envelopes.splice(envelopeIndex, 1);

    //respond with success message
    res.status(200).json({ message: 'Envelope deleted succesfully' });
});

//transfer budget from one envelope to another 
app.post ('/envelopes/transfer', (req, res, next) =>{
    //Extract paramters from request body
    const {fromEnvelopeId, toEnvelopeId, amount } = req.body;

    //find the index of the envelope from which to transfer the amount
    const fromEnvelopeIndex = envelopes.findIndex(envelope => envelope.id ===  fromEnvelopeId);

    //find the index of the envelope to which to transfer the amount 
    const toEnvelopeIndex = envelopes.findIndex(envelope => envelope.id === toEnvelopeId);

    //check if envelopes with the specified IDs exists
    if(fromEnvelopeIndex === -1 || toEnvelopeIndex ===-1){
        //if any of the envlopes is not found, return 404 not found status
        return res.status(404).json({ error: 'One or more envelopes not found' });
    }

    //check if there's enough balance in the 'from' envelope
    if(envelopes[fromEnvelopeIndex].amount < amount) {
        //if there is not enough balance, return 400 bad request status
        return res.status(400).json({ error: 'Insufficient balance in the "from" envelope' });
    }

    //update the amounts in both envelopes
    envelopes[fromEnvelopeIndex].amount -= amount;
    envelopes[toEnvelopeIndex].amount += amount;

    //respond with success message
    res.status(200).json({ message: 'Budget transferred succesfully' });
});

//Start the Server
const PORT = 3000;
app.listen(PORT, () =>{
    console.log(`Server is running on http://localhost:${PORT}`);
});