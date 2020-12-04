process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

require('dotenv').config();
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000
app = express();
const mail = require('./models/mail.js');
const mailService = require('./models/mailService.js');

//Session Stuff
const session = require('express-session')


//Project Specifics
const tasks = require('./models/project2/tasks.js')
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//Team Assignments
const math = require('./models/mathOperations.js');
const mathSerivce = require('./models/mathSerivce.js');
const getPerson = require('./models/getPerson.js')
const getParents= require('./models/getParents.js')
const getChildren = require('./models/getChildren.js')

app.use(express.static(path.join(__dirname, 'public')))
//Session SEtup
app.use(session({
    secret: 'Super-Secret-Squrriels!',
    resave: false,
    saveUninitialized: true
  }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))
app.get('/mail', (req, res) => mail.request(req, res))
app.get('/mail_service', (req, res) => mailService.request(req, res))

//Project Specifics
app.get('/getGroup', verifyLogin, tasks.getGroup);
app.get('/getTasks', verifyLogin, tasks.getTasks);
app.post('/loginUser', (req, res) => tasks.postLogin(req, res));
app.post('/createUser', (req, res) => tasks.postCreateUser(req, res));
app.post('/logout', (req, res) => logout(req, res));
app.post('/getGroups', verifyLogin, tasks.postGetGroups);
app.post('/verifyLogin', verifyLogin, success);
app.get('/createGroup', verifyLogin, tasks.getCreateGroup);
app.post('/addUserToGroup', verifyLogin, tasks.addUserToGroup);
app.post('/addTask', verifyLogin, tasks.addTaskToGroup);
app.post('/completeTask', verifyLogin, tasks.postCompleteTask);
app.post('/deleteTask', verifyLogin, tasks.postDeleteTask);


//Team Assignments
app.get('/math', (req, res) => math.request(req, res))
app.get('/math_service', (req, res) => mathSerivce.request(req, res))
app.get('/getPerson', (req, res) => getPerson.request(req, res))
app.get('/getParents', (req, res) => getParents.request(req, res))
app.get('/getChildren', (req, res) => getChildren.request(req, res))

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))


function verifyLogin(request, response, next) {
	if (request.session.user) {
    console.log("Logging User:" + request.session.user + " ID: " + request.session.userid)
		next();
	} else {
		var result = {success:false, message: "Access Denied"};
		response.status(401).json(result);
	}
}

function success(request, response){
  var result = {success:true, message: "Access Granted"};
  response.status(200).json(result);
}

function logout(request, response){
  var result = {success: false}; 
  if (request.session.user) {
      console.log("Logging Out: " + request.session.user);
      request.session.destroy();
      result = {success: true};
  }
  response.json(result);
}