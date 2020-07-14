// Moment script
var m = moment();

// Day, date, time
$("#currentDay").text(moment().format('LLLL'));

var locations = ["Kansas City", "Naples", "Lehigh Acres", "New York City"];
var apiKey = "19113027cee7d9c234b7c839da7576c2";
var lat = "latitude";
var lon = "longitude";
var uvIndex = (lat + lon)

// function renderFromLocalStorage() {
    
//     var localStorageArray = JSON.parse(localStorage.getItem("weather"));
    
    
//     for (var i=0; i<localStorageArray.length; i++) {
//         console.log(localStorageArray[i]);
//     }
//     localStorageArray.forEach(function (city, index, originalArr) {
//         renderButtons(city);

locations.forEach(function (city, index, originalArr) {
    renderButtons(city);

    if (index === originalArr.length - 1) {
        displayWeather(city);
    }
});

function displayWeather(city) {
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}&units=imperial`;


$.get(queryURL).then(function (response) {
    var lon = response.coord.lon;
    var lat = response.coord.lat;
    var queryUV = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    $.get(queryUV)
    .then(function (uvResponse) {
        console.log(uvResponse);
        var temperature = response.main.temp;
        var humidity = response.main.humidity;
        var windSpeed = response.wind.speed;

        var cityDiv = $("<div class='city'>");
        var header = $("<h4>").text(city);
        var lineOne = $("<p>").text("Temperature: " + temperature + String.fromCharCode(176) + "F");
        var lineTwo = $("<p>").text("Humidity: " + humidity + "%");
        var lineThree = $("<p>").text("Wind Speed: " + windSpeed + "mph");
        
        var color = "green";
        var UVindex = uvResponse.value;
        if(UVindex > 10) {
            color = "red";
        }
        else if(UVindex > 4) {
            color = "orange";
        };

    var uvSpan = $("<span>").text(uvResponse.value).css("color", color);
    var lineFour = $("<p>").text("UV Index: ").append(uvSpan);
    cityDiv.append(header, lineOne, lineTwo, lineThree, lineFour);

    $("#weather-view").empty();
    $("#weather-view").prepend(cityDiv);
})

})

}

function renderButtons(city) {
    var btn = $("<button>");
    btn.addClass("city-btn btn btn-default").css("display", "block");
    btn.attr("data-name", city);
    btn.text(city);
    $(".locations-array").append(btn);
}

   $("#searchBtn").on("click", function(event) {
       event.preventDefault();

       var $weather = $("#city-input").val();
       console.log($weather);
    
      
       locations.push($weather);
       localStorage.setItem("weather", JSON.stringify(locations));
       var saveLocations = JSON.parse(localStorage.getItem(locations));
           
        // $("#city-input").val("");
        // $("#city-input").val(saveLocations);
     

    
    renderButtons($weather);
    displayWeather($weather);
    });
    
    $(document).on("click", ".city-btn", function() {
        var city = $(this).attr("data-name");
        displayWeather(city);
    });

