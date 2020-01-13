
$(document).ready(function () {
  var  zamatoKey = "1c401654af94d9b2ae6b6197c14f20ec",
       geo = navigator.geolocation,
       mapDisplay;

  //get nearby restaurants on document load.
  setUsersCurrentPosition();

  //Main event.
  $("#search-btn").on("click", function () {
    var searchItem = $(".search-text").val().trim();
    showSearch(searchItem);
    geo.getCurrentPosition(function (position) {
      lat = position.coords.latitude;
      lng = position.coords.longitude;
      var coords = { lat: lat, lng: lng };
      console.log(coords);

      $.ajax({
        url:
          "https://developers.zomato.com/api/v2.1/cuisines?lat=" 
          + lat +
          "&lon=" + lng +
          "&apikey=" + zamatoKey +"",
        method: "GET"
      }).then(function (cuisines) {
        
        var cuisineId = getCuisineId(cuisines, searchItem).toString();

        $.ajax({
          url: "https://developers.zomato.com/api/v2.1/search?lat=" 
          + lat +
          "&lon=" + lng +
          "&cuisines=" + cuisineId +
          "&apikey=" + zamatoKey +"",
          method: "GET"
        }).then(function (food) {
          
          console.log(food);
          var theseRest = food.restaurants;
          console.log(theseRest);
          
          getMarkers(theseRest);
          paintResults(theseRest);
        });
        });
      });
  });

  function setUsersCurrentPosition() {
    geo.getCurrentPosition(function (position) {
      lat = position.coords.latitude;
      lng = position.coords.longitude;
      var coords = { lat: lat, lng: lng };
      initMap(coords);
      console.log(coords);
      $.ajax({
        url:
          "https://developers.zomato.com/api/v2.1/geocode?lat=" +
          lat +
          "&lon=" +
          lng +
          "&apikey=" +
          zamatoKey +
          "",
        method: "GET"
      }).then(function (food) {
        console.log(food);
        
        var allRest = food.nearby_restaurants;
        allRest.forEach(function (data) {
          var info = data.restaurant;
          var p = document.createElement("p");
          var cuisines = info.cuisines;
          var apikey = info.apikey;
          p.innerText = cuisines + apikey;
          
        });
        getMarkers(allRest);
      });
    });
  }

  function getCuisineId(data, searchItem) { 
    var cuisines = data.cuisines,
        id;
  
    cuisines.forEach(function(cuisine) {
      var foodType = cuisine.cuisine.cuisine_name.toLowerCase(),
          idNum = cuisine.cuisine.cuisine_id;
      if (foodType == searchItem.toLowerCase()) {
        id = idNum;
      } else {
        var message = "Oh No! Nothing found! Check your spelling to be sure.";
      }
    });
    return id;
   }

  function paintResults(results) {
    paintOne(results[0]);
    paintTwo(results[1]);
    paintThree(results[2]);
    
 }

 function paintOne(restaurant) {
  var name = restaurant.restaurant.name,
  address = restaurant.restaurant.location.address,
  hours = restaurant.restaurant.timings,
  picUrl = restaurant.restaurant.photos[0].photo.thumb_url,
  infoUrl = restaurant.restaurant.menu_url,
  type = restaurant.restaurant.establishment[0];   

  $('.name1').text(name);
  $('.type1').text(type);
  $('.pic1').attr('src', picUrl);
  $('.address1').text('Address: '+address);
  $('.address1').attr('target:', '_blank');
  $('.hours1').text('Hours: '+hours);
  $('.url1').attr('href', infoUrl);
  }

 function paintTwo(restaurant) {
  var name = restaurant.restaurant.name,
  address = restaurant.restaurant.location.address,
  hours = restaurant.restaurant.timings,
  picUrl = restaurant.restaurant.photos[0].photo.thumb_url,
  infoUrl = restaurant.restaurant.menu_url,
  type = restaurant.restaurant.establishment[0];   

  $('.name2').text(name);
  $('.type2').text(type);
  $('.pic2').attr('src', picUrl);
  $('.address2').text('Address: '+address);
  $('.address2').attr('target:', '_blank');
  $('.hours2').text('Hours: '+hours);
  $('.url2').attr('href', infoUrl);
  }

 function paintThree(restaurant) {
  var name = restaurant.restaurant.name,
  address = restaurant.restaurant.location.address,
  hours = restaurant.restaurant.timings,
  picUrl = restaurant.restaurant.photos[0].photo.thumb_url,
  infoUrl = restaurant.restaurant.menu_url,
  type = restaurant.restaurant.establishment[0];   

  $('.name3').text(name);
  $('.type3').text(type);
  $('.pic3').attr('src', picUrl);
  $('.address3').text('Address: '+address);
  $('.address3').attr('target:', '_blank');
  $('.hours3').text('Hours: '+hours);
  $('.url3').attr('href', infoUrl);
  }

  function showSearch(cuisine) {
    var searches = JSON.parse(localStorage.getItem("search"));
         
    if (searches) {
      searches.push(cuisine);
    } else {
      searches = [cuisine];
    }
    localStorage.setItem("search", JSON.stringify(searches));
    //
    $("#past-search").append(searches);
  }

function initMap(coords) {
  mapDisplay = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: coords,
    disableDefaultUI: true
  }),
    marker = new google.maps.Marker({ position: coords, map: mapDisplay });
}

function getMarkers(restuarants) {
  var markers = [],
      locations = [],
      bounds = new google.maps.LatLngBounds();

  //Set the coordinates into a Json format.
  restuarants.forEach(function(restaurant) {
      var coords = {
          lat : restaurant.restaurant.location.latitude,
          lng : restaurant.restaurant.location.longitude
      } 
      locations.push(coords)
  });
  //generate markers for each restaurant location. 
  locations.forEach(function (location) {
      var position = new google.maps.LatLng(location.lat, location.lng);
  
      markers.push(
        new google.maps.Marker({
          position: position,
          map: mapDisplay,
          animation: google.maps.Animation.DROP,
          icon: {url : "http://maps.google.com/mapfiles/kml/pal2/icon37.png"}
        })
      );
      //extend map bounds with each new position.  
      bounds.extend(position);
    });
    //re-center map around the extended boundaries.
    mapDisplay.fitBounds(bounds);
}


});
