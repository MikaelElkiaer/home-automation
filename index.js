import * as fs from "node:fs";
import * as turf from "@turf/turf";

const CM_PER_KM = 1_000_00;
const TL = turf.point([9.938003897673866, 57.002646495178205]);
const TR = turf.point([9.93826499461693, 57.00259522346104]);
const BR = turf.point([9.938192188746712, 57.00248515991985]);
const BL = turf.point([9.937931091781024, 57.00253711542363]);
const BEARING_LR = turf.bearing(BL, BR);
const BEARING_RL = turf.bearing(BR, BL);
const BEARING_BT = turf.bearing(BL, TL);
const BEARING_TB = turf.bearing(TL, BL);

const cm = (value) => value / CM_PER_KM;
const km = (value) => value * CM_PER_KM;
const map = (points) => points.map((p) => p.geometry.coordinates);
const down = (p, distance) => turf.transformTranslate(p, -cm(distance), BEARING_BT);
const up = (p, distance) => turf.transformTranslate(p, cm(distance), BEARING_BT);
const left = (p, distance) => turf.transformTranslate(p, -cm(distance), BEARING_LR);
const right = (p, distance) => turf.transformTranslate(p, cm(distance), BEARING_LR);
const point = (polygon, index) =>
  turf.point(polygon.geometry.coordinates[0][index]);
const dist = (p1, p2) => km(turf.distance(p1, p2));

const WALL_THICKNESS = 10;

let features = {};

let foundation = (() => {
  let points = [TL, BL, BR, TR, TL];
  return turf.polygon([map(points)], {
    base_height: 0,
    color: "gray",
    height: 2.99,
    level: 0,
    name: "Foundation",
  });
})();

features.bedroom = (() => {
  let points = [];
  points.push(TL);
  points.push(down(points[0], 350));
  points.push(right(points[1], 390));
  points.push(up(points[2], 350));
  points.push(points[0]);
  return turf.polygon([map(points)], {
    base_height: 3,
    color: "red",
    height: 3,
    level: 1,
    name: "Bedroom",
  });
})();

features.bathroom = (() => {
  let points = [];
  points.push(point(features.bedroom, 3));
  points.push(down(points[0], 350));
  points.push(right(points[1], 200));
  points.push(up(points[2], 175));
  points.push(right(points[3], 100));
  points.push(up(points[4], 175));
  points.push(points[0]);
  return turf.polygon([map(points)], {
    base_height: 3,
    color: "cyan",
    height: 3,
    level: 1,
    name: "Bathroom",
  });
})();

features.toilet = (() => {
  let points = [];
  points.push(point(features.bathroom, 3));
  points.push(down(points[0], 175));
  points.push(right(points[1], 100));
  points.push(up(points[2], 175));
  points.push(points[0]);
  return turf.polygon([map(points)], {
    base_height: 3,
    color: "pink",
    height: 3,
    level: 1,
    name: "Toilet",
  });
})();

features.room1 = (() => {
  let points = [];
  points.push(up(BL, 400));
  points.push(down(points[0], 400));
  points.push(right(points[1], 300));
  points.push(up(points[2], 400));
  points.push(points[0]);
  return turf.polygon([map(points)], {
    base_height: 3,
    color: "purple",
    height: 3,
    level: 1,
    name: "Room 1",
  });
})();

features.room2 = (() => {
  let points = [];
  points.push(point(features.room1, 3));
  points.push(down(points[0], 400));
  points.push(right(points[1], 300));
  points.push(up(points[2], 400));
  points.push(points[0]);
  return turf.polygon([map(points)], {
    base_height: 3,
    color: "yellow",
    height: 3,
    level: 1,
    name: "Room 2",
  });
})();

features.room3 = (() => {
  let points = [];
  points.push(point(features.room2, 3));
  points.push(down(points[0], 400));
  points.push(right(points[1], 300));
  points.push(up(points[2], 400));
  points.push(points[0]);
  return turf.polygon([map(points)], {
    base_height: 3,
    color: "blue",
    height: 3,
    level: 1,
    name: "Room 3",
  });
})();

features.room4 = (() => {
  let points = [];
  points.push(up(point(features.room1, 0), 365));
  points.push(down(points[0], 365));
  points.push(right(points[1], 200));
  points.push(up(points[2], 140));
  points.push(right(points[3], 150));
  points.push(up(points[4], 225));
  points.push(points[0]);
  return turf.polygon([map(points)], {
    base_height: 3,
    color: "green",
    height: 3,
    level: 1,
    name: "Room 4",
  });
})();

features.hallway = (() => {
  let points = [];
  points.push(right(point(features.bedroom, 1), 210));
  points.push(right(point(features.room4, 0), 210));
  let height = dist(points[0], points[1]);
  points.push(down(point(features.bathroom, 2), height));
  points.push(point(features.bathroom, 2));
  points.push(points[0]);
  return turf.polygon([map(points)], {
    base_height: 3,
    color: "lightgrey",
    height: 3,
    level: 1,
    name: "Hallway",
  });
})();

features.entrance = (() => {
  let points = [];
  points.push(left(TR, 170));
  points.push(down(points[0], 490));
  points.push(right(points[1], 170));
  points.push(up(points[2], 490));
  points.push(points[0]);
  return turf.polygon([map(points)], {
    base_height: 3,
    color: "lightgray",
    height: 3,
    level: 1,
    name: "Entrance",
  });
})();

features.livingroom = (() => {
  let points = [];
  points.push(point(features.room3, 3));
  points.push(down(points[0], 400));
  points.push(BR);
  points.push(point(features.entrance, 2));
  let width = turf.distance(points[1], points[2]);
  points.push(left(points[3], width * 1_000_00));
  points.push(points[0]);
  // TODO: Add half-wall
  return turf.polygon([map(points)], {
    base_height: 3,
    color: "brown",
    height: 3,
    level: 1,
    name: "Living Room",
  });
})();

features.bigroom = (() => {
  let points = [];
  points.push(point(features.bathroom, 5));
  points.push(point(features.toilet, 2));
  points.push(point(features.hallway, 3));
  points.push(point(features.hallway, 2));
  points.push(point(features.room4, 5));
  points.push(point(features.room4, 4));
  points.push(point(features.room4, 3));
  points.push(point(features.room4, 2));
  points.push(point(features.room2, 0));
  points.push(point(features.room3, 3));
  points.push(point(features.livingroom, 4));
  points.push(point(features.entrance, 1));
  points.push(point(features.entrance, 0));
  points.push(points[0]);
  return turf.polygon([map(points)], {
    base_height: 3,
    color: "orange",
    height: 3,
    level: 1,
    name: "Big Room",
  });
})();

let shrink_room = (feature, thickness) => {
  let shrunk = [];
  let points = feature.geometry.coordinates[0];
  for (let i = 0; i < points.length - 1; i++) {
    let prev = turf.point(i == 0 ? points[points.length - 2] : points[i - 1]);
    let curr = turf.point(points[i]);
    let next = turf.point(points[i + 1]);
    let angle = Math.round(turf.angle(prev, curr, next));
    let bearing_prev = turf.bearing(prev, curr);
    let bearing_next = turf.bearing(curr, next);
    if (angle == 180) {
      curr = turf.destination(curr, cm(thickness), bearing_prev-90);
    } else if (angle < 180) {
      curr = turf.destination(curr, cm(thickness), bearing_prev+180);
      curr = turf.destination(curr, cm(thickness), bearing_next);
    } else if (angle > 180) {
      curr = turf.destination(curr, cm(thickness), bearing_prev);
      curr = turf.destination(curr, cm(thickness), bearing_next+180);
    }
    shrunk.push(curr.geometry.coordinates);
  }
  shrunk.push(shrunk[0]);
  feature.geometry.coordinates = [shrunk];
};

Object.values(features).forEach((feature) => {
  shrink_room(feature, WALL_THICKNESS);
});

let walls = turf.difference(turf.featureCollection([foundation].concat(Object.values(features))));
walls.properties = {
  base_height: 3,
  color: "gray",
  height: 5,
  level: 1,
  name: "Walls",
};

let featureCollection = turf.featureCollection(Object.values(features).concat(foundation, walls));
fs.writeFileSync("./data.geojson", JSON.stringify(featureCollection));
