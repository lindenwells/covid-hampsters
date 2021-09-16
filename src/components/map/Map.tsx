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

import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { MapContainer, TileLayer, Tooltip, Circle } from 'react-leaflet';
import { LatLngExpression, LeafletMouseEventHandlerFn } from 'leaflet';
// import "./Map.css"
import "leaflet/dist/leaflet.css";

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
  })
);
  
export default function Map() {
  const classes = useStyles();
  let position: LatLngExpression = [-27.4705, 153.0260]
  const color = { color: "#0177FB" }

  // Invoke "Link" (OnClick).
  const history = useHistory();
  function OnClick(area: string): LeafletMouseEventHandlerFn {
    return useCallback(() => history.push('/detail/' + area), [history]);
  };

  return (
    //<React.Fragment></React.Fragment>
      <div>
        <Grid container className={classes.center}>
          <Grid item className={classes.padding} xs={9}>
            <Box className={classes.map}>
              <MapContainer style={{ height: '100%', width: '100%' }} center={position} zoom={9} scrollWheelZoom={false}>
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Circle center={[-27.4705, 153.0260]} pathOptions={color} radius={10000} 
                  eventHandlers={{ click: OnClick("Brisbane") }}
                >
                  <Tooltip>Brisbane Hospitals</Tooltip>
                </Circle>
                <Circle center={[-27.6146, 152.7608]} pathOptions={color} radius={6000}
                  eventHandlers={{ click: OnClick("Ipswitch") }}
                >
                  <Tooltip>Ipswitch Hospitals</Tooltip>
                </Circle>
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