const button = document.querySelector('#getPrice');
button.addEventListener('click', request);

function request() {
    var weight = document.getElementById('weight').value;
    var type = document.getElementById('type').value;

    var request = new XMLHttpRequest();
    request.open('GET', '/mail_service?weight='+ weight +'&type=' + type);
    request.onreadystatechange = function(){
        if(request.readyState = 4 && request.status == 200)
        {
            var response = JSON.parse(request.responseText);                        
            var output = document.getElementById('output');
            output.innerHTML = "";
            var header = document.createElement("h2");
            var outType = document.createElement("p");
            var outCost = document.createElement("p");
            var outWeight = document.createElement("p");
            header.innerHTML = "Shipping Costs";
            outType.innerHTML = "Ship Type: " + response['type'];
            outCost.innerHTML = "Cost: $" + Number(response['cost']).toFixed(2);
            outWeight.innerHTML = "Weight: " + Number(response['weight']) + " oz.";
            output.appendChild(header);
            output.appendChild(outType);
            output.appendChild(outCost);
            output.appendChild(outWeight);
        }
        else if (request.status = 400) 
        {
            alert('Error 400');
        }
        else
        {
            alert("Something other then 400 or 200 was returned");
        }
    }
    request.send();
}