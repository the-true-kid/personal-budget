//index.js
//Create an Express Application
const express = require('express');
const app = express();

//Create a Route
app.get('/', (req, res, next) =>{
    res.send('Hello, World');
});

//Start the Server
const PORT = 3000;
app.listen(PORT, () =>{
    console.log(`Server is running on http://localhost:${PORT}`);
});