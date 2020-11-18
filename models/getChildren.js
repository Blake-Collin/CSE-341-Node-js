
const { response } = require('express');
const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});


module.exports = { request: function (req, response) {
        if(req.query.id)
        {
            const id = req.query.id;            

            getPerson(id, function(error, result) {
                if(error || result == null)
                {                    
                    response.status(500).json({data: error});
                }
                else
                {
                    response.status(200).json(result);
                }                
            })    
        }
}};

function getPerson(id, callback) 
{
    pool.query('SELECT child_id FROM parentchild WHERE parent_id = $1', [id], (err, res) => {              
        if (err) {
            callback(err, null);
          }
          
        console.log('children:', res.rows);
    
        callback(null, res.rows);
        
    });
}
