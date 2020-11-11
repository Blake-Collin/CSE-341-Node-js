const button = document.querySelector('#ajax');
button.addEventListener('click', request);

function request() {
    var op = document.getElementById('operation').value;
    var left = document.getElementById('left').value;
    var right = document.getElementById('right').value;
    var request = new XMLHttpRequest();
    request.open('GET', '/math_service?operation='+ op +'&left=' + left +'&right=' + right);
    request.onreadystatechange = function(){
        if(request.readyState = 4 && request.status == 200)
        {
            var response = JSON.parse(request.responseText);                        
            result = "Result of: " + response['left'] + " " + response['operation'] + " " + response['right'] + " = " + response['result'];
            document.getElementById("results").innerHTML = result;
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