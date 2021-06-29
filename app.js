const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const client = require('./connection');

app.use(bodyParser.urlencoded({extended: true}));

const ENDPOINT = './endpoints/'

app.use(require(ENDPOINT + 'swagger'));
app.use(require(ENDPOINT + 'user'))
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Rest Api is Running');
});

//----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------REST ENDPOINTS---------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------

//--POST REQUEST (Endpoint /users)
/*
JSON OBJECT TO SEND IN BODY:
   {
    "username": "hallo",
    "password": "test"
   }
 */

app.post('/users', async (req, res)=> {
    try {
        const user = req.body;
        console.log(user);
        const newUser = await client.query("INSERT INTO USERTABLE (username, password) VALUES($1, $2) RETURNING *",
            [user.username, user.password]);
        res.json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//--DELETE REQUEST (Endpoint /users/{username})
app.delete('/users/:username', async (req, res)=> {
    try {
        const { username } = req.params;
        const deleteUser = await client.query("DELETE FROM USERTABLE WHERE username=$1", [username]);
        res.json("Deleted User " + username);
    } catch (err) {
        console.error(err.message);
    }
});

//--UPDATE REQUEST (Endpoint /users/{username}) (Update Credentials for existing user)
/*
JSON OBJECT TO SEND IN BODY:
   {
    "username": "hallo",
    "password": "test2"     <- new password from existing user
   }
*/
app.put('/users/:username', async (req, res)=> {
    try {
        const { username } = req.params;
        const { password } = req.body;
        const updateUser = await client.query("UPDATE USERTABLE SET password = $1 where username = $2",
            [password, username]);
        res.json("Updated User");
    } catch (err) {
        console.error(err.message);
    }
});

//GET REQUEST (returns password of specific user) (Endpoint /users/{username})
app.get('/users/:username', async (req, res)=>{
    try {
        const { username } = req.params;
        const getUserdata = await client.query("SELECT * FROM USERTABLE WHERE username = $1", [username]);
        res.json(getUserdata.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});


//GET REQUEST (returns every user) (Endpoint /users)
app.get('/users', (req, res)=>{
    client.query(`SELECT * FROM USERTABLE`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('server running at port: ' + port);
    if (!process.env.PORT) {
        console.log("Root: http://localhost:3000/");
        console.log("Docs: http://localhost:3000/api-docs");
    }
});

