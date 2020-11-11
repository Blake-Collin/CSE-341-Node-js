
//Math Operations
module.exports = { request: function (req, res) {
    const op = req.query.operation;
    const left = Number(req.query.left);
    const right = Number(req.query.right);

    compute(res, op, left, right);

}};
  
function compute(res, op, left, right)
{
    op = op.toLowerCase();
    let result = 0;
    if(op == "add")
    {
        result = left + right;
    }
    else if(op == "subtract")
    {
        result = left - right;
    }
    else if(op == "multiply")
    {
        result = left * right;
    }
    else if(op == "divide")
    {
        result = left / right;
    }
    else
    {
        //404 error
    }

    let params = {operation: op, left: left, right: right, result: result};    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(params));
}