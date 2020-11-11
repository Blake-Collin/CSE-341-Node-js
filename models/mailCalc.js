module.exports = { request: function (type, weight) {
    var returnType = "";
    var cost = 0.0;

    if(type == "sletter")
    {
        returnType = "Letters (Stamped)";
        if(weight <= 1)
        {
            cost = 0.55;
        } 
        else if(weight <= 2)
        {
            cost = 0.70;
        }
        else if(weight <= 3)
        {
            cost = 0.85;
        }
        else if(weight <= 3.5)
        {
            cost = 1.00;
        }

    }
    else if(type == "mletter")
    {
        returnType = "Letters (Metered)";
        if(weight <= 1)
        {
            cost = 0.50;
        } 
        else if(weight <= 2)
        {
            cost = 0.65;
        }
        else if(weight <= 3)
        {
            cost = 0.80;
        }
        else if(weight <= 3.5)
        {
            cost = 0.95;
        }

    }
    else if(type == "lenvelope")
    {
        returnType = "Large Envelopes (Flats)";
        cost = 1.00 + ((Math.ceil(weight)-1)*0.20);
    }
    else if(type = "fcpackageservice")
    {
        returnType = "First-Class Package Service—Retail";
        if(weight <= 4)
        {
            cost = 3.80;
        }
        else if(weight <= 8)
        {
            cost = 4.60;
        }
        else if(weight <= 12)
        {
            cost = 5.30;
        }
        else
        {
            cost = 5.9;
        }
    }

    var params = {type: returnType, cost: cost, weight: weight};
    return params;
}};