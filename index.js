import * as fs from "node:fs";
import * as turf from "@turf/turf";

const top_left = turf.point([9.938003897673866, 57.002646495178205]);
const top_right = turf.point([9.93826499461693, 57.00259522346104]);
const bottom_right = turf.point([9.938192188746712, 57.00248515991985]);
const bottom_left = turf.point([9.937931091781024, 57.00253711542363]);
const bearing_x = turf.bearing(bottom_left, bottom_right);
const bearing_y = turf.bearing(bottom_left, top_left);

const foundation = turf.polygon(
  [
    [
      top_left.geometry.coordinates,
      top_right.geometry.coordinates,
      bottom_right.geometry.coordinates,
      bottom_left.geometry.coordinates,
      top_left.geometry.coordinates,
    ],
  ],
  {
    base_height: 0,
    color: "gray",
    height: 2.99,
    level: 0,
  },
);

let room1, room1_br;
const wall = 0.0003;
(() => {
  const bl = turf.transformTranslate(
    turf.transformTranslate(bottom_left, wall, bearing_y),
    wall,
    bearing_x,
  );
  const tl = turf.transformTranslate(bl, 0.004, bearing_y);
  const tr = turf.transformTranslate(tl, 0.003, bearing_x);
  const br = turf.transformTranslate(tr, -0.004, bearing_y);
  room1_br = br;
  room1 = turf.polygon(
    [
      [
        bl.geometry.coordinates,
        tl.geometry.coordinates,
        tr.geometry.coordinates,
        br.geometry.coordinates,
        bl.geometry.coordinates,
      ],
    ],
    {
      base_height: 3,
      color: "purple",
      height: 3,
      level: 1,
    },
  );
})();

let room2, room2_br;
(() => {
  const bl = turf.transformTranslate(room1_br, wall, bearing_x);
  const tl = turf.transformTranslate(bl, 0.004, bearing_y);
  const tr = turf.transformTranslate(tl, 0.003, bearing_x);
  const br = turf.transformTranslate(tr, -0.004, bearing_y);
  room2_br = br;
  room2 = turf.polygon(
    [
      [
        bl.geometry.coordinates,
        tl.geometry.coordinates,
        tr.geometry.coordinates,
        br.geometry.coordinates,
        bl.geometry.coordinates,
      ],
    ],
    {
      base_height: 3,
      color: "yellow",
      height: 3,
      level: 1,
    },
  );
})();

let room3, room3_br;
(() => {
  const bl = turf.transformTranslate(room2_br, wall, bearing_x);
  const tl = turf.transformTranslate(bl, 0.004, bearing_y);
  const tr = turf.transformTranslate(tl, 0.003, bearing_x);
  const br = turf.transformTranslate(tr, -0.004, bearing_y);
  room3_br = br;
  room3 = turf.polygon(
    [
      [
        bl.geometry.coordinates,
        tl.geometry.coordinates,
        tr.geometry.coordinates,
        br.geometry.coordinates,
        bl.geometry.coordinates,
      ],
    ],
    {
      base_height: 3,
      color: "blue",
      height: 3,
      level: 1,
    },
  );
})();

let livingroom;
(() => {
  let points = [];
  points[0] = turf.transformTranslate(room3_br, wall, bearing_x);
  points[1] = turf.transformTranslate(points[0], 0.0063, bearing_x);
  points[2] = turf.transformTranslate(points[1], 0.006, bearing_y);
  points[3] = turf.transformTranslate(points[2], -0.0063, bearing_x);
  points[4] = turf.transformTranslate(points[3], -0.003, bearing_y);
  points[5] = turf.transformTranslate(points[4], 0.002, bearing_x);
  points[6] = turf.transformTranslate(points[5], -wall, bearing_y);
  points[7] = turf.transformTranslate(points[6], -0.002, bearing_x);
  points[8] = points[0];
  livingroom = turf.polygon(
    [points.map((point) => point.geometry.coordinates)],
    {
      base_height: 3,
      color: "brown",
      height: 3,
      level: 1,
    },
  );
})();

let entrance;
(() => {
  let points = [];
  points[0] = turf.transformTranslate(
    turf.transformTranslate(top_right, -wall, bearing_x),
    -wall,
    bearing_y,
  );
  points[1] = turf.transformTranslate(points[0], -0.006, bearing_y);
  points[2] = turf.transformTranslate(points[1], -0.002, bearing_x);
  points[3] = turf.transformTranslate(points[2], 0.006, bearing_y);
  points[4] = points[0];
  entrance = turf.polygon([points.map((point) => point.geometry.coordinates)], {
    base_height: 3,
    color: "green",
    height: 3,
    level: 1,
  });
})();

let bedroom;
(() => {
  let points = [];
  points[0] = turf.transformTranslate(
    turf.transformTranslate(top_left, wall, bearing_x),
    -wall,
    bearing_y,
  );
  points[1] = turf.transformTranslate(points[0], 0.003, bearing_x);
  points[2] = turf.transformTranslate(points[1], -0.004, bearing_y);
  points[3] = turf.transformTranslate(points[2], -0.003, bearing_x);
  points[4] = points[0];
  bedroom = turf.polygon([points.map((point) => point.geometry.coordinates)], {
    base_height: 3,
    color: "red",
    height: 3,
    level: 1,
  });
})();

let allwall;
(() => {
  allwall = turf.difference(
    turf.featureCollection([
      foundation,
      room1,
      room2,
      room3,
      livingroom,
      entrance,
      bedroom,
    ]),
  );
  allwall.properties = {
    base_height: 3,
    color: "gray",
    height: 5,
    level: 1,
  };
})();

const features = turf.featureCollection([
  foundation,
  room1,
  room2,
  room3,
  livingroom,
  allwall,
  entrance,
  bedroom,
]);
fs.writeFileSync("./data.geojson", JSON.stringify(features));
