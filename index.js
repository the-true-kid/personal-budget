const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

let envelopes = [];
let totalBudget = 0;

const initialEnvelopes = [
    { id: 1, name: "Groceries", amount: 200 },
    { id: 2, name: "Rent", amount: 1000 },
    { id: 3, name: "Utilities", amount: 150 },
];

envelopes.push(...initialEnvelopes);

function findEnvelopeIndexById(req, res, next) {
    const envelopeId = Number(req.params.id);
    const envelopeIndex = envelopes.findIndex(envelope => envelope.id === envelopeId);
    if (envelopeIndex === -1) {
        return res.status(404).json({ error: 'Envelope not found' });
    }
    req.envelopeIndex = envelopeIndex;
    next();
}

function validateTransferParams(req, res, next) {
    const { fromEnvelopeId, toEnvelopeId, amount } = req.body;
    const fromEnvelopeIndex = envelopes.findIndex(envelope => envelope.id === fromEnvelopeId);
    const toEnvelopeIndex = envelopes.findIndex(envelope => envelope.id === toEnvelopeId);
    if (fromEnvelopeIndex === -1 || toEnvelopeIndex === -1) {
        return res.status(404).json({ error: 'One or more envelopes not found' });
    }
    if (envelopes[fromEnvelopeIndex].amount < amount) {
        return res.status(400).json({ error: 'Insufficient balance in the "from" envelope' });
    }
    req.fromEnvelopeIndex = fromEnvelopeIndex;
    req.toEnvelopeIndex = toEnvelopeIndex;
    next();
}

app.get('/', (req, res) => {
    res.send('Hello, World');
});

app.post('/envelopes', (req, res) => {
    const { id, name, amount } = req.body;
    const envelope = { id, name, amount };
    envelopes.push(envelope);
    res.status(201).json(envelope);
});

app.get('/envelopes', (req, res) => {
    res.status(200).json(envelopes);
});

app.get('/envelopes/:id', findEnvelopeIndexById, (req, res) => {
    res.status(200).json(envelopes[req.envelopeIndex]);
});

app.put('/envelopes/:id', findEnvelopeIndexById, (req, res) => {
    const { name, amount } = req.body;
    const envelopeIndex = req.envelopeIndex;
    envelopes[envelopeIndex] = {
        ...envelopes[envelopeIndex],
        name: name || envelopes[envelopeIndex].name,
        amount: amount !== undefined ? amount : envelopes[envelopeIndex].amount,
    };
    res.status(200).json(envelopes[envelopeIndex]);
});

app.delete('/envelopes/:id', findEnvelopeIndexById, (req, res) => {
    envelopes.splice(req.envelopeIndex, 1);
    res.status(200).json({ message: 'Envelope deleted successfully' });
});

app.post('/envelopes/transfer', validateTransferParams, (req, res) => {
    const { amount } = req.body;
    envelopes[req.fromEnvelopeIndex].amount -= amount;
    envelopes[req.toEnvelopeIndex].amount += amount;
    res.status(200).json({ message: 'Budget transferred successfully' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
