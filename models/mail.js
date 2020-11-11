const mailCalc = require('./mailCalc.js');

module.exports = { request: function (req, res) {
    const type = req.query.type;
    const weight = Number(req.query.weight);    

    var params = mailCalc.request(type, weight);
    res.render('pages/mailResult', params);
}};


