// Moment script
var m = moment();

$(function() {
    $("#tfq2b").click(function() {
        if ($("#tfq2b").val() == "Enter Location"){
            $("#tfq2b").val(""); 
        }
    });
});

// Day, date, time
$("#currentDay").text(moment().format('LLLL'));