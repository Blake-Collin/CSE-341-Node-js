const { response } = require('express');
const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

module.exports = { getGroup: function (request, response) {
                        if(request.query.id)
                        {
                            const id = request.query.id;
                            getGroups(id, function(error, results) {
                                if(error || results == null || results.length != 1)
                                {
                                    response.status(500).json({data: error});
                                }
                                else
                                {
                                    response.writeHead(200, { 'Content-Type': 'application/json' });
                                    response.end(JSON.stringify(results[0]));
                                }
                            })
                        }                      
                    },
                    getTasks: function (request, response) {
                        if(request.query.id)
                        {
                            const id = request.query.id;                            
                            getTasksSQL(id, function(error, results) {
                                if(error || results == null)
                                {
                                    response.status(500).json({data: error});
                                }
                                else
                                {
                                    response.writeHead(200, { 'Content-Type': 'application/json' });
                                    response.end(JSON.stringify(results));
                                }
                            })
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
                                    response.status(200).json({loginStatus: "Incorrect Login!"});
                                }
                                else
                                {
                                    response.status(200).json(results);
                                }
                            })
                        }
                        else
                        {
                            response.json({loginStatus: "Need Both Creditentials!"});
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
                    }
};


//Post Insert user
function postCreateUser(username, password, name, callback)
{
    pool.query('INSERT INTO users (username, password, name) VALUES ($1, $2, $3)', [username, password, name], (error, result) =>
    {
        if(error)
        {
            callback(error, null);
        }
        console.log(result);

        callback(null, result);
    })
}

//Get specific user
function getUserInfo(username, pass, callback){
    pool.query('SELECT id, name, username FROM users WHERE users.username = $1 AND users.password = $2', [username, pass], (error, results) => {
        if(error)
        {
            callback(error, null)            
        }
        console.log(results.rows[0]);

        callback(null, results.rows[0]);
    })
}

//Get all tasks for group
function getTasksSQL(id, callback) {
    pool.query('SELECT users.name, task_name, duedate FROM tasks INNER JOIN users ON users.id = tasks.user_id WHERE group_id = $1', [id], (error, results) => {
        if(error)
        {
            callback(error, null);
        }
        console.log(results);
        console.log(error);

        callback(null, results.rows);
    });
}

//Get Group name
function getGroups(id, callback) {
    pool.query('SELECT name FROM groups WHERE id = $1', [id], (error, results) => {
        if(error)
        {
            callback(error, null);
        }
        console.log(results);

        callback(null, results.rows);
    });
}

