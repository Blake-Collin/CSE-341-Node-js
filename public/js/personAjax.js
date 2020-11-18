const button1 = document.querySelector('#submit');
button1.addEventListener('click', request);

const button2 = document.querySelector('#getParents');
button2.addEventListener('click', parents);

const button3 = document.querySelector('#getChildren');
button3.addEventListener('click', children);

function request() {
    var id = document.getElementById('number').value;
    var request = new XMLHttpRequest();
    request.open('GET', '/getPerson?id='+ id );
    request.onreadystatechange = function(){
        if(request.readyState = 4 && request.status == 200)
        {
            var response = JSON.parse(request.responseText);
            console.log(response);
            result = "Name & B-day: " + response['firstname'] + " " + response['lastname'] + " " + response['dateofbirth'];
            document.getElementById("results").innerHTML = result;
        }        
        else
        {
            document.getElementById("results").innerHTML = "No person results!";
        }
    }
    request.send();
}

function parents() {
    var id = document.getElementById('number').value;
    var request = new XMLHttpRequest();
    request.open('GET', '/getParents?id='+ id );
    request.onreadystatechange = function(){
        if(request.readyState = 4 && request.status == 200)
        {
            var response = JSON.parse(request.responseText);
            result = "Parents:"
            for(var i = 0; response.length > i ; i++)
            {
                result += " " + response[i].parent_id;
            }
            document.getElementById("results").innerHTML = result;
        }
        else
        {
            document.getElementById("results").innerHTML = "No person results!";
        }
    }
    request.send();
}


function children() {
    var id = document.getElementById('number').value;
    var request = new XMLHttpRequest();
    request.open('GET', '/getChildren?id='+ id );
    request.onreadystatechange = function(){
        if(request.readyState = 4 && request.status == 200)
        {
            var response = JSON.parse(request.responseText);
            result = "Children:"
            for(var i = 0; response.length > i ; i++)
            {
                result += " " + response[i].child_id;
            }
            document.getElementById("results").innerHTML = result;
        }
        else
        {
            document.getElementById("results").innerHTML = "No person results!";
        }
    }
    request.send();
}