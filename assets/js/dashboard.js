
$(document).ready(function(){

    var APIkey = "2b7b2e286449b71196ecbc04235f228d";

    console.log("yo yo");

    //get stored city searched from local storage JSON(parse)

    //add starting message
    var startP = $("<p>").text("Search the name of your city, to get the latest weather information in your area");
    startP.attr("id", "startMessage");
    startP.attr("class", "mt-3");
    $("#displayInfo").append(startP);

    //build current day weather info
    function buildCurrentQuery() {
        cityName = $("#cityNameInput").val().trim();

        queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + APIkey;

        

    }

    //build 5 day weather info
    function build5DayQuery() {
        cityName = $("#cityNameInput").val().trim();

        fiveDayQueryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + APIkey;

    }

    //build uvIndex info
    function buildUVQuery() {

        UVqueryURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIkey;
    }

    $('#search').on("click", function(event) {

        event.preventDefault();
        
        //remove starting message 
        $("#displayInfo").empty();


        //get current day forcast
        buildCurrentQuery()

        $.ajax({
            url: queryURL,
            method: "GET",
            statusCode: {
                //if 404 ERROR display error message
                404: function() {
                        var errorP = $("<p>").text("There was an error while retreiving your city, please check your spelling and try again");
                        errorP.attr("id", "errorMessage");
                        errorP.attr("class", "mt-3");
                        $("#displayInfo").append(errorP);

                },
                //if 400 ERROR display nothing entered message
                400: function() {
                    var nothingP = $("<p>").text("Nothing was entered, please try again");
                    nothingP.attr("id", "nothingMessage");
                    nothingP.attr("class", "mt-3");
                    $("#displayInfo").append(nothingP);

                }
              }

            }).then(function(dayResponse) {
            
            //Save current city search JSON(stringify)
            
            buildCurrentQuery(dayResponse);

            //get data from API

            //ciy name
            var city = dayResponse.name;
            //date
            var unixTS = dayResponse.dt;
            var date = new Date(unixTS * 1000);
            day = (date.getDate() < 10 ? '0' : '') + date.getDate();
            month = (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1);
            year = date.getFullYear();

            var finalDate = "(" + day + '/' + month + '/' + year + ")";

            //Weather info//
            //temperature
            var temp = dayResponse.main.temp;
            displayTemp = "Temprature: " + temp;
            // console.log(displayTemp);
            //humidity
            var humidity = dayResponse.main.humidity;
            humidityPercent = "Humidity: " + humidity + " %";
            // Wind Speed
            var windSpeed = dayResponse.wind.speed;
            roundWindSpeed = windSpeed.toFixed(1);
            finalWindSpeed = "Wind Speed: " + roundWindSpeed + " MPH";


            //icons//
            var iconCode = dayResponse.weather[0].icon;
            var iconURL = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
            

            //create container with current day forcast info

            //row
            row = $("<div>");
            row.attr("class", "row");
            $("#displayInfo").append(row);
            //container
            card = $("<div>");
            card.attr("class", "card m-4 text-center p-4");
            card.attr("id", "currentWeather")
            row.append(card);

            //create row for title and date
            titleRow = $("<div>");
            titleRow.attr("class", "row m-3");
            card.append(titleRow);

            
            //city title
            var cityH1 = $("<h1>").text(city);
            cityH1.attr("id", "city");
            titleRow.append(cityH1);
            //date title
            var dateH1 = $("<h1>").text(finalDate);
            dateH1.attr("id", "date");
            titleRow.append(dateH1);

            //create row for icon and weather info container
            infoRow = $("<div>");
            infoRow.attr("class", "row");
            card.append(infoRow)

            //create icon column
            iconCol =$("<div>");
            iconCol.attr("class", "col");
            infoRow.append(iconCol);

            //create weather column
            weatherInfo = $("<div>");
            weatherInfo.attr("class", "col-8");
            infoRow.append(weatherInfo);


            //temprature
            var tempratureH2 = $("<h2>").text(displayTemp);
            weatherInfo.append(tempratureH2);
            tempratureH2.unbind().append(' &deg;' + "F");
            // humidity
            var humidityH2 = $("<h2>").text(humidityPercent);
            weatherInfo.append(humidityH2);
            //wind speed
            var windSpeedH2 = $("<h2>").text(finalWindSpeed);
            weatherInfo.append(windSpeedH2);

            //icon
            var iconIMG = $("<img>");
            iconIMG.attr("id", "weatherIcon");
            iconIMG.attr("src", iconURL);
            iconCol.append(iconIMG);
          });
        
        //get 5 day forcast
        build5DayQuery();
        
        $.ajax({
            url: fiveDayQueryURL,
            method: "GET"
          }).then(function(response) {

          build5DayQuery(response);

          for (var i = 0; i < response.list.length; i++) {
            
          }

          console.log(fiveDayQueryURL);
          console.log(response);

          //get uvIndex coords
          lat = response.city.coord.lat;
          lon = response.city.coord.lon;
          buildUVQuery()

          $.ajax({
              url: UVqueryURL,
              method: "GET"
              }).then(function(uvResponse) {

              buildUVQuery(uvResponse);

              var uvIndex = uvResponse.value;
            //   var uvIndex = 12;
              displayUvIndex = "UV index: ";

              var uvRow = $("<div>");
              uvRow.attr("class", "row");
              weatherInfo.append(uvRow);


              var uvIndexH2 = $("<h2>").text(displayUvIndex);
              uvIndexH2.attr("class", "ml-4")
              uvRow.append(uvIndexH2);

              var uvIndexContainer = $("<div>");
              uvIndexContainer.attr("class", "container mt-1 ml-n2 uvContainer");
              uvIndexContainer.append(uvIndex);
              uvRow.append(uvIndexContainer);

              if ( uvIndex <= 3.5) {
                $(".uvContainer").css("background-color","darkgreen");
              } else if (uvIndex <= 6.5) {
                $(".uvContainer").css("background-color","rgb(212, 191, 0)");
                $(".uvContainer").css("color","black");
              } else if (uvIndex <= 11) {
                $(".uvContainer").css("background-color","darkred");  
              } else {
                $(".uvContainer").css("background-color","black"); 
              }
            });
        });

    });


});