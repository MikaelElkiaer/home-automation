# Home Automation

## Pre-requisites

Register at [MapBox](https://www.mapbox.com/) and get an access token.
Place it in `./static/accesstoken`.

## Getting started

```bash
# Update map
# - edit index.js with floor plan, see below for details
npm run-script update

# Start server
npm start
```

## Floor plan

As a starting point, it is possible to get building info based on existing data.

```javascript
// Source: https://stackoverflow.com/a/43467908.

// Dafault public token, replace with yours if you have one
mapboxgl.accessToken = 'pk.eyJ1IjoibHZpZ2dpYW5pIiwiYSI6ImNpeHZvbGVqMzAwMGoyd3J5YXllbnpuOHQifQ.RAyB0ZTsnLggAZYp_TPmHQ';

var map = new mapboxgl.Map({
    container: div,
    style: 'mapbox://styles/mapbox/outdoors-v9',
    interactive: false
});

map.fitBounds(
    someBounds, // arbitrary bounds 
    {
        linear: true
    });

map.on("load", function(){
    features = map.queryRenderedFeatures(
            { layers: ["building"], filter: ['==', 'extrude', 'true']}); // This is where I get building information

    features.forEach(function(feature){
        console.log(feature.geometry);  // feature.geometry getter returns building shape points (basement)
        console.log(feature.properties.height); // this is the building height
        console.log(feature.properties.min_height); // this is the building part elevation from groung (e.g. a bridge)
    });
});
```
