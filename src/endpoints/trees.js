const express = require('express');
const router = express.Router();
const client = require('../connection');
const rateLimit = require('../rateLimit');
const auth = require('../auth');

/** Tree MODEL
 * @swagger
 *  components:
 *      schemas:
 *          Tree:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: unique id to identify tree
 *                  config:
 *                      $ref: '#/components/schemas/Config'
 *                  username:
 *                      type: string
 *                      description: User that is assigned to the tree
 *
 */

/** Config MODEL
 * @swagger
 *  components:
 *      schemas:
 *          Config:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                      description: name of the tree
 *                  persons:
 *                      type: array
 *                      items:
 *                          type: array
 *                          items:
 *                              oneOf:
 *                                  - type: object
 *                                  - type: integer
 *                      description: The Configuration for the Tree
 *                  lastChanged:
 *                      $ref: '#/components/schemas/lastChanged'
 */

/** lastChanged MODEL
 * @swagger
 *  components:
 *      schemas:
 *          lastChanged:
 *              type: object
 *              properties:
 *                  date:
 *                      type: object
 *                      properties:
 *                          year:
 *                              type: integer
 *                          month:
 *                              type: integer
 *                          day:
 *                              type: integer
 *                      description: Date of last change
 *                  time:
 *                      type: object
 *                      properties:
 *                          hours:
 *                              type: integer
 *                          minutes:
 *                              type: integer
 *                          seconds:
 *                              type: integer
 *                      description: Time of last change
 */

/** TreePost MODEL
 * @swagger
 *  components:
 *      schemas:
 *          TreePost:
 *              type: object
 *              properties:
 *                  config:
 *                      $ref: '#/components/schemas/Config'
 *                  username:
 *                      type: string
 *                      description: User that is assigned to the tree
 *
 */

/** TreeUpdate MODEL
 * @swagger
 *  components:
 *      schemas:
 *          TreeUpdate:
 *              type: object
 *              properties:
 *                  config:
 *                      $ref: '#/components/schemas/Config'
 *
 */

/**
 * @swagger
 *  tags:
 *      name: Trees
 *      description: Endpoints to make CRUD-Operations on trees
 */

/**
 * @swagger
 * /trees:
 *  get:
 *      summary: gets all trees (needs admin key)
 *      tags: [Trees]
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Tree'
 */
router.get('/trees', rateLimit, auth('admin'), (req, res) => {
    client.query(`SELECT * FROM trees`, (err, result) => {
        if (!err) {
            res.status(200).json(result.rows);
        } else {
            res.sendStatus(500);
        }
    });
});

/**
 * @swagger
 * /trees:
 *  post:
 *      summary: Creates a new Tree
 *      tags: [Trees]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/TreePost'
 *      responses:
 *          200:
 *              description: 'Tree successfully created. Returns: Created Tree'
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Tree'
 *          403:
 *              description: User not in Database
 */
router.post('/trees', rateLimit, async (req, res) => {
    try {
        const tree = req.body;
        const newTree = await client.query("INSERT INTO trees (config, username) VALUES($1, $2) RETURNING *",
            [tree.config, tree.username]);
        res.status(200).json(newTree.rows[0]);
    } catch (err) {
        if (err.constraint === 'fk_user') {
            res.status(403).send("User not in Database");
        } else {
            res.sendStatus(500);
        }
    }
});

/**
 * @swagger
 * /trees/{id}:
 *  put:
 *      summary: Updates config of existing Tree
 *      tags: [Trees]
 *      parameters:
 *          - in: path
 *            name: id
 *            type: integer
 *            required: true
 *            description: id of the tree to update.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/TreeUpdate'
 *      responses:
 *          200:
 *              description: 'Config successfully updated. Returns: Updated Tree'
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Tree'
 *          404:
 *              description: Tree not found
 */
router.put('/trees/:id', rateLimit, async (req, res) => {
    try {
        const {id} = req.params;
        const {config} = req.body;
        const updatedTree = await client.query("UPDATE trees SET config = $1 where id = $2 RETURNING *",
            [config, id]);
        if (updatedTree.rows.length === 0) {
            res.sendStatus(404);
        } else {
            res.status(200).json(updatedTree.rows[0]);
        }
    } catch (err) {
        res.sendStatus(500);
    }
});

/**
 * @swagger
 * /trees/{id}:
 *  delete:
 *      summary: Deletes existing Tree
 *      tags: [Trees]
 *      parameters:
 *          - in: path
 *            name: id
 *            type: integer
 *            required: true
 *            description: id of the tree to delete.
 *      responses:
 *          200:
 *              description: Tree successfully deleted
 *          404:
 *              description: Tree not found
 */
router.delete('/trees/:id', rateLimit, async (req, res) => {
    try {
        const {id} = req.params;
        const deletedTree = await client.query("DELETE FROM trees WHERE id=$1 RETURNING *",
            [id]);
        if (deletedTree.rows.length === 0) {
            res.status(404).send("Tree not found");
        } else {
            res.status(200).send("Successfully deleted the Tree");
        }
    } catch (err) {
        res.sendStatus(500);
    }
});

/**
 * @swagger
 * /trees/{id}:
 *  get:
 *      summary: gets specific Tree by id (needs admin key)
 *      tags: [Trees]
 *      parameters:
 *          - in: path
 *            name: id
 *            type: integer
 *            required: true
 *            description: id of the tree to get.
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Tree'
 *          404:
 *              description: Tree not found
 */
router.get('/trees/:id', rateLimit, auth('admin'), async (req, res) => {
    try {
        const {id} = req.params;
        const getTreedata = await client.query("SELECT * FROM trees WHERE id = $1", [id]);
        if (getTreedata.rows.length === 0) {
            res.sendStatus(404);
        } else {
            res.status(200).json(getTreedata.rows[0]);
        }
    } catch (err) {
        res.sendStatus(500);
    }
});

/**
 * @swagger
 * /trees/user/{username}:
 *  get:
 *      summary: gets all Trees by username
 *      tags: [Trees]
 *      parameters:
 *          - in: path
 *            name: username
 *            type: string
 *            required: true
 *            description: username of owner of the trees to get.
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Tree'
 *          404:
 *              description: Tree not found
 */

router.get('/trees/user/:username', rateLimit, async (req, res) => {
    try {
        const {username} = req.params; /* Using Params does result in Error 500 for whatever reason */
        const getTreeByUser = await client.query("SELECT * FROM trees WHERE username = $1", [username]);
        if (getTreeByUser.rows.length === 0) {
            res.sendStatus(404);
        } else {
            res.status(200).json(getTreeByUser.rows);
        }
    } catch (err) {
        res.sendStatus(500);
    }
});

module.exports = router;
