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
                    }
};

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

