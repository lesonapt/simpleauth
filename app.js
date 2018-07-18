const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser');
const app = express();
const secretKey = 'randomscrectkey';
const userMockData = {
    username: 'foo',
    password: 'bar',
    userId: 1
};

const permission = [];
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
    res.status(200);
    res.json({msg:'api worked'});

});

app.post('/authen/v1', verifyToken, (req, res) => {
    jwt.verify(req.token, secretKey, (err, auth) =>{
        if(err){
            res.sendStatus(403);
        }
        res.json({
            auth
        });
    })
});

app.post('/authen/v1/login',(req, res) => {

    try{
        let username = req.body.username;
        let password = req.body.password;
        let exp = Math.floor(Date.now() / 1000) + (1 * 30);

        if(username != userMockData.username || password != userMockData.password){
            res.status(403);
            res.json({
                code: '400',
                message: 'Username or Password inCorrect'
            })
        }

        let userInfoEncode = {
            roles: ['admin', 'user'],
            permissions: ['order', 'update_order', 'by', 'sell'],
            userId: userMockData.userId,
        }

        jwt.sign({data: userInfoEncode, exp: exp}, secretKey, (err, token) => {
            res.json({
                username: username,
                token: token,
                exp: exp
            });
        })
    } catch(error) {
        res.status(500);
        res.json({
            code: '500',
            message: 'Server error'
        })
    }
});


function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader == 'undefined') {
        res.sendStatus(403);
    }
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
}

app.listen(3000, () => console.log('Example app listening on port 3000!'));