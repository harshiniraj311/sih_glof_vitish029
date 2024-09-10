const express = require('express');
const http = require('http');
const bcrypt = require('bcrypt');
const path = require("path");
const bodyParser = require('body-parser');
const users = require('./data').userDB;

const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/homepage', (req, res) => {
    res.sendFile(path.join(__dirname, 'homepage.html'));
});

app.post('/register', async (req, res) => {
    try {
        let foundUser = users.find((data) => req.body.email === data.email);
        if (!foundUser) {
            let hashPassword = await bcrypt.hash(req.body.password, 10);
            let newUser = {
                id: Date.now(),
                username: req.body.username,
                email: req.body.email,
                password: hashPassword,
            };
            users.push(newUser);
            console.log('User list', users);
            res.redirect('/login.html');
        } else {
            res.send("<div align='center'><h2>Email already used</h2></div><br><br><div align='center'><a href='./registration.html'>Register again</a></div>");
        }
    } catch {
        res.send("Internal server error");
    }
});

app.post('/login', async (req, res) => {
    try {
        let foundUser = users.find((data) => req.body.email === data.email);
        if (foundUser) {
            let submittedPass = req.body.password;
            let storedPass = foundUser.password;
            const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
            if (passwordMatch) {
                res.redirect('/homepage');
            } else {
                res.send("<div align='center'><h2>Invalid email or password</h2></div><br><br><div align='center'><a href='./login.html'>Login again</a></div>");
            }
        } else {
            res.send("<div align='center'><h2>Invalid email or password</h2></div><br><br><div align='center'><a href='./login.html'>Login again</a></div>");
        }
    } catch {
        res.send("Internal server error");
    }
});

server.listen(3000, function () {
    console.log("Server is listening on port: 3000");
});
