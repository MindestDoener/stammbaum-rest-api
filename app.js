const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const client = require('./connection');

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
app.post('/users', (req, res)=> {
    const user = req.body;
    let insertQuery = `INSERT INTO USERTABLE(username, password) 
                       values('${user.username}', '${user.password}')`

    client.query(insertQuery, (err, result)=>{
        if(!err){
            res.send('Insertion was successful')
        }
        else{ console.log(err.message) }
    });
    client.end;
});

//--DELETE REQUEST (Endpoint /users/{username})
app.delete('/users/:username', (req, res)=> {
    let insertQuery = `DELETE FROM USERTABLE WHERE username=${req.params.username}`

    client.query(insertQuery, (err, result)=>{
        if(!err){
            res.send('Deletion was successful')
        }
        else{ console.log(err.message) }
    })
    client.end;
});

//--UPDATE REQUEST (Endpoint /users/{username}) (Update Credentials for existing user)
/*
JSON OBJECT TO SEND IN BODY:
   {
    "username": "hallo",
    "password": "test2"     <- new password from existing user
   }
*/
app.put('/users/:username', (req, res)=> {
    let user = req.body;
    let updateQuery = `UPDATE USERTABLE
                       SET password = '${user.password}'
                       where id = ${user.username}`

    client.query(updateQuery, (err, result)=>{
        if(!err){
            res.send('Update was successful')
        }
        else{ console.log(err.message) }
    })
    client.end;
});

//GET REQUEST (returns password of specific user) (Endpoint /users/{username})
app.get('/users/:username', (req, res)=>{
    client.query(`SELECT * FROM USERTABLE WHERE username=${req.params.username}`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
});

//GET REQUEST (returns every user) (Endpoint /users)
app.get('/users', (req, res)=>{
    client.query(`SELECT * FROM USERTABLE`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
})