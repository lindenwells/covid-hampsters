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

import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
// import "./Map.css"
import "leaflet/dist/leaflet.css";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: "#f2f2f2",
    },
    map: {
      height: "500px",
    },
    padding: {
      padding: "16px",
    },
    legend: {
      background: "#bdbdbd",
      height: "150px",
      marginBottom: "50px",
    },
    filter: {
      background: "#bdbdbd",
      height: "300px",
    },
    center: {
      margin: "auto",
      maxWidth: 1500,
    },
  })
);
  
export default function Map() {
  const classes = useStyles();
  let position: LatLngExpression = [-27.4705, 153.0260]
  const color = { color: 'red' }

  return (
    //<React.Fragment></React.Fragment>
      <div className={classes.root}>
        <Grid container className={classes.center}>
          <Grid item className={classes.padding} xs={9}>
            <Box className={classes.map}>
              <MapContainer style={{ height: '100%', width: '100%' }} center={position} zoom={9} scrollWheelZoom={false}>
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Circle center={[-27.4705, 153.0260]} pathOptions={color} radius={10000}>
                  <Popup>Brisbane Hospitals</Popup>
                </Circle>
                <Circle center={[-27.6146, 152.7608]} pathOptions={color} radius={6000}>
                  <Popup>Ipswitch Hospitals</Popup>
                </Circle>
              </MapContainer>
            </Box>
          </Grid>
          <Grid item className={classes.padding} xs={3}>
            <Box className={classes.legend}>Legend</Box>
            <Box className={classes.filter}>Filter</Box>
          </Grid>
        </Grid>
      </div>
  );
}