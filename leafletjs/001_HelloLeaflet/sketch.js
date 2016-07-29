var mymap = L.map('mapid').setView([44.43, 26.10], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.satellite',
    accessToken: 'pk.eyJ1Ijoic2FiaW51IiwiYSI6ImNpcjdyamZsODAwMXFpam1nOXl3bzl1djAifQ.T2RVI8AZuDpO8WXCAO64zQ'
}).addTo(mymap);


var marker = L.marker([44.43, 26.10]).addTo(mymap);


var popup = L.popup();

function onMapClick(event) {
  popup
    .setLatLng(event.latlng)
    .setContent('You clicked the map at ' + event.latlng.toString())
    .openOn(mymap);
}

mymap.on('click', onMapClick);
