// Moment script
var m = moment();

$(function() {
    $("#tfq2b").click(function() {
        if ($("#tfq2b").val() == "Search By City"){
            $("#tfq2b").val(""); 
        }
    });
});

// OpenWeather API key: 19113027cee7d9c234b7c839da7576c2

// Day, date, time
$("#currentDay").text(moment().format('LLLL'));