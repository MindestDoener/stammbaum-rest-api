const express = require('express');
const router = express.Router();
const client = require('../connection');
const rateLimit = require('../rateLimit');

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


module.exports = router;