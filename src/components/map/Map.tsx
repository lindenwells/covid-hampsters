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

import { Fragment } from "react";
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
// import "./Map.css"
import "leaflet/dist/leaflet.css";
import { data } from "../../assets/hospitals";
import * as turf from '@turf/turf'
import { Feature, Point } from "@turf/turf";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    map: {
      height: "600px",
    },
    padding: {
      padding: "16px",
    },
    legend: {
      background: "#2B2C3E",
      height: "150px",
      marginBottom: "50px",
      color: "#ffffff",
    },
    filter: {
      background: "#2B2C3E",
      height: "300px",
      color: "#ffffff",
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
            <Paper className={classes.legend}>Legend</Paper>
            <Paper className={classes.filter}>Filter</Paper>
          </Grid>
        </Grid>
      </div>
  );
}

interface area {
  points: Feature<Point>[];
  polygons: any[]; // Feature<Polygon> | null
  name: string;
  geoJSONs: GeoJSON<any>[]; // on map
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

      // insert area
      areas[area.name] = area;
    }
    
    let hospitalCoordinate = turf.point([parseFloat(hospital.lon), parseFloat(hospital.lat)]);
    area.points.push(hospitalCoordinate);
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
function MapGeoJSONHook() {
  const classes = useStyles();
  let map = useMap();
  let areas = polygonsCalc();
  let clicks = 0;

  const history = useHistory();
  function linkInvoke(area: string) {
    return () => history.push('/detail/' + area)
  };
  
  areas.forEach((area, index) => {
    // create geoJSONs
    area.geoJSONs = [];
    area.polygons.forEach((polygon, index) => {
      area.geoJSONs.push(geoJSON(polygon).addTo(map));
    });
  });
  
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
      content.push(<Button key={area.name} classes={{root: classes.button}} 
          onClick={linkInvoke(area.name)}>{area.name}</Button>);
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

  return null;
}