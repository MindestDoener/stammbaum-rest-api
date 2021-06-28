const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

const options = {
    definition: {
        info: {
            title: "Stammbaum Rest-Api",
            version: "1.0.0",
            description:
                "This is a Rest-Api for stammbaum-app",
            contact: {
                name: "Mindestdöner",
                url: "https://github.com/MindestDoener",
            },
        },
        servers: [
            {
                url: "http://localhost:3000/",
            },
        ],
    },
    apis: ["./app.js"],
};

const specs = swaggerJsdoc(options);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);

app.get('/', (req, res) => {
    res.send('Rest Api is Running');
});

app.listen(3000, () => {
    console.log('server running at port 3000');
});
