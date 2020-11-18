
const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

module.exports = { request: function (req, res) {
        if(req.query.id)
        {
            const id = req.query.id;            
            pool.query('SELECT * FROM person WHERE id = $1', id, (err, res) => {
                if (err) {
                    throw err
                  }
                console.log('user:', res.rows[0]);
            });
        }
    }
};
