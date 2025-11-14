const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json()); // to read JSON body

const customerRoutes = require('./routes/customers');
app.use('/customers', customerRoutes);

app.get('/', (req, res) => {
    res.send("Welcome to Backend");
});

app.listen(PORT, (error) => {
    if (!error){
        console.log("Server is successfully listening at port:", PORT);
    }
    else {
        console.error("An error occurred:", error);
    }
});
