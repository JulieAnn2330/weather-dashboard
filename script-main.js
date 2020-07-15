let city=""; 
let url="";
let APIkey="";
let queryurl ="";
let currenturl = "";
let citiesDiv = document.getElementById("searched_cities_container");
var lat = "latitude";
var lon = "longitude";
var uvIndex = (lat + lon);
var apiKey = "19113027cee7d9c234b7c839da7576c2";
//start with empty array
let cities = ["Kansas City", "Naples", "New York City", "Lehigh Acres"];
init(); 
listClicker(); 
searchClicker(); 

// run function to pull saved cities from local storage and fill array with it
function init(){
    let saved_cities = JSON.parse(localStorage.getItem("cities"));

    if (saved_cities !== null){
        cities = saved_cities
    }   
    
    renderButtons(); 
}

//sets localstorage item to cities array 
function storeCities(){
    localStorage.setItem("cities", JSON.stringify(cities)); 
}


//render buttons for each element in cities array as a search history for user
function renderButtons(){
    citiesDiv.innerHTML = ""; 
    if(cities == null){
        return;
    }
    let unique_cities = [...new Set(cities)];
    for(let i=0; i < unique_cities.length; i++){
        let cityName = unique_cities[i]; 

        let buttonEl = document.createElement("button");
        buttonEl.textContent = cityName; 
        buttonEl.setAttribute("class", "listbtn"); 

        citiesDiv.appendChild(buttonEl);
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
    cities.push(city);
    //make sure cities array.length is never more than 8 
    if(cities.length > 8){
        cities.shift()
    }
    //return from function early if form is blank
    if (city == ""){
        return; 
    }
    APIcalls();
    storeCities(); 
    renderButtons();
})
}

//runs 2 API calls, one for current weather data and one for five-day forecast, then populates text areas
function APIcalls(){
    
    url = "https://api.openweathermap.org/data/2.5/forecast?q=";    
    currenturl = "https://api.openweathermap.org/data/2.5/weather?q=";
    APIkey = "&appid=5ce8439fd4264478d1da0b24a7cd547d";
    queryurl = url + city + APIkey;
    current_weather_url = currenturl + city + APIkey; 
    
    $("#name_of_city").text("Today's Weather in " + city);
    $.ajax({
        url: queryurl,
        method: "GET",
        
    }).then(function(response){
        let day_number = 0; 
        
        //iterate through the 40 weather data sets
        for(let i=0; i< response.list.length; i++){
            
            //split function to isolate the time from the time/data aspect of weather data, and only select weather reports for 3pm
            if(response.list[i].dt_txt.split(" ")[1] == "15:00:00")
            {
                //if time of report is 3pm, populate text areas accordingly
                let day = response.list[i].dt_txt.split("-")[2].split(" ")[0];
                let month = response.list[i].dt_txt.split("-")[1];
                let year = response.list[i].dt_txt.split("-")[0];
                $("#" + day_number + "date").text(month + "/" + day + "/" + year); 
                let temp = Math.round(((response.list[i].main.temp - 273.15) *9/5+32));
                $("#" + day_number + "five_day_temp").text("Temp: " + temp + String.fromCharCode(176)+"F");
                $("#" + day_number + "five_day_humidity").text("Humidity: " + response.list[i].main.humidity);
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
         let temp = Math.round(((current_data.main.temp - 273.15) * 9/5 + 32))
         console.log("The temperature in " + city + " is: " + temp);
         $("#weather-view").text("Today's weather in " + city + ":");
         $("#today_temp").text("Temperature: " + temp + String.fromCharCode(176)+"F");
         $("#today_humidity").text("Humidity: " + current_data.main.humidity);
         $("#today_wind_speed").text("Wind Speed: " + current_data.wind.speed);
         $("#today_icon_div").attr({"src": "http://openweathermap.org/img/w/" + current_data.weather[0].icon + ".png",
          "height": "100px", "width":"100px"});

        
    

});
    });
};