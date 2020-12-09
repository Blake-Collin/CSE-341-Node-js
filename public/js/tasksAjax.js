
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
        if(!data.success)
        {
            $('#loginErr').html("* Incorrect Login!");
        }
        else
        {
            //Groups View 
            createGroupView();
        }
    })

}

function logout() {
    ajaxPost("/logout", [], function(error, data) {
        if(error == null)
        {
            loginView();
        }
    })
}

//Crate Login view
function loginView(){
    ajaxPost('/verifyLogin', [], function(err, data){
        if(data != null && data.success)
        {
            createGroupView();
        }
        else
        {
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
    })
    
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
    name.setAttribute('maxlength','30');
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
    user.setAttribute('maxlength','30');
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
   

    ajaxPost('/getGroups', [], function(error, data) {
        if(data.success)
        {
                $('#main').empty();
                
                //setup
                var div = document.createElement('div');
                div.className ='GroupSelect';

                //Label
                var label = document.createElement('h1');
                label.innerHTML = "Group Menu";
                div.appendChild(label);

                //Table creation
                var table = document.createElement('table')
                
                //Headers
                var trh = document.createElement('tr');
                var th1 = document.createElement('th');
                th1.innerHTML = "Group";
                var th2 = document.createElement('th');
                th2.innerHTML = "Select";
                trh.appendChild(th1);
                trh.appendChild(th2);
                table.appendChild(trh);


                //Rows
                for (var i = 0; i < data.results.length; i++)
                {
                    var tr = document.createElement('tr');
                    
                    var td = document.createElement('td');
                    td.innerHTML = data.results[i].name;                    
                    tr.appendChild(td);

                    var td2 = document.createElement('td');
                    
                    var buttonOpen = document.createElement('button');
                    buttonOpen.innerHTML = "Open";
                    buttonOpen.value = data.results[i].id;
                    buttonOpen.name = data.results[i].name
                    buttonOpen.addEventListener('click', function(){ openGroupView(this.value, this.name); })
                    td2.appendChild(buttonOpen);
                    tr.appendChild(td2);
                    table.appendChild(tr);
                }

                //Bottom/create group / Logout

                var div2 = document.createElement('div');
                div2.class = "createGroup";
                
                var label2 = document.createElement('label');
                label2.innerHTML = "Group Name: ";
                
                //Input creation
                var input = document.createElement('input');
                input.setAttribute('type', 'text');
                input.setAttribute('maxlength','30');
                input.id = "groupName";

                //Create button creation
                var createButton = document.createElement('button');
                createButton.innerHTML = "Create Group";
                createButton.addEventListener('click', createGroup);


                //Merge div2
                label2.appendChild(input);
                div2.appendChild(label2);
                div2.appendChild(createButton);


                //logout button     
                var logoutButton = document.createElement('button');
                logoutButton.addEventListener('click', logout);
                logoutButton.innerHTML = "Logout";

                //Final appends
                div.appendChild(table);
                div.appendChild(div2);
                div.appendChild(logoutButton);
                

                $('#main').append(div);
        }
    })

    // //buttons etc
    // var label = document.createElement('label');
    // label.innerHTML = "Group ID: ";
    // var input = document.createElement('input');
    // input.setAttribute('id','id');
    // input.setAttribute('type','number');
    // var getGroup = document.createElement('button');
    // getGroup.addEventListener('click', group);
    // getGroup.innerHTML = "Get Group";
    // var getTasks = document.createElement('button');
    // getTasks.addEventListener('click', tasks);
    // getTasks.innerHTML = "Get Tasks";

    // //logout
    // var logoutButton = document.createElement('button');
    // logoutButton.addEventListener('click', logout);
    // logoutButton.innerHTML = "Logout";
    
    // var results = document.createElement('p');  
    // results.setAttribute('id','results');
    // div.appendChild(label);
    // div.appendChild(input);
    // div.appendChild(getGroup);
    // div.appendChild(getTasks);
    // div.appendChild(logoutButton);
    // div.appendChild(document.createElement('br'));
    // div.appendChild(results);

    // $('#main').append(div);
    
}

//Insert new group and set as admin
function createGroup(){
    var name = document.getElementById('groupName').value;
    if(name.length > 3){
        console.log(name);
        var getQuery = '/createGroup?name=' + name;
        ajaxGet(getQuery, function(error, data){
            if(data.success)
            {
                openGroupView(data.results[0].id, data.results[0].name);
            }
        })
    }
}

//Create and open the group view
function openGroupView(id, name){
    console.log("Group: " + name + " ID: " + id + " Has been summoned!")    
    var getQuery = '/getTasks?id=' + id;
    ajaxGet(getQuery, function(err, data) { 
        if(!err && data != null && data.success)
        {
            $('#main').empty();

            var div = document.createElement('div');
            div.className = "TasksView";

            var h1 = document.createElement('h1');
            h1.innerHTML = name;
            h1.id = "GroupName";
            h1.value = id;
            div.appendChild(h1);

            var table = document.createElement('table');
            
            var trh = document.createElement('tr');
            var th1 = document.createElement('th');
            var th2 = document.createElement('th');
            var th3 = document.createElement('th');
            var th4 = document.createElement('th');

            th1.innerHTML = "Created by";
            th2.innerHTML = "Task";
            th3.innerHTML = "Due Date";
            th4.innerHTML = "Choices";

            trh.appendChild(th1);
            trh.appendChild(th2);
            trh.appendChild(th3);
            trh.appendChild(th4);
            table.appendChild(trh);

            //The Rows
            for (var i = 0; i < data.results.length; i++){
                //TAGS 
                var tr = document.createElement('tr');
                var td1 = document.createElement('td');
                var td2 = document.createElement('td');
                var td3 = document.createElement('td');
                var td4 = document.createElement('td');

                //Add in inner html

                td1.innerHTML = data.results[i].name;
                td2.innerHTML = data.results[i].task_name;
                var date = new Date(data.results[i].duedate.replace("T00:00:00.000Z", "T07:00:00.000Z"));
                td3.innerHTML = (date.getMonth()+1) + '-' + date.getDate() + '-' + date.getFullYear();                

                //BUTTONS
                var buttonComplete = document.createElement('button');
                var buttonDelete = document.createElement('button');
                buttonComplete.innerHTML = "Complete";
                buttonComplete.value = data.results[i].id;
                buttonComplete.addEventListener('click', function() { completeTask(this.value); })

                buttonDelete.innerHTML = "Delete";
                buttonDelete.value = data.results[i].id;
                buttonDelete.addEventListener('click', function() { deleteTask(this.value); })

                td4.appendChild(buttonComplete);
                td4.appendChild(buttonDelete);

                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);

                table.appendChild(tr);
            }

            div.appendChild(table);

            div.appendChild(document.createElement('br'));
            
            //Add Tasks

            var div2 = document.createElement('div');
            
            var label = document.createElement('label');
            label.innerHTML = "Task Name: ";

            var input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.id = "newTaskName";
            label.appendChild(input);
            input.setAttribute('maxlength','30');

            var label2 = document.createElement('label');
            label2.innerHTML = " Date: ";

            var dateInput = document.createElement('input');
            dateInput.setAttribute('type', 'date');
            dateInput.id = "newTaskDate";
            label2.appendChild(dateInput);

            var createButton = document.createElement('button');
            createButton.value = id;
            createButton.addEventListener('click', function() { createTask(this.value) });
            createButton.innerHTML = "Create Task";

            div2.appendChild(label);
            div2.appendChild(label2);
            div2.appendChild(createButton);            

            div.appendChild(div2);

            
            div.appendChild(document.createElement('br'));

            //Add user if admin
            var div4 = document.createElement('div');
            var labeluser = document.createElement('label');
            labeluser.innerHTML = "Username: ";

            var userInput = document.createElement('input');
            userInput.setAttribute('id', 'newUser');
            
            labeluser.appendChild(userInput);

            var addUser = document.createElement('button');
            addUser.innerHTML = "Add User";
            addUser.value = id;
            addUser.addEventListener('click', function() { addUserToGroup(this.value)});

            div4.appendChild(labeluser);
            div4.appendChild(addUser);

            var error = document.createElement('span');
            error.className = "error";
            error.id = "CreationStatus";
            error.innerHTML = "*";
            div4.appendChild(error);

            if(data.admin){
                div.appendChild(div4);
            }

            div.appendChild(document.createElement('br'));

            //Logout and Back to Groups View
            var div3 = document.createElement('div');

            //logout button     
            var logoutButton = document.createElement('button');
            logoutButton.addEventListener('click', logout);
            logoutButton.innerHTML = "Logout";

            //Back
            var back = document.createElement('button');
            back.addEventListener('click', createGroupView);
            back.innerHTML = "Back";
            
            div3.appendChild(logoutButton);
            div3.appendChild(back);
            
            div.appendChild(div3);

            $('#main').append(div);
        }
    })
}

//Modify Buttons
function deleteTask(id){
    console.log('ID: ' + id);
    var name = document.getElementById('GroupName').innerHTML;
    var group_id = document.getElementById('GroupName').value;
    var userArray = {id: id};

    ajaxPost('/deleteTask', userArray, function(error, data) {
        if(data.success) {
            openGroupView(group_id, name);
        }
        else
        {
            alert("Failure to Delete Task!");   
        }
    });
}

function completeTask(id){
    console.log('ID: ' + id);
    var name = document.getElementById('GroupName').innerHTML;
    var group_id = document.getElementById('GroupName').value;
    var userArray = {id: id};

    ajaxPost('/completeTask', userArray, function(error, data) {
        if(data.success) {
            openGroupView(group_id, name);
        }
        else
        {
            alert("Failure to Complete Task!");
        }
    });
}

function createTask(id){
    var taskName = document.getElementById('newTaskName').value;
    var date = document.getElementById('newTaskDate').value;
    var name = document.getElementById('GroupName').innerHTML;

    console.log("Name: " + taskName + " Date: " + date);    

    var userArray = {task_name: taskName, date: date, group_id: id};

    ajaxPost('/addTask', userArray, function(error, data){
        if(data.success)
        {
            openGroupView(id, name);
        }
    })

}

function addUserToGroup(id){
    var user = document.getElementById('newUser').value;    

    var userArray = {username: user, group_id: id};

    console.log(userArray);

    if(user.length >= 3)
    {
        ajaxPost('/addUserToGroup', userArray, function(error, data) {
            if(!data.success) {
                document.getElementById('CreationStatus').innerHTML = "* " + data.message;
            }
            else{
                document.getElementById('CreationStatus').innerHTML = "* " + data.message;
            }
        })
    }
    else 
    {
        document.getElementById('CreationStatus').innerHTML = "* Usernames are at least 3 characters";
    }
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
    }).fail(function (err){
        console.log(err);
        callback(err, null);
    })
}

function ajaxPost(postString, array, callback) {
    $.post(postString, array).done(function(data){
        console.log(data);        
        callback(null, data);
    }).fail(function (err){
        console.log(err);
        callback(err, null);
    })
}
