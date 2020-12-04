const { response } = require('express');
const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = { getGroup: function (request, response) {
                        if(request.query.id || request.session.id)
                        {
                            const id = request.query.id;
                            getGroups(id, function(error, results) {                                
                                if(error != null || results == null)
                                {                                    
                                    response.status(500).json({data: error});
                                }
                                else
                                {                                    
                                    response.status(200).json(results);
                                }
                            })
                        }
                        else
                        {
                            response.status(401).json({error: "Not Logged in!"});
                        }
                        
                    },
                    getTasks: function (request, response) {
                        if(request.session.userid)
                        {
                            const id = request.query.id;                            
                            getTasksSQL(id, function(error, results) {
                                if(error || results == null)
                                {
                                    response.status(500).json({success: false});
                                }
                                else
                                {
                                    //Pull in if admin to group or not
                                    getAdminId(id, function(error, result) {
                                        console.log(result);
                                        if(error || result == null || result.admin_id != request.session.userid)
                                        {
                                            response.status(200).json({success:true, admin:false, results});    
                                        }
                                        else{
                                            response.status(200).json({success:true, admin:true, results});
                                        }
                                    })
                                    
                                }
                            })
                        }
                        else
                        {
                            response.status(500).json({success: false, message:"Not Logged In!"})
                        }                    
                    },
                    postLogin: function (request, response){ 
                        console.log(request.body);
                        if(request.body.username != "" && request.body.password != "")
                        {
                            var pass = request.body.password;
                            var user = request.body.username;

                            getUserInfo(user, pass, function(error, results) {
                                if(error || results == null)
                                {
                                    var result = {success: false, message: "Inccorrect Login!"};
                                    response.status(200).json(result);
                                }
                                else
                                {
                                    var result = {success: true};
                                    request.session.user = user;
                                    console.log(results.id);
                                    request.session.userid = results.id;
                                    response.status(200).json(result);
                                }
                            })
                        }
                        else
                        {
                            response.json({success: false, message: "Need Both Creditentials!"});
                        }
                    },
                    postCreateUser: function(request, response){
                        console.log(request.body);
                        if(request.body.password != "" && request.body.username != "")
                        {
                            var pass = request.body.password;
                            var user = request.body.username;
                            var name = request.body.name;

                            postCreateUser(user, pass, name, function(error, result) {
                                if(error || result == null)
                                {
                                    response.status(200).json({creationStatus: "Non-unique username please try another!"})
                                }
                                else
                                {
                                    response.status(200).json({creationStatus: "Success"});
                                }
                            })
                        }
                        else
                        {
                            response.status(500).json({success: false, creationStatus:"Missing password or username!"})
                        }
                    },
                    postGetGroups: function (request, response){
                        if(request.session.userid)
                        {
                            console.log(request.session.userid);
                            getGroupNames(request.session.userid, function(error, results) {
                                if(error || results == null)
                                {
                                    response.json({success: false, message: "No Groups!"});
                                }
                                else
                                {                                    
                                    response.status(200).json({success: true, results});
                                }
                            })
                        }
                        else
                        {
                            response.status(500).json({success: false, message:"Not Logged In!"})
                        }
                    },
                    getCreateGroup: function(request, response){
                        if(request.session.userid){
                            const name = request.query.name;
                            const id = request.session.userid;
                            createGroup(id, name, function(error, results){
                                if(error || results == null)
                                {
                                    response.status(500).json({success: false, message:"Unknown Failure!"})
                                }
                                else
                                {
                                    response.status(200).json({success:true, results});
                                }
                            })
                        }
                        else
                        {
                            console.log("break");
                            response.status(500).json({success: false, message:"Not Logged In!"})
                        }
                    },
                    addUserToGroup: function(request, response){
                        if(request.body.username)
                        {
                            //verify admin
                            getAdminId(request.body.group_id, function(error, result){
                                if(result.admin_id == request.session.userid)
                                {
                                    addUsernameToGroup(request.body.username, request.body.group_id, function(error, results){
                                        if(error){
                                            response.status(200).json({success: false, message: "User has already been added."})
                                        }
                                        else if(results == null)
                                        {
                                            response.status(200).json({success: false, message: "User doesn't exist."})
                                        }
                                        else{
                                            response.status(200).json({success: true, message: "User added."});
                                        }
                                    })
                                }
                                else
                                {
                                    response.status(200).json({success: false, message: "Not Admin."})
                                }
                            })
                        }
                        else
                        {
                            response.status(500).json({success: false, message:"No Username Provided!"})
                        }
                    }, //{task_name: taskName, date: date, group_id: id};
                    addTaskToGroup: function(request, response) {
                        if(request.body.task_name && request.body.date && request.body.group_id)
                        {
                            addTask(request.session.userid, request.body.group_id, request.body.task_name, request.body.date, function(error, results){
                                if(error || results == null)
                                {
                                    response.status(200).json({success: false, message: "Failure to add task please try again."});
                                }
                                else
                                {
                                    response.status(200).json({success: true, message: "Task Added"});
                                }
                            })
                        }
                        else
                        {
                            response.status(500).json({success: false, message:"Information Missing to Create!"})
                        }
                    },
                    postDeleteTask: function(request, response) {
                        if(request.body.id){
                            deleteTask(request.body.id, function(error, results) {
                                if(error || results == null)
                                {
                                    response.status(200).json({success: false, message: "Failure to delete task please try again."});
                                }
                                else
                                {
                                    response.status(200).json({success: true, message: "Task Deleted!"});
                                }
                            })
                        }
                        else
                        {
                            response.status(200).json({success: false, message:"Missing task to delete!"})
                        }
                    },
                    postCompleteTask: function(request, response) {
                        if(request.body.id){
                            completeTask(request.body.id, function(error, results) {
                                if(error || results == null)
                                {
                                    response.status(200).json({success: false, message: "Failure to complete task please try again."});
                                }
                                else
                                {
                                    response.status(200).json({success: true, message: "Task Completed"});
                                }
                            })
                        }
                        else
                        {
                            response.status(200).json({success: false, message:"Missing task to complete!"})
                        }
                    }
};



//PSQL functions

//Post Insert user
function postCreateUser(username, password, name, callback)
{
    bcrypt.hash(password, saltRounds, function(err, hash) {
        if(err) {
            callback(err, null);
        }
            pool.query('INSERT INTO users (username, password, name) VALUES ($1, $2, $3)', [username, hash, name], (error, result) =>
            {
                if(error)
                {
                    callback(error, null);
                }
                else{
                    console.log(result);

                    callback(null, result);
                }
            })
    });    
}

function createGroup(id, name, callback){
    pool.query('INSERT INTO groups (name, admin_id) VALUES ($1, $2) RETURNING id, name', [name, id], (error, results) => {
        console.log(results);
        if(error)
        {
            callback(error, null);
        }
        else
        {
            addIdToGroup(id, results.rows[0].id, function (error, result) {                
                callback(null, results.rows);
            })            
        }
    })
}

function addUsernameToGroup (username, group_id, callback) {

    getUser(username, function(error, result) {
        if(error || result.length < 1)
        {
            callback(null, null);
        }
        else
        {
            pool.query('SELECT * FROM user_groups WHERE user_id = $1 AND group_id = $2', [result[0].id, group_id], (error, group) => {
                if(group.rows.length < 1)
                {
                    pool.query('INSERT INTO user_groups (user_id, group_id) VALUES ($1, $2)', [result[0].id, group_id], (error, results) => {
                        console.log(results);
                        if(error)
                        {
                            callback(error, null);
                        }
                        else
                        {
                            callback(null, results);
                        }
                    })
                }                
                else
                {
                    callback(true, null);
                }
            })
        }        
    })
    
}

function addIdToGroup (id, group_id, callback) {
    pool.query('INSERT INTO user_groups (user_id, group_id) VALUES ($1, $2)', [id, group_id], (error, results) => {
        console.log(results);
        if(error)
        {
            callback(error, null);
        }
        else
        {
            callback(null, results);
        }
    })
}

function addTask(user_id, group_id, task_name, dueDate, callback)
{
    pool.query('INSERT INTO tasks (user_id, group_id, task_name, dueDate) VALUES($1, $2, $3, $4)', [user_id, group_id, task_name, dueDate], (error, results) => {
        console.log(results);
        if(error)
        {
            callback(error, null);
        }
        else
        {
            callback(null, results);
        }
    })
}

//Get specific user
function getUserInfo(username, pass, callback){
    pool.query('SELECT id, name, username, password FROM users WHERE users.username = $1', [username], (error, results) => {
        
        console.log(error);
        console.log(results.rows.length == 0);

        if(error)
        {
            callback(error, null);
        }
        else if(results.rows.length == 0)
        {
            callback(null, null);
        }
        else {
            bcrypt.compare(pass, results.rows[0].password, function(err, result) {
                callback(null, results.rows[0]);
            });
        }
        
    })
}

function getUser(username, callback){
    pool.query('SELECT id, name, username, password FROM users WHERE users.username = $1', [username], (error, results) => {
        
        console.log(error);
        console.log(results.rows.length == 0);

        if(error)
        {
            callback(error, null);
        }
        else {
            callback(null, results.rows);
        }
        
    })
}

//Get all tasks for group
function getTasksSQL(id, callback) {
    pool.query('SELECT tasks.id, users.name, task_name, duedate FROM tasks INNER JOIN users ON users.id = tasks.user_id WHERE group_id = $1 AND completed = FALSE', [id], (error, results) => {
        if(error)
        {
            callback(error, null);
        }
        else{
            console.log(results);
            console.log(error);
    
            callback(null, results.rows);
        }
    });
}

//Get Group name
function getGroups(id, callback) {
    pool.query('SELECT name FROM groups WHERE id = $1', [id], (error, results) => {
        if(error)
        {
            callback(error, null);
        }
        else{
            console.log(results.rows[0]);

            callback(null, results.rows[0]);
        }
    });
}

//get Groups
function getGroupNames(id, callback) {
    pool.query('SELECT groups.name, groups.id FROM groups INNER JOIN user_groups ON user_groups.group_id = groups.id WHERE user_groups.user_id = $1', [id], (error,results) => {
        console.log(results);
        if(error){
            callback(error, null);
        }
        else {            
            callback(null, results.rows);
        }
    })

}

function getAdminId(id, callback) {
    pool.query('SELECT admin_id FROM groups WHERE id = $1', [id], (error, results) =>{
        console.log(results);
        if(error)
        {
            callback(error, null);
        }
        else
        {
            callback(null, results.rows[0]);
        }
    })
}

function deleteTask(id, callback) {
    pool.query('DELETE FROM tasks WHERE id = $1', [id], (error, results) => {
        if(error){
            callback(error, null);
        }
        else
        {
            callback(null, results);
        }
    })
}

function completeTask(id, callback) {
    pool.query('UPDATE tasks SET completed = TRUE WHERE id = $1', [id], (error, results) => {
        if(error){
            callback(error, null);
        }
        else
        {
            callback(null, results);
        }
    })
}
