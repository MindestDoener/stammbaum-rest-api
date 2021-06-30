const express = require('express');
const router = express.Router();
const client = require('../connection');
const rateLimit = require('../rateLimit');

/** USER MODEL
 * @swagger
 *  components:
 *      schemas:
 *          User:
 *              type: object
 *              required:
 *                  - username
 *                  - password
 *              properties:
 *                  username:
 *                      type: string
 *                      description: unique name to identify user
 *                  password:
 *                      type: string
 *                      description: Encrypted password of user
 *              example:
 *                  username: Peter01
 *                  password: coolesPasswort
 */

/** Password MODEL
 * @swagger
 *  components:
 *      schemas:
 *          Password:
 *              type: object
 *              required:
 *                  - oldPassword
 *                  - newPassword
 *              properties:
 *                  oldPassword:
 *                      type: string
 *                      description: Current password
 *                  newPassword:
 *                      type: string
 *                      description: New Password
 *              example:
 *                  oldPassword: coolesPasswort
 *                  newPassword: cooleresPasswort
 */

/**
 * @swagger
 *  tags:
 *      name: Users
 *      description: Endpoints to make CRUD-Operations on USERTABLE
 */

/**
 * @swagger
 * /users:
 *  get:
 *      summary: gets all Users
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/User'
 */
router.get('/users', rateLimit, (req, res) => {
    client.query(`SELECT * FROM USERTABLE`, (err, result) => {
        if (!err) {
            res.status(200).json(result.rows);
        } else {
            res.sendStatus(500);
        }
    });
});

/**
 * @swagger
 * /users:
 *  post:
 *      summary: Creates a new User
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          201:
 *              description: 'User successfully created. Returns: Created User'
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          403:
 *              description: Username already exists
 */
router.post('/users', rateLimit, async (req, res) => {
    try {
        const user = req.body;
        const newUser = await client.query("INSERT INTO USERTABLE (username, password) VALUES($1, $2) RETURNING *",
            [user.username, user.password]);
        res.json(newUser.rows[0],).status(201);
    } catch (err) {
        if (err.constraint === 'usertable_pkey') {
            res.status(403).send("Username already exists");
        } else {
            res.sendStatus(500);
        }
    }
});

/**
 * @swagger
 * /users/{username}:
 *  get:
 *      summary: gets specific User by username
 *      tags: [Users]
 *      parameters:
 *          - in: path
 *            name: username
 *            type: string
 *            required: true
 *            description: username of the user to get.
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          404:
 *              description: User not found
 */
router.get('/users/:username', rateLimit, async (req, res) => {
    try {
        const {username} = req.params;
        const getUserdata = await client.query("SELECT * FROM USERTABLE WHERE username = $1", [username]);
        if (getUserdata.rows.length === 0) {
            res.sendStatus(404);
        } else {
            res.status(200).json(getUserdata.rows[0]);
        }
    } catch (err) {
        res.sendStatus(500);
    }
});

/**
 * @swagger
 * /users/{username}:
 *  put:
 *      summary: Updates password of existing User
 *      tags: [Users]
 *      parameters:
 *          - in: path
 *            name: username
 *            type: string
 *            required: true
 *            description: username of the user to update.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Password'
 *      responses:
 *          200:
 *              description: 'Password successfully updated. Returns: Updated User'
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          404:
 *              description: User not found
 */
router.put('/users/:username', rateLimit, async (req, res) => {
    try {
        const {username} = req.params;
        const {newPassword, oldPassword} = req.body;
        const updatedUser = await client.query("UPDATE USERTABLE SET password = $1 where username = $2 AND password = $3 RETURNING *",
            [newPassword, username, oldPassword]);
        if (updatedUser.rows.length === 0) {
            res.sendStatus(404);
        } else {
            res.status(200).json(updatedUser.rows[0]);
        }
    } catch (err) {
        res.sendStatus(500);
    }
});

/**
 * @swagger
 * /users:
 *  delete:
 *      summary: Deletes existing User
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          200:
 *              description: User successfully deleted
 *          404:
 *              description: User not found
 */
router.delete('/users', rateLimit, async (req, res) => {
    try {
        const user = req.body;
        const deletedUser = await client.query("DELETE FROM USERTABLE WHERE username=$1 AND password=$2 RETURNING *",
            [user.username, user.password]);
        if (deletedUser.rows.length === 0) {
            res.sendStatus(404);
        } else {
            res.status(200).send("Successfully deleted the User");
        }
    } catch (err) {
        res.sendStatus(500);
    }
});

module.exports = router;
