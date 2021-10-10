/*
 * Map shows:
 *   - Map w/ circle vector layers.
 *   - Uses leaflet, react-leaflet & OpenStreetMap.
 * 
 * REFERENCES:
 * P. L. Cam et al. "React Leaflet." React Leaflet. 
 * https://react-leaflet.js.org/ (accessed Sep. 12, 2021).
 * 
 * V. Agafonkin et al. "Leaflet." Leaflet. 
 * https://leafletjs.com/ (accessed Sep. 12, 2021).
 * 
 * OpenStreetMap et al. "OpenStreetMap." OpenStreetMap.
 * https://www.openstreetmap.org/ (accessed Sep. 12, 2021).
 */

import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";
import { useHistory } from "react-router-dom";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { MapContainer, TileLayer, useMap, useMapEvent, Circle, Tooltip } from 'react-leaflet';
import { LatLngExpression, geoJSON, GeoJSON, popup } from 'leaflet';
import "leaflet/dist/leaflet.css";
// import "./Map.css"
import firebase from "../../firebase";
import { data } from "../../assets/hospitals";
import { mapQuery } from "../../assets/databaseMap";
import * as turf from '@turf/turf'
import { Feature, Point } from "@turf/turf";
import { auth } from "../../firebase"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    map: {
      height: "600px",
    },
    padding: {
      padding: "16px",
    },
    center: {
      margin: "auto",
      maxWidth: 1500,
    },
    button: {
      backgroundColor: "#2B2C3E",
      color: "#ffffff",
      '&:hover': {
        background: "#8a8a8a",
      },
    },
    mapBox: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    },
    mapBoxBedNumber: {
      background: "#3278c5",
      margin: "10px",
      marginTop: "5px",
      padding: "5px",
      color: "#ffffff",
    },
    legend: {
      background: "#2B2C3E",
      height: "125px",
      marginBottom: "50px",
      color: "#ffffff",
    },
    legendBox: {
      background: "linear-gradient(90deg, rgba(255,25,0,1) 0%, rgba(255,111,0,1) 25%, rgba(255,242,0,1) 50%, rgba(66,245,69,1) 100%)",
      height: "25px",
      marginTop: "10px",
      marginLeft: "20px",
      marginRight: "20px",
      color: "#ffffff",
    },
    legendGridItem: {
      marginTop: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    legendGridItemRedBox: {
      margin: "5px",
      height: "18px",
      width: "18px",
      background: "rgba(255,25,0,1)",
    },
    legendGridItemYellowBox: {
      margin: "5px",
      height: "18px",
      width: "18px",
      background: "rgba(255,242,0,1)",
    },
    legendGridItemGreenBox: {
      margin: "5px",
      height: "18px",
      width: "18px",
      background: "rgba(66,245,69,1)",
    },
    filter: {
      background: "#2B2C3E",
      height: "200px",
      color: "#ffffff",
    },
  })
);
  
export default function Map() {
  const classes = useStyles();
  let position: LatLngExpression = [-23.4141, 144.7852]
  const blue = { color: "#0177FB" }
  const red = { color: "#ff0000" }

  return (
      <div>
        <Grid container className={classes.center}>
          <Grid item className={classes.padding} xs={9}>
            <Box className={classes.map}>
              <MapContainer style={{ height: '100%', width: '100%' }} center={position} zoom={5} scrollWheelZoom={false}>
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapGeoJSONHook />
                {/*data.map((element, index) => {
                    // Hospitals
                    return (
                      <Circle center={[parseFloat(element.lat), parseFloat(element.lon)]} pathOptions={red} radius={250}>
                        <Tooltip>{element["Facility Name"]}</Tooltip>
                      </Circle>
                    );
                })*/}
              </MapContainer>
            </Box>
          </Grid>
          <Grid item className={classes.padding} xs={3}>
            <Paper className={classes.legend}>
              Bed Availability
              <Paper className={classes.legendBox}></Paper>
              <Grid container className={classes.center}>
                <Grid item className={classes.legendGridItem} xs={4}>
                  <Paper className={classes.legendGridItemRedBox}></Paper>
                  <span>0%</span>
                </Grid>
                <Grid item className={classes.legendGridItem} xs={4}>
                  <Paper className={classes.legendGridItemYellowBox}></Paper>
                  <span>50%</span>
                </Grid>
                <Grid item className={classes.legendGridItem} xs={4}>
                  <Paper className={classes.legendGridItemGreenBox}></Paper>
                  <span>100%</span>
                </Grid>
              </Grid>
            </Paper>
            <Paper className={classes.filter}>Filter</Paper>
          </Grid>
        </Grid>
      </div>
  );
}

interface area {
  points: Feature<Point>[];
  polygons: any[]; // Feature<Polygon> | null
  name: string; // area name
  hospitals: Record<string, typeof data[0]>; // hospital in area from hospitals.json 
  geoJSONs: GeoJSON<any>[]; // on map
  occupancy: number;
  maxBeds: number;
}

/*
 * Calculate convex hull using turf.js and latitudes/longitudes.
 */ 
function polygonsCalc(): area[] {
  let areas = {} as Record<string, area>;
  let area = {} as area;
  
  data.forEach(function (hospital, index) {
    if (areas[hospital["Hospital and Health Service"]])
      area = areas[hospital["Hospital and Health Service"]]
      
    if (areas[hospital["Hospital and Health Service"]] === undefined) {
      // next area
      area = {} as area;
      area.points = [] as Feature<Point>[];
      area.polygons = [];
      area.name = hospital["Hospital and Health Service"];
      area.hospitals = {};

      // insert area
      areas[area.name] = area;
    }
    
    let hospitalCoordinate = turf.point([parseFloat(hospital.lon), parseFloat(hospital.lat)]);
    area.points.push(hospitalCoordinate);
    area.hospitals[hospital["Facility Name"]] = hospital;
  });

  for (const name in areas) {
    const area: area = areas[name];
    area.polygons.push(turf.convex(turf.featureCollection(area.points)));
    if (area.polygons[0] === null) {
      // if there are less than two hospitals, just give them a circle each.
      if (area.points.length <= 2) {
        area.points.forEach((point, index) => {
          area.polygons[index] = turf.circle(point, 2, {steps: 10, units: 'kilometers'});
        });
      }
    }
  }
  
  return Object.values(areas);
}


/*
 * Insert polygons created by polygonsCalc(), and handle clicks.
 */ 
var polygons: boolean = false; // Have the polygons already been put onto the map?
var areas = polygonsCalc();
function MapGeoJSONHook() {
  const classes = useStyles();
  let map = useMap();
  let clicks = 0;
  
  const history = useHistory();
  function linkInvoke(area: string) {
    if (!auth) {
        window.alert("please login to view data");
        return
    }
    const email = auth.currentUser?.email;
    const emailExp1 = /^\w+([-+.]\w+)*@uqconnect.edu.au$/;
    const emailExp2 = /^\w+([-+.]\w+)*@student.uq.edu.au$/;
    const emailExp3 = /^\w+([-+.]\w+)*@uq.net.edu.au$/;
    let valid = null;
    if (email) {
        valid = emailExp1.test(email) || emailExp2.test(email) || emailExp3.test(email);
    }
    if (valid) {
      polygons = false;
      return () => history.push('/detail/' + area)
    } else {
      window.alert("please login to view data");
    }
  };

  map = useMapEvent('click', (e) => {
    // turf = lon/lat
    // let clickBounds = latLngBounds(e.latlng, e.latlng);
    let areasClicked = {} as Record<string, area>;

    areas.forEach((area, index) => {
      area.polygons.forEach((polygon, index) => {
        if (turf.inside(turf.point([e.latlng.lng, e.latlng.lat]), polygon)) {
          areasClicked[area.name] = area;
        }
      });
    });

    // The code below is hacky, maybe find better way?
    const content = [];
    for (const name in areasClicked) {
      const area: area = areasClicked[name];
      content.push(
        <div className={classes.mapBox}>
          <Button key={area.name} classes={{root: classes.button}} 
          onClick={linkInvoke(area.name)}>Go To: {area.name}</Button>
          <Paper className={classes.mapBoxBedNumber}>{area.occupancy} / {area.maxBeds} Beds Occupied</Paper>
        </div>
      );
      console.log('CLICKED: ' + area.name);
    }
    
    if (Object.keys(areasClicked).length !== 0) {
      // .bindPopup?
      popup()
      .setLatLng(e.latlng)
      .setContent('<div id="popup' + clicks + '">' + 
          ReactDOMServer.renderToString(<Fragment>{content}</Fragment>) + '</div>')
      .openOn(map);
      ReactDOM.hydrate(content, document.getElementById("popup" + clicks++));
    }
  });

  if (polygons) {
    return null;
  } else {
    mapQuery().then(function(query: void | firebase.firestore.DocumentData) {
      if (query instanceof Object) {
        areas.forEach((area, index) => {
          area.occupancy = 0;
          area.maxBeds = 0;
          for (const hospitalId in area.hospitals) {
            if (query[area.hospitals[hospitalId]["Facility Name"]])
              area.occupancy += query[area.hospitals[hospitalId]["Facility Name"]];
            area.maxBeds += area.hospitals[hospitalId]["Max Bed Capacity"];
          }
          console.log("occupancy for:" + area.name + area.occupancy);
          // create geoJSONs
          area.geoJSONs = [];
          area.polygons.forEach((polygon, index) => {
            let color = "#42f545"; // green
            if (area.occupancy !== 0) {
              color = getColorForPercentage(1 - (area.occupancy / area.maxBeds));
            }
  
            area.geoJSONs.push(geoJSON(polygon, {
              style: {
                "color": color
              }
            }).addTo(map));
          });
        });
      }
    });
    polygons = true;
  }

  return null;
}

/*
 * "getColorForPercentage" comes from this reference:
 *
 * Jacob. "from green to red color depend on percentage." stackoverflow. 
 * https://stackoverflow.com/questions/7128675/from-green-to-red-color-depend-on-percentage (accessed Oct. 6, 2021).
 * 
 * 0: #ff1900 (red)
 * 0.25: #ff6f00 (orange)
 * 0.5: #fff200 (yellow)
 * 1: #42f545 (green)
 */
var percentColors = [
  { pct: 0.0, color: { r: 0xff, g: 0x19, b: 0 } },
  { pct: 0.25, color: { r: 0xff, g: 0x6f, b: 0 } },
  { pct: 0.5, color: { r: 0xff, g: 0xf2, b: 0 } },
  { pct: 1.0, color: { r: 0x42, g: 0xf5, b: 0x45 } } ];

var getColorForPercentage = function(pct: any) {
  for (var i = 1; i < percentColors.length - 1; i++)
      if (pct < percentColors[i].pct)
          break;
  var lower = percentColors[i - 1];
  var upper = percentColors[i];
  var range = upper.pct - lower.pct;
  var rangePct = (pct - lower.pct) / range;
  var pctLower = 1 - rangePct;
  var pctUpper = rangePct;
  var color = {
      r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
      g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
      b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
  };
  return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
};