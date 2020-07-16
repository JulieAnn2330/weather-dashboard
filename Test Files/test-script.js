var locationsDiv = document.getElementById("searchedLocationsContainer");
var lat = "latitude";
var lon = "longitude";
var uvIndex = (lat + lon);
var apiKey = "19113027cee7d9c234b7c839da7576c2";
var locations = ["Kansas City", "Naples", "New York City", "Lehigh Acres"];
init(); 
listClicker(); 
searchClicker(); 

// run function to pull saved cities from local storage and fill array with it
function init(){
    var savedLocations = JSON.parse(localStorage.getItem("locations"));

    if (savedLocations !== null){
        locations = savedLocations
    }   
    
    renderButtons(); 
}

//sets localstorage item to cities array 
function storeLocations(){
    localStorage.setItem("locations", JSON.stringify(locations)); 
}


//render buttons for each element in cities array as a search history for user
function renderButtons(){
    locationsDiv.innerHTML = ""; 
    if(locations == null){
        return;
    }
    var newLocations = [...new Set(locations)];
    for(var i=0; i < newLocations.length; i++){
        var cityName = newLocations[i]; 

        var btnEl = document.createElement("button");
        btnEl.textContent = cityName; 
        btnEl.setAttribute("class", "listbtn"); 

        locationsDiv.appendChild(btnEl);
        listClicker();
      }
    }
//on click function for search history buttons
function listClicker(){
$(".listbtn").on("click", function(event){
    event.preventDefault();
    city = $(this).text().trim();
    APIcalls(); 
})
}

//on click function for main search bar
function searchClicker() {
$("#searchBtn").on("click", function(event){
    event.preventDefault();
    city = $(this).prev().val().trim()
    
    //push the city user entered into cities array 
    locations.push(city);
    //make sure cities array.length is never more than 8 
    if(locations.length > 8){
        locations.shift()
    }
    //return from function early if form is blank
    if (city == ""){
        return; 
    }
    APIcalls();
    storeLocations(); 
    renderButtons();
})
}

//runs 2 API calls, one for current weather data and one for five-day forecast, then populates text areas
function APIcalls(){
    
    forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?q=${city}&exclude={part}&appid=${apiKey}`;
    currentWeatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}&units=imperial`;
    
    $("#nameOfCity").text("Today's Weather in " + city);
    $.ajax({
        url: forecastUrl,
        method: "GET",
    }).then(function(response){
        var dayNumber = 0; 
        
        //iterate through the 40 displayed weather reports
        for(var i=1; i< response.list.length; i++){
            
            // Pull data to display weather at 5pm daily
            if(response.list[i].dt_txt.split(" ")[1] == "18:00:00")
            {
                //if time of report is 5pm, populate text areas accordingly
                var day = response.list[i].dt_txt.split("-")[2].split(" ")[0];
                var month = response.list[i].dt_txt.split("-")[1];
                var year = response.list[i].dt_txt.split("-")[0];
                $("#" + dayNumber + "date").text(month + "/" + day + "/" + year); 
       
                $("#" + dayNumber + "fiveDayTemp").text("Temp: " + Math.round(response.list[i].main.temp) + String.fromCharCode(176)+"F");
                $("#" + dayNumber + "fiveDayHumidity").text("Humidity: " + response.list[i].main.humidity + "%");
                $("#" + dayNumber + "fiveDayIcon").attr("src", "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                dayNumber++; 
                        }   
        }
    });

    $.get(currentWeatherUrl).then(function (response) {
        var lon = response.coord.lon;
        var lat = response.coord.lat;
        var queryUV = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
                
        $.get(queryUV)
        .then(function (uvResponse) {
      
      var color = "green";
      var UVindex = uvResponse.value;
      if(UVindex > 10) {
          color = "red";
      }
      else if(UVindex > 4) {
          color = "orange";
      };

      var uvSpan = $("<span>").text(uvResponse.value).css("color", color);
      $("#todayUVIndex").text("UV Index: ").append(uvSpan);
 })

    //function to display data in main box 
     $.ajax({
         url:currentWeatherUrl,
         method: "GET", 
     }).then(function(currentData){
         $("#weatherView").text("Today's weather in " + city + ":");
         $("#todayTemp").text("Temperature: " + Math.round(currentData.main.temp) + String.fromCharCode(176)+"F");
         $("#todayHumidity").text("Humidity: " + currentData.main.humidity + "%");
         $("#todayWindSpeed").text("Wind Speed: " + currentData.wind.speed + " mph");
         $("#todayIconDiv").attr({"src": "http://openweathermap.org/img/w/" + currentData.weather[0].icon + ".png",
          "height": "100px", "width":"100px"});
});
    });
};