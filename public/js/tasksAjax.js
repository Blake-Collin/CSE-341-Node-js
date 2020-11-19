const button1 = document.querySelector('#getGroup');
button1.addEventListener('click', group);

const button2 = document.querySelector('#getTasks');
button2.addEventListener('click', tasks);

function group()
{
    var id = document.getElementById('id').value;
    var getQuery = '/getGroup?id=' + id;
    ajax(getQuery, function(err, results) {
        if(err || results == null)
        {
            document.getElementById("results").innerHTML = "No Results!";
        }       
        else
        {
            console.log(results);
            document.getElementById("results").innerHTML = "Group Name: " + results.name;
        }
    });
    
}

function tasks()
{
    var id = document.getElementById('id').value;
    var getQuery = '/getTasks?id=' + id;
    ajax(getQuery, function(err, results) {
        if(err || results == null)
        {
            document.getElementById("results").innerHTML = "No Results!";
        }        
        else
        {
            console.log(results);
            document.getElementById("results").innerHTML = "";            
            for(var i = 0; i < results.length; i++)
            {
                var p = document.createElement('p');
                var date = new Date(results[i].duedate);
                p.innerHTML = "Task Name: " + results[i].task_name+ " Created By: " + results[i].name + " Due Date: " + (date.getMonth()+1) + "-" + date.getDate() + "-" + date.getFullYear() + "\n";
                document.getElementById("results").appendChild(p);
            }
        }
    });
}

function ajax(getString, callback) {    
    var request = new XMLHttpRequest();
    request.open('GET', getString );
    request.onreadystatechange = function(){
        if(request.readyState = 4 && request.status == 200)
        {
            var response = JSON.parse(request.responseText);
            callback(null, response)
        }
        else
        {
            callback("fail", null)            
        }
    }
    request.send();
}