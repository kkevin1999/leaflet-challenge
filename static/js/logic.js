// creating the url variable to get the info to get the data with d3
let past_7_days = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
let past_day ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

d3.json(past_7_days).then(data => console.log(data.features));

// creating the base layers
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var Topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});
let base_layers = {
    "street": street,
    "topo": Topo
}
// creating our map
let myMap = L.map("map", {
    // giving Toronto's lon-lat
    center: [43.6532, -79.3832],
    zoom: 5,
    layers: street,
});

// creating the control layer with it's default position
L.control.layers(base_layers).addTo(myMap);

// Addding our legend to the map with the color pallet sample
let legend = L.control({position: "bottomright"});
legend.onAdd = function(myMap) {
  let div = L.DomUtil.create("div", "legend");
  return div;
};
legend.addTo(myMap);
document.querySelector(".legend").innerHTML = [
  '<i style="background:yellowgreen"></i>depth < 20<br>',
  '<i style="background:green"></i>20 <= depth < 40<br>',
  '<i style="background:yellow"></i>40 <= depth < 60<br>',
  '<i style="background:orange"></i>60 <= depth < 80<br>',
  '<i style="background:red"></i>80 <= depth<br>'
].join("");

// plotting the Data 
d3.json(past_7_days).then(function creating_points(data) {

  geoLayer = L.geoJson(data, {

    style: function(feature) {
      var depth = feature.geometry.coordinates[2];
      if (depth >= 80) {
        return {
          color: "red"
        }; 
      } else if (depth >= 60) {
        return {
          color: "orange"
        };
      } else if (depth >= 40) {
        return {
          color: "yellow"
        };
      } else if (depth >= 20) {
        return {
          color: "green"
        };
      } else {
        return {
          color: "yellowgreen"
        };
      }
    },

    // adding labels and popup 
    onEachFeature: function(feature, layer) {

      var popupT = "<b>Magnitude:</b> " + feature.properties.mag +
        "<br><b>Location:</b> " + feature.properties.place +
        "<br><b>Depth:</b> " + feature.geometry.coordinates[2];

      layer.bindPopup(popupT, {
        closeButton: true,
        offset: L.point(0, -20)
      });
      layer.on('click', function() {
        layer.openPopup();
      });
    },
    
    // turning our point type coordinates to circles
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag * 3,
      });
    },
  }).addTo(myMap);
});