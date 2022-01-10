// Elements
var citySearchInputEl = document.getElementById('searchCity');
var citySearchBtnEl = document.getElementById('citySearchBtn');
var currentConditionsDivEl = document.getElementById('currentConditions');
var forecastRowEl = document.getElementById('forecastRow');
var searchResultsEl = document.getElementById('searchResults');

var searchBtnsAry = new Array();

// City data
var city = '';
var lat = '';
var lon = '';
var weatherHistory = [];

//Load History from local storage
var loadHistory = function() {
    weatherHistory = JSON.parse(localStorage.getItem("weatherHistory"));
  
    // if nothing in localStorage, return
    if (!weatherHistory) {
        weatherHistory = [];
        return;
    }
    
    // loop over object properties and add buttons
    for (i=0; i<weatherHistory.length; i++){
        // console.log(weatherHistory[i].city, weatherHistory[i].lat, weatherHistory[i].lon);
        addCityBtn(weatherHistory[i].city, weatherHistory[i].lat, weatherHistory[i].lon);
    };
};

// save history to local storage
var saveHistory = function() {
    console.log("saving");
    localStorage.setItem("weatherHistory", JSON.stringify(weatherHistory));
};

// create history and buttons
var createHistory = function (myCity, myLat, myLon){
    console.log("create button and history");
    // check to see if the city is already in our history
    if (searchBtnsAry){
        for(i=0; i<searchBtnsAry.length; i++){
            if (searchBtnsAry[i].id==myCity){
                console.log("test2");
                return; //do not add duplicate history
            }
        }
    }

    //Add the button
    addCityBtn(myCity, myLat, myLon);

    //add to history array used to check for duplicates and save
    weatherHistory.push({city:myCity, lat:myLat, lon:myLon});

    //save history to local storage
    saveHistory();
}

// function to add city buttons.  called from createHistory and from loadHistory
var addCityBtn = function (myCity, myLat, myLon){
    console.log("addCityBtn");
    var cityBtn = document.createElement('button');
    cityBtn.setAttribute("class", "btn btn-block btn-primary");
    cityBtn.setAttribute("type", "button");
    cityBtn.setAttribute("id", myCity);
    cityBtn.setAttribute("data-lat", myLat);
    cityBtn.setAttribute("data-lon", myLon);
    cityBtn.innerText = myCity;

    searchResultsEl.append(cityBtn);
    searchBtnsAry.push(cityBtn);

}
    

//get the lat lon then get the weather!  Used when searching for a new city
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
        createHistory(city, lat, lon);
       });
  }


function getWeatherApi() {
    console.log("getWeatherApi: " + city);
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

var reloadCity = function (myEvent){
    var el = myEvent.target
    
    city = el.id;
    lat = el.getAttribute('data-lat');
    lon = el.getAttribute('data-lon');
    console.log(city + " " + lat + " " +lon);
    getWeatherApi();
}

var cleanUp = function(){
    // clean up var and inputs until next time
    citySearchInputEl.value = '';
    city = '';
    lat = '';
    lon = '';
}


citySearchBtnEl.addEventListener('click', getCityInfoApi);
searchResultsEl.addEventListener('click', function (myEvent) {
    reloadCity(myEvent);
});
//All functions are loaded... lets load some data!
loadHistory();

