let client, map;

async function main() {
  await setAccessToken();
  map = createMap();
  client = mqttConnect();
}

async function setAccessToken() {
  let response = await fetch("/accesstoken");
  let token = await response.text();
  mapboxgl.accessToken = token;
}

function createMap() {
  let map = new mapboxgl.Map({
    container: "map",
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: "mapbox://styles/mapbox/dark-v11",
    center: [9.93809816131456, 57.00256595817176],
    bounds: [
      [9.937931091781024, 57.00253711542363],
      [9.93826499461693, 57.00259522346104],
    ], // bounding box (southwest corner, northeast corner)

    // by setting the bounds your map will automatically center around the bounding box
    fitBoundsOptions: {
      padding: 50, // padding to keep the bounds away from the edge of the map
    },
    antialias: true,
    interactive: true,
  });
  map.on("load", load(map));
  return map;
}

function mqttConnect() {
  console.debug("Connecting to mqtt...");
  const client = mqtt.connect("wss://mqtt.home.elkiaer.net");
  client.on("connect", () => {
    console.debug("Connected to mqtt");
    client.subscribe("zigbee2mqtt/#", function (err) {
      if (!err) {
        console.log("Subscribed to zigbee2mqtt/#");
      } else {
        console.error(err);
      }
    });
  });

  client.on("message", function (topic, message) {
    console.debug(topic, ":", message.toString());
  });

  return client;
}

function load(map) {
  return async () => {
    let lastModified;
    map.addSource("floorplan", {
      type: "geojson",
      data: {},
    });
    map.addSource("points", {
      type: "geojson",
      data: {},
    });
    map.addLayer({
      id: "floor1",
      type: "fill-extrusion",
      source: "floorplan",
      paint: {
        // Get the `fill-extrusion-color` from the source `color` property.
        "fill-extrusion-color": ["get", "color"],

        // Get `fill-extrusion-height` from the source `height` property.
        "fill-extrusion-height": ["get", "height"],

        // Get `fill-extrusion-base` from the source `base_height` property.
        "fill-extrusion-base": ["get", "base_height"],
        // Make extrusions slightly opaque to see through indoor walls.
        //'fill-extrusion-opacity': 0.5
      },
    });
    map.addLayer({
      id: "points",
      type: "symbol",
      source: "points",
      layout: {
        "icon-image": "rocket",
        "symbol-z-offset": 5,
        "symbol-z-elevate": true,
        "text-field": ["get", "text"],
        "text-variable-anchor": ["top", "bottom", "left", "right"],
        "text-radial-offset": 0.5,
        "text-justify": "auto",
      },
    });
    const timer = setInterval(async () => {
      const response = await fetch("/floor1.geojson");
      const data = await response.json();
      const newLastModified = response.headers.get("Last-Modified");
      if (newLastModified === lastModified) {
        return;
      }
      console.log("Updating data");
      lastModified = newLastModified;
      map.getSource("floorplan").setData(data);

      const response2 = await fetch("/points.geojson");
      const data2 = await response2.json();
      map.getSource("points").setData(data2);
    }, 1000);
  };
}

main();
