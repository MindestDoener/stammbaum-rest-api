const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

const ENDPOINT = './endpoints/'

app.use(require(ENDPOINT + 'swagger'));
app.use(require(ENDPOINT + 'user'))

app.get('/', (req, res) => {
    res.send('Rest Api is Running');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('server running at port: ' + port);
    if (!process.env.PORT) {
        console.log("Root: http://localhost:3000/");
        console.log("Docs: http://localhost:3000/api-docs");
    }
});
