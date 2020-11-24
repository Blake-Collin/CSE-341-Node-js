const button = document.querySelector('#search');
button.addEventListener("click", request);


function request() {
    var name = document.getElementById('name').value;

    $("#results").empty();

    $.get("http://www.omdbapi.com/?s=" + name + "&apikey=71b58793", function(data) {
        console.log(data);
        for(var i = 0; i < data.Search.length; i++)
        {
            var output = document.createElement("div");
            output.setAttribute("id", data.Search[i].imdbID);

            var title = document.createElement("p");
            output.appendChild(title);
            title.innerHTML = data.Search[i].Title;

            //Add button here
            var detailsButton = document.createElement("button");
            detailsButton.innerHTML = "Details";
            detailsButton.addEventListener("click", function(){ details(this.value); });
            detailsButton.value = data.Search[i].imdbID;
            output.appendChild(detailsButton);
                        
            $("#results").append(output);
        }        
    })
}

function details(id) {    
    console.log(id);

    $.get("http://www.omdbapi.com/?i=" + id + "&apikey=71b58793", function (data) {
        console.log(data);
        
        //Get and clear
        var div = document.getElementById(id);
        div.innerHTML = "";
        

        var div2 = document.createElement("div");
        //Add everything
        var p = document.createElement("p");
        p.innerHTML = "Title: " + data.Title;
        div2.appendChild(p);

        var image = document.createElement("img");
        image.src = data.Poster;
        image.alt = data.Title;
        div.appendChild(image);

        var rating = document.createElement("p");
        rating.innerHTML = "Rating: " + data.Rated;
        div2.appendChild(rating);

        var runtime = document.createElement("p");
        runtime.innerHTML = "Runtime: " + data.Runtime;
        div2.appendChild(runtime);

        var year = document.createElement("p");
        year.innerHTML = "Year: " + data.Year;
        div2.appendChild(year);

        div.appendChild(div2);
    })
}