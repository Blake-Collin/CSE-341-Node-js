
//Login Functions
function login(){
    var user = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    if(user == "" || password == "")
    {
        $('#loginErr').html("* Need Both Credentials!");
        return;
    }

    var userArray = {username: user, password: password };

    console.log(userArray);

    ajaxPost('/loginUser', userArray, function(error, data) {
        if(data.loginStatus == "Incorrect Login!")
        {
            $('#loginErr').html("* " + data.loginStatus);
        }
        else
        {
            //Groups View   
            $('#loginErr').html("* " + "Success");
        }
    })

}

//Crate Login view
function loginView(){
    $('#main').empty();

    //Elements to add
    var div = document.createElement('div');
    div.className = "login";

    var loginErr = document.createElement('span');
    loginErr.setAttribute('id','loginErr');
    loginErr.className = "error";
    div.appendChild(loginErr);

    //username
    var userLabel = document.createElement('label');
    userLabel.innerHTML = "Username: ";
    var userInput = document.createElement('input');
    userInput.setAttribute('id','username');
    userInput.setAttribute('type', 'text');
    userLabel.appendChild(userInput);
    div.appendChild(userLabel);

    //Password
    var passLabel = document.createElement('label');
    passLabel.innerHTML = "Password: ";
    var passInput = document.createElement('input');
    passInput.setAttribute('id', 'password');
    passInput.setAttribute('type','password');
    passLabel.appendChild(passInput);
    div.appendChild(passLabel);

    //buttons
    var buttonLogin = document.createElement('button');
    buttonLogin.setAttribute('id', 'login');
    buttonLogin.addEventListener('click', login);
    buttonLogin.innerHTML = "Login";
    div.appendChild(buttonLogin);

    var buttonCreate = document.createElement('button');
    buttonCreate.setAttribute('id', 'create');
    buttonCreate.addEventListener('click', createView);
    buttonCreate.innerHTML = "Create Account";
    div.appendChild(buttonCreate);

    $('#main').append(div);
}

//Create new view for creating a login
function createView(){
    $('#main').empty();

    //Elements to add
    var div = document.createElement('div');
    div.className = "createLogin";

    //loginerr
    var loginErr = document.createElement('span');
    loginErr.setAttribute('id', 'loginErr');
    loginErr.className = "error";
    div.appendChild(loginErr);

    //Name Setup
    var namelabel = document.createElement('label');
    namelabel.innerHTML = "Name: ";
    var nameSpan =  document.createElement('span');
    var nameErr =  document.createElement('span');
    nameErr.setAttribute('id', 'nameErr');
    nameErr.setAttribute('class', 'error');
    nameErr.innerHTML = "*";
    var name = document.createElement('input');
    name.setAttribute('type', 'text');
    name.setAttribute('id', 'name');
    name.onkeyup = function(){ checkName(); };
    //Append Children
    nameSpan.appendChild(name);
    nameSpan.appendChild(nameErr);
    namelabel.appendChild(nameSpan);
    div.appendChild(namelabel);

    //User setup
    var userlabel = document.createElement('label');
    userlabel.innerHTML = "Username: ";
    var userSpan = document.createElement('span');
    var userErr = document.createElement('span');
    userErr.setAttribute('id', 'userErr');
    userErr.setAttribute('class', 'error');
    userErr.innerHTML = "*";
    var user = document.createElement('input');
    user.setAttribute('type', 'text');
    user.setAttribute('id', 'user');
    user.onkeyup = function(){ checkUser(this.id) };
    //Append children
    userSpan.appendChild(user);
    userSpan.appendChild(userErr);
    userlabel.appendChild(userSpan);
    div.appendChild(userlabel);


    //Password Setup
    var pass1label = document.createElement('label');
    pass1label.innerHTML = "Create Password: ";
    var pass1Span = document.createElement('span');
    var pass1Err = document.createElement('span');
    pass1Err.setAttribute('id', "passErr");
    pass1Err.setAttribute('class', 'error');
    pass1Err.innerHTML = "*";
    var pass1 = document.createElement('input');
    pass1.setAttribute('id', 'pass');
    pass1.setAttribute('type','password');
    pass1.onkeyup = function(){ checkPassword('pass'); checkPasswordsMatch(); };
    //Append children
    pass1Span.appendChild(pass1);
    pass1Span.appendChild(pass1Err);
    pass1label.appendChild(pass1Span);
    div.appendChild(pass1label);

    var pass2label = document.createElement('label');
    pass2label.innerHTML = "Verify Password: ";
    var pass2Span = document.createElement('span');
    var pass2Err = document.createElement('span');
    pass2Err.setAttribute('id', "pass2Err");
    pass2Err.setAttribute('class', 'error');
    pass2Err.innerHTML = "*";
    var pass2 = document.createElement('input');
    pass2.setAttribute('id', 'pass2');
    pass2.setAttribute('type','password');    
    pass2.onkeyup = function(){ checkPassword(this.id); checkPasswordsMatch(); };
    //Append children
    pass2Span.appendChild(pass2);
    pass2Span.appendChild(pass2Err);
    pass2label.appendChild(pass2Span);
    div.appendChild(pass2label);
    
    //Buttons
    var create = document.createElement('button');
    create.innerHTML = "Create";
    create.setAttribute('id', 'create');
    create.addEventListener('click', createLogin);
    div.appendChild(create);

    var back = document.createElement('button');
    back.innerHTML = "Back to Login";
    back.setAttribute('id', 'backToLogin');
    back.addEventListener('click', loginView);
    div.appendChild(back);

    $('#main').append(div);
}

//Insert and login new user
function createLogin(){
    checkPassword('pass');
    checkPassword('pass2');
    checkUser('user');
    checkPasswordsMatch();
    checkName();

    if(checkPassword('pass')
        && checkPassword('pass2')
        && checkUser('user')
        && checkPasswordsMatch()
        && checkName())
        {
            var user = document.getElementById('user').value;
            var password = document.getElementById('pass').value;
            var name = document.getElementById('name').value;
            var userArray = {username: user, password: password, name: name };

            ajaxPost('/createUser', userArray, function(error, data) {
                console.log(data.creationStatus == "Success");
                if(data.creationStatus == "Success")
                {
                    loginView();
                    $('#loginErr').html("Account Created! Please Login.");
                }
                else
                {
                    $('#loginErr').html("* " +  data.creationStatus);
                }
            })
        }
}


//Create view to add new user group
function createGroupView(){

}

//Insert new group and set as admin
function crateGroup(){

}

//Create and open the group view
function openGroupView(id){

}

//Creation Password and Verification
var PASSREGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
var NAMEREGEX = /^[a-zA-Z0-9\-]+$/;
var PERSONNAMEREGEX = /^[0-9a-zA-Z' \-]+$/;

function checkUser(inputName) {
    var name = document.getElementById(inputName).value;
    if(!name.match(NAMEREGEX))
    {
        document.getElementById(inputName + "Err").innerHTML = "* Username is inncorrect format must be Letters & Numbers only!";
        return false;
    }
    else if(name.length < 3)
    {
        document.getElementById(inputName + "Err").innerHTML = "* Username must be 3 letters minimum!";
        return false;
    }
    else
    {
        document.getElementById(inputName + "Err").innerHTML = "*";
        return true;
    }
}

function checkPassword(inputPass) {
    var pass = document.getElementById(inputPass).value;
    if(!pass.match(PASSREGEX))
    {
        document.getElementById(inputPass + "Err").innerHTML = "* Minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character is required!";
        return false;
    }
    else
    {
        document.getElementById(inputPass + "Err").innerHTML = "*";
        return true;
    }
}

function checkPasswordsMatch() {
    var pass1 = document.getElementById('pass').value;
    var pass2 = document.getElementById('pass2').value;
    if(pass1 != pass2)
    {
        document.getElementById('loginErr').innerHTML = "* Passwords do not match!";
        return false;
    }
    else
    {
        document.getElementById('loginErr').innerHTML = "";
        return true;
    }

}

function checkName() {
    var name = document.getElementById('name').value;
    if(name == null || name.length < 3)
    {
        document.getElementById('nameErr').innerHTML = "* Name must be at least 3 characters long!"
        return false;
    }
    else if (!name.match(PERSONNAMEREGEX))
    {
        document.getElementById('nameErr').innerHTML = "* Name must be only Letters, Numbers, and Spaces!"
        return false;
    }
    else
    {
        document.getElementById('nameErr').innerHTML = "*"
        return true;
    }
}
//Group Functions
function group()
{
    var id = document.getElementById('id').value;
    var getQuery = '/getGroup?id=' + id;
    ajaxGet(getQuery, function(err, results) {
        if(err || results == null)
        {
            document.getElementById("results").innerHTML = "No Results!";
        }       
        else
        {
            console.log(results);
            document.getElementById("results").innerHTML = "Group Name: " + results.name;
        }
    });
    
}

function tasks()
{
    var id = document.getElementById('id').value;
    var getQuery = '/getTasks?id=' + id;
    ajaxGet(getQuery, function(err, results) {
        if(err || results == null)
        {
            document.getElementById("results").innerHTML = "No Results!";
        }        
        else
        {
            console.log(results);
            document.getElementById("results").innerHTML = "";            
            for(var i = 0; i < results.length; i++)
            {
                var p = document.createElement('p');
                var date = new Date(results[i].duedate);
                p.innerHTML = "Task Name: " + results[i].task_name+ " Created By: " + results[i].name + " Due Date: " + (date.getMonth()+1) + "-" + date.getDate() + "-" + date.getFullYear() + "\n";
                document.getElementById("results").appendChild(p);
            }
        }
    });
}

//Post and get Functions
function ajaxGet(getString, callback) {
    
    $.get(getString, function(data){
        console.log(data);
        callback(null, data);
    })
}

function ajaxPost(postString, array, callback) {
    $.post(postString, array).done(function(data){
        console.log(data);
        callback(null, data);
    })
}