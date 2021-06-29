const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const express = require('express');
const router = express.Router();

const options = {
    definition: {
        openapi: "3.0.0",
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
router.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);

module.exports = router;