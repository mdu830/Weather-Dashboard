
$(document).ready(function(){

    var APIkey = "2b7b2e286449b71196ecbc04235f228d";

    var cityName = $("#cityNameInput");

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

        queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + APIkey;

    }

    //build 5 day weather info
    function build5DayQuery() {
        cityName = $("#cityNameInput").val().trim();

        fiveDayQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + APIkey;

    }

    //build uvIndex info
    function buildUVQuery() {

        UVqueryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIkey;
    }

    ////This is what i need help with/////////////////////////////////////////
    function saveCitySearch() {

      var storedCities = JSON.parse(localStorage.getItem("storedCitySearch" , "#cityNameInput"));
      
      cityArr = [storedCities];
      
      if(storedCities === null) {

        cityArr = cityName;
        

      } else if (storedCities.indexOf(storedCities.length) === -1) {

      
        cityArr.push(cityName);

      } localStorage.setItem("storedCitySearch", JSON.stringify(cityArr));
    
    }
    ///////////////////////////////////////////////////////////////////////////
    


    $('#search').on("click", function(event) {

        event.preventDefault();
        
        //remove starting message 
        $("#displayInfo").empty();

        //get current day forcast
        buildCurrentQuery()

        //save current city search
        saveCitySearch()

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

            var finalDate = month + '/' + day + '/' + year;

            //Weather info//
            //temperature
            var temp = dayResponse.main.temp;
            newTemp = Math.round(temp);
            displayTemp = "Temprature: " + newTemp;
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
            var iconURL = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
            

            //create container with current day forcast info
            
            //Today Row
            row = $("<div>");
            row.attr("class", "row mt-1 ml-3 mb-2");
            $("#displayInfo").append(row);
            todayTitle = $("<h1>").text("Today: ");
            row.append(todayTitle);

            //row
            row = $("<div>");
            row.attr("class", "row");
            $("#displayInfo").append(row);
            //container
            card = $("<div>");
            card.attr("class", "card m-4 mt-n1 mb-1 text-center p-4");
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

          //5-day forecast title row
          row = $("<div>");
          row.attr("class", "row ml-3 mt-1 mb-2");
          $("#displayInfo").append(row);
          fiveDayTitle = $("<h1>").text("5-Day Forecast:");
          row.append(fiveDayTitle);
          //forecast card(s) row
          row = $("<div>");
          row.attr("class", "row");
          $("#displayInfo").append(row);


          for (var i = 0; i < response.list.length; i++) {

            if (response.list[i].dt_txt.indexOf("15:00:00") !== -1){

              //append dates
              card = $("<div>");
              card.attr("class", "card m-4 mt-n1 mr-n1 mb-5 text-center p-4 fiveDayForecast");
              row.append(card);

              var unixTS = response.list[i].dt;
              var date = new Date(unixTS * 1000);
              day = (date.getDate() < 10 ? '0' : '') + date.getDate();
              month = (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1);
              year = date.getFullYear()

              var finalDate = month + '/' + day + '/' + year;

              dateTitle = $("<h3>").text(finalDate);
              card.append(dateTitle);

              //append icons
              var iconCode = response.list[i].weather[0].icon;
              var iconURL = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
              
              iconCol =$("<div>");
              iconCol.attr("class", "col");
              card.append(iconCol);

              var iconIMG = $("<img>");
              iconIMG.attr("id", "fiveDayWeatherIcon");
              iconIMG.attr("src", iconURL);
              iconCol.append(iconIMG);

              //append tempratures
              APItemp = response.list[i].main.temp;
               newTemp =Math.round(APItemp);
              var displayTemps ="Temp: " + newTemp;
              var tempratureH2 = $("<h4>").text(displayTemps);
              tempratureH2.attr("class", "mb-n1")
              card.append(tempratureH2);
              tempratureH2.unbind().append(' &deg;' + "F");

              //append humidity values
              var humidityPercents = "Humidity: " + response.list[i].main.humidity + " %";
              var humidityH2 = $("<h4>").text(humidityPercents);
              humidityH2.attr("class", "mt-4")
              card.append(humidityH2);

            }
          }

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