process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

require('dotenv').config();
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000
app = express();
const mail = require('./models/mail.js');
const mailService = require('./models/mailService.js');

//Project Specifics
const tasks = require('./models/project2/tasks.js')
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//Team Assignments
const math = require('./models/mathOperations.js');
const mathSerivce = require('./models/mathSerivce.js');
const getPerson = require('./models/getPerson.js')
const getParents= require('./models/getParents.js')
const getChildren = require('./models/getChildren.js')

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))
app.get('/mail', (req, res) => mail.request(req, res))
app.get('/mail_service', (req, res) => mailService.request(req, res))

//Project Specifics
app.get('/getGroup', (req, res) => tasks.getGroup(req, res));
app.get('/getTasks', (req, res) => tasks.getTasks(req, res));
app.post('/loginUser', (req, res) => tasks.postLogin(req, res));
app.post('/createUser', (req, res) => tasks.postCreateUser(req, res));


//Team Assignments
app.get('/math', (req, res) => math.request(req, res))
app.get('/math_service', (req, res) => mathSerivce.request(req, res))
app.get('/getPerson', (req, res) => getPerson.request(req, res))
app.get('/getParents', (req, res) => getParents.request(req, res))
app.get('/getChildren', (req, res) => getChildren.request(req, res))

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
