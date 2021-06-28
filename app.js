const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Rest Api is Running');
});

app.listen(3000, () => {
    console.log('server running at port 3000');
});
