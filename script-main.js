var city=""; 
var url="";
var queryurl ="";
var currenturl = "";
var locationsDiv = document.getElementById("searched_locations_container");
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
    var unique_locations = [...new Set(locations)];
    for(var i=0; i < unique_locations.length; i++){
        var cityName = unique_locations[i]; 

        var buttonElement = document.createElement("button");
        buttonElement.textContent = cityName; 
        buttonElement.setAttribute("class", "listbtn"); 

        locationsDiv.appendChild(buttonElement);
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
    
    url = "https://api.openweathermap.org/data/2.5/forecast?q=";    
    currenturl = "https://api.openweathermap.org/data/2.5/weather?q=";
    APIkey = "&appid=19113027cee7d9c234b7c839da7576c2";
    queryurl = url + city + APIkey;
    current_weather_url = currenturl + city + APIkey; 
    
    $("#name_of_city").text("Today's Weather in " + city);
    $.ajax({
        url: queryurl,
        method: "GET",
        
    }).then(function(response){
        var day_number = 0; 
        
        //iterate through the 40 weather data sets
        for(var i=0; i< response.list.length; i++){
            
            //split function to isolate the time from the time/data aspect of weather data, and only select weather reports for 3pm
            if(response.list[i].dt_txt.split(" ")[1] == "15:00:00")
            {
                //if time of report is 3pm, populate text areas accordingly
                var day = response.list[i].dt_txt.split("-")[2].split(" ")[0];
                var month = response.list[i].dt_txt.split("-")[1];
                var year = response.list[i].dt_txt.split("-")[0];
                $("#" + day_number + "date").text(month + "/" + day + "/" + year); 
       
                var tempF = Math.round(((response.list[i].main.temp - 273.15) * 1.8 + 32));
                $("#" + day_number + "five_day_temp").text("Temp: " + tempF + String.fromCharCode(176)+"F");
                $("#" + day_number + "five_day_humidity").text("Humidity: " + response.list[i].main.humidity + "%");
                $("#" + day_number + "five_day_icon").attr("src", "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                console.log(response.list[i].dt_txt.split("-"));
                console.log(day_number);
                console.log(response.list[i].main.temp);
                day_number++; 
                        }   
        }
    });
    var queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}&units=imperial`;

    $.get(queryURL).then(function (response) {
        var lon = response.coord.lon;
        var lat = response.coord.lat;
        var queryUV = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
                
        $.get(queryUV)
        .then(function (uvResponse) {
            console.log(uvResponse);

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

    //function to display data in main div 
     $.ajax({
         url:current_weather_url,
         method: "GET", 
     }).then(function(current_data){
         console.log(current_data);
         var temp = Math.round(((current_data.main.temp - 273.15) * 1.8 + 32))
         console.log("The temperature in " + city + " is: " + temp);
         $("#weather-view").text("Today's weather in " + city + ":");
         $("#today_temp").text("Temperature: " + temp + String.fromCharCode(176)+"F");
         $("#today_humidity").text("Humidity: " + current_data.main.humidity + "%");
         $("#today_wind_speed").text("Wind Speed: " + current_data.wind.speed + " mph");
         $("#today_icon_div").attr({"src": "http://openweathermap.org/img/w/" + current_data.weather[0].icon + ".png",
          "height": "100px", "width":"100px"});

        
    

});
    });
};