import { readFileSync } from "node:fs";
import * as turf from "@turf/turf";

//let geojson = JSON.parse(readFileSync('data.geojson'));

let top_left = turf.point([9.938003897673866, 57.002646495178205]),
  top_right = turf.point([9.93826499461693, 57.00259522346104]),
  bottom_right = turf.point([9.938192188746712, 57.00248515991985]),
  bottom_left = turf.point([9.937931091781024, 57.00253711542363]);
//let center = turf.centerOfMass(geojson);
//console.log(center);
//let area = turf.area(geojson);
//console.log(area);
let bearing_x = turf.bearing(bottom_left, bottom_right);
let bearing_y = turf.bearing(bottom_left, top_left);

let x = turf.transformTranslate(bottom_left, 3/1000, bearing_y);
console.log(JSON.stringify(x));

//let scaled = turf.transformScale(geojson, 0.936);
//let area = turf.area(scaled);
//console.log(area);
//console.log(JSON.stringify(scaled));
