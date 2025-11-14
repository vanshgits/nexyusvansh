const express = require('express');
const app = express();
const PORT = 3000;

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
