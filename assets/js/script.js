// https://api.openweathermap.org/data/2.5/weather?q=Detroit&appid=244aa4153db3eb6e2f0064200dfe0f71
// {"coord":{"lon":-83.0458,"lat":42.3314},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"base":"stations","main":{"temp":273.55,"feels_like":269.66,"temp_min":271.97,"temp_max":274.35,"pressure":1018,"humidity":72},"visibility":10000,"wind":{"speed":3.58,"deg":244,"gust":8.49},"clouds":{"all":100},"dt":1641691177,"sys":{"type":2,"id":2006979,"country":"US","sunrise":1641646852,"sunset":1641680193},"timezone":-18000,"id":4990729,"name":"Detroit","cod":200}


// api.openweathermap.org/data/2.5/onecall?lat=38.8&lon=12.09&callback=test

//Bing map to get lat long
//AvJLVKfSRJ7aAjDDkx98DqX8n6LbtMBGWY4MA0HZDaS-y6W5ZHnl-8XveLmmXQs7
// http://dev.virtualearth.net/REST/v1/Locations/US/{adminDistrict}/{postalCode}/{locality}/{addressLine}?includeNeighborhood={includeNeighborhood}&include={includeValue}&maxResults={maxResults}&key={BingMapsKey}
// http://dev.virtualearth.net/REST/v1/Locations/US///Detroit/?key=AvJLVKfSRJ7aAjDDkx98DqX8n6LbtMBGWY4MA0HZDaS-y6W5ZHnl-8XveLmmXQs7
// https://dev.virtualearth.net/REST/v1/Locations/US////Detroit?key=AvJLVKfSRJ7aAjDDkx98DqX8n6LbtMBGWY4MA0HZDaS-y6W5ZHnl-8XveLmmXQs7

// Elements
var citySearchInputEl = document.getElementById('searchCity');
var citySearchBtnEl = document.getElementById('citySearchBtn');
var currentConditionsDivEl = document.getElementById('currentConditions');
var forecastRowEl = document.getElementById('forecastRow');

// City data
var city = '';
var lat = '';
var lon = '';

//get the lat lon then get the weather!
var getCityInfoApi = function() {
    city = searchCity.value;
    console.log(city);  

    var requestUrl = 'https://dev.virtualearth.net/REST/v1/Locations/US////' + city + '?key=AvJLVKfSRJ7aAjDDkx98DqX8n6LbtMBGWY4MA0HZDaS-y6W5ZHnl-8XveLmmXQs7';
  
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        //Using console.log to examine the data
        //console.log(data);

        //assumes our best match is returned first.  this would be more accurate if we did a city/state search or prompted the user to select from the results
        lat = data.resourceSets[0].resources[0].geocodePoints[0].coordinates[0];
        lon = data.resourceSets[0].resources[0].geocodePoints[0].coordinates[1];

        console.log (lat + ', ' + lon);
        getWeatherApi();
       });
  }


function getWeatherApi() {
    console.log("city1: " + city);
  var requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon +'&exclude=hourly,minutely&units=imperial&appid=244aa4153db3eb6e2f0064200dfe0f71';

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //Using console.log to examine the data
      console.log(data);
      console.log("city: " + city);

      currentConditionsDivEl.innerHTML = '';

      // presented with current and future conditions for that city
        var currentTitleP = document.createElement('p');
        var currentTitleHeader = document.createElement('strong');
        var currentIcon = document.createElement('img');
        var currentTemp = document.createElement('p');
        var currentWind = document.createElement('p');
        var currentHumidity = document.createElement('p');
        var currentUVIndex = document.createElement('p');
        
        var myDate = new Date(data.current.dt*1000-(data.timezone_offset*1000))
        currentTitleHeader.innerText = city + ": " + myDate.toDateString();
        var iconcode = data.current.weather[0].icon;
        var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
        currentIcon.setAttribute("src", iconurl);
        currentIcon.setAttribute("alt", "weather icon");
        currentTitleP.append(currentTitleHeader, currentIcon);
        currentTemp.innerText = "Temperature: " + data.current.temp + " Fahrenheit";
        currentWind.innerText = "Wind: " + data.current.wind_speed + " mph";
        currentHumidity.innerText = "Humidity: " + data.current.humidity + "%";
        currentUVIndex.innerText = "UV Index: " + data.current.uvi ;

        currentConditionsDivEl.append(currentTitleP, currentTemp, currentWind, currentHumidity, currentUVIndex);
        
        // 5 Day Forecast
        forecastRowEl.innerHTML = '';

        for (var i = 1; i < 6; i++) {
            var forecastColEl = document.createElement('div');
            var forecastCardEl = document.createElement('div');
            var forecastDate = document.createElement('p');
            var forecastIcon = document.createElement('img');
            var forecastTemp = document.createElement('p');
            var forecastWind = document.createElement('p');
            var forecastHumidity = document.createElement('p');

            forecastColEl.setAttribute("class", "col col-sm-12 col-md-2");
            forecastCardEl.setAttribute("class", "card bg-primary text-white");

            // Test the date format
            //console.log(new Date(data.daily[i].dt*1000-(data.timezone_offset*1000))); // minus 
            //console.log(new Date(data.daily[i].dt*1000+(data.timezone_offset*1000))); // plus

            myDate = new Date(data.daily[i].dt*1000-(data.timezone_offset*1000));
            console.log(i + " " + myDate.toDateString());
            forecastDate.innerText = myDate.toDateString();
            iconcode = data.daily[i].weather[0].icon;
            iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
            forecastIcon.setAttribute("src", iconurl);
            forecastIcon.setAttribute("alt", "weather icon");
            forecastIcon.setAttribute("width", "50%");
            forecastTemp.innerText = "High: " + data.daily[i].temp.max + " Fahrenheit";
            forecastWind.innerText = "Wind: " + data.daily[i].wind_speed + " mph";
            forecastHumidity.innerText = "Humidity: " + data.daily[i].humidity + "%";

            forecastCardEl.append(forecastDate, forecastIcon, forecastTemp, forecastWind, forecastHumidity);
            forecastColEl.append(forecastCardEl);

            forecastRowEl.append(forecastColEl);
        };
       })
    // .then(cleanUp()
    // );
    ;
     // clean up
     //cleanUp();
}

var cleanUp = function(){
    // add city to history if needed
    addToHistory();

    // clean up var and inputs until next time
    citySearchInputEl.value = '';
    city = '';
    lat = '';
    lon = '';
}

var addToHistory=function(){

}

citySearchBtnEl.addEventListener('click', getCityInfoApi);
//console.log (citySearchBtnEl);
//getCityInfoApi();
//getWeatherApi("Detroit");
