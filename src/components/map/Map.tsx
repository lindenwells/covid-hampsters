/*
 * Map shows:
 *   - Map w/ geoJSON vector layers, interactable.
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
 * 
 * (FilterSelect())
 * Material-UI. "Select." Material-UI. 
 * https://v4.mui.com/components/selects/#select (accessed Oct. 11, 2021).
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
import { FormControl, InputLabel } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import { MapContainer, TileLayer, useMap, useMapEvent } from 'react-leaflet';
import { LatLngExpression, geoJSON, popup, Layer, Map as LeafletMap } from 'leaflet';
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
      [theme.breakpoints.down('md')]: {
        marginLeft: "auto",
        marginRight: "auto",
      },
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
      height: "175px",
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
    guide: {
      background: "#2B2C3E",
      minheight: "200px",
      color: "#ffffff",
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    formText: {
      color: "#4254B2",
    },
    formText2: {
      color: "#2B2C3E",
      backgroundColor: "#424242",
    },
  })
);

/* Describes the geoJSON data on the map */
interface area {
  points: Feature<Point>[];
  polygons: any[]; // Feature<Polygon> | null
  layers: Layer[]; // on map
  name: string; // area name
  hospitals: Record<string, typeof data[0]>; // hospital in area from hospitals.json 
  occupancy: number;
  maxBeds: number;
  active: boolean; // if area on map should be clickable
}

interface MapInterface {
  layersMapHandle: (areas: area[], map: LeafletMap) => void;
  areas: area[] | undefined;
  rendered: boolean;
}

interface FilterInterface {
  setAreas: React.Dispatch<React.SetStateAction<area[]>>;
  areas: area[] | undefined;
  map: LeafletMap | undefined;
}

/* Contains the entire map and its components. */
export default function Map() {
  const classes = useStyles();
  let position: LatLngExpression = [-23.4141, 144.7852];
  const [map, setMap] = React.useState<LeafletMap>();
  const [areas, setAreas] = React.useState(polygonsCalc());
  const [rendered, setRendered] = React.useState(false); // Check if rendered polygons

  const layersMapHandle = (areas: area[], map: LeafletMap) => {
    setRendered(true);
    setAreas(areas);
    setMap(map);
  };

  return (
    <div>
      <Grid container className={classes.center}>
        <Grid item className={classes.padding} xs={12} md={9}>
          <Box className={classes.map}>
            <MapContainer style={{ height: '100%', width: '100%' }} center={position} zoom={5} scrollWheelZoom={true}>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapGeoJSONHook layersMapHandle={layersMapHandle} areas={areas} rendered={rendered} />
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
        <Grid item className={classes.padding} xs={12} sm={9} md={3}>
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
            <FilterSelect setAreas={setAreas} map={map} areas={areas} />
          </Paper>
          <Paper className={classes.guide}>
            Map Guide
            <div style={{
              whiteSpace: 'pre-wrap', textAlign: 'left', paddingLeft: 20, paddingRight: 20, paddingBottom: 20
            }}>
              <p>1. Please log in to view the datas.</p>
              <p>2. Press the +/- keys or scroll up and down the mouse on the map to zoom in and out of the map.</p>
              <p>3. Each color of colored area represents different levels of bed availability for each area. Click the colored area to view the number of occupied beds and click the button to view the data charts.</p>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

/* Contains the filter which filters the area on the map */
function FilterSelect(props: FilterInterface) {
  const classes = useStyles();
  const [filter, setFilter] = React.useState('');
  const [oldAreas, setOldAreas] = React.useState<area[]>([]);
  const { setAreas, areas, map } = props;

  function replaceArea(areas: area[]) {
    if (map !== undefined)
      oldAreas.forEach((area) => {
        area.layers.forEach((layer) => {
          map.addLayer(layer);
        });
        area.active = true;
      });
    setOldAreas([]);
    setAreas(areas);
  }

  function oldAreaInsert(area: area, areas: area[], map: LeafletMap) {
    area.layers.forEach((layer) => {
      map.removeLayer(layer);
    })
    oldAreas.push(area);
    area.active = false;
    setAreas(areas);
  }

  const handleChange = (event: any) => {
    setFilter(event.target.value as string);

    if (map !== undefined && areas !== undefined) {
      replaceArea(areas);
      areas.forEach(area => {
        if (event.target.value === ">50")
          if ((1 - (area.occupancy / area.maxBeds)) < 0.5)
            oldAreaInsert(area, areas, map);

        if (event.target.value === "<50")
          if ((1 - (area.occupancy / area.maxBeds)) > 0.5)
            oldAreaInsert(area, areas, map);

        if (event.target.value === "20-80")
          if ((1 - (area.occupancy / area.maxBeds) < 0.2 ||
            (1 - (area.occupancy / area.maxBeds)) > 0.8))
            oldAreaInsert(area, areas, map);
      });
    }
    setOldAreas(oldAreas);
  }

  return (
    <FormControl variant="filled" className={classes.formControl}>
      <InputLabel className={classes.formText}>Filter</InputLabel>
      <Select
        native
        className={classes.formText}
        value={filter}
        onChange={handleChange}
        inputProps={{
          name: 'Filter',
          id: 'filter',
        }}
      >
        <option value=""></option>
        <option className={classes.formText2} value={"<50"}>{"<50%"}</option>
        <option className={classes.formText2} value={">50"}>{">50%"}</option>
        <option className={classes.formText2} value={"20-80"}>{"20-80%"}</option>
      </Select>
    </FormControl>
  );
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
      area.active = true;

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
          area.polygons[index] = turf.circle(point, 2, { steps: 10, units: 'kilometers' });
        });
      }
    }
  }

  return Object.values(areas);
}


/*
 * Insert polygons created by polygonsCalc(), and handle clicks.
 */
// let polygons: boolean = false; // Have the polygons already been put onto the map?
function MapGeoJSONHook(props: MapInterface) {
  const classes = useStyles();
  let map = useMap();
  let clicks = 0;

  const { layersMapHandle, areas, rendered } = props;

  const history = useHistory();
  function linkInvoke(area: string) {
    // console.log("test");
    // if (!auth) {
    //     window.alert("please login to view data");
    //     return
    // }
    const email = auth.currentUser?.email;
    const emailExp1 = /^\w+([-+.]\w+)*@uqconnect.edu.au$/;
    const emailExp2 = /^\w+([-+.]\w+)*@student.uq.edu.au$/;
    const emailExp3 = /^\w+([-+.]\w+)*@uq.net.edu.au$/;
    const emailExp4 = /^\w+([-+.]\w+)*@qld.gov.au$/;
    const emailExp5 = /^\w+([-+.]\w+)*@www.qld.gov.au$/;
    let valid = null;
    if (email) {
      valid = emailExp1.test(email) || emailExp2.test(email) || emailExp3.test(email) || emailExp4.test(email) || emailExp5.test(email);
    }
    if (valid) {
      // polygons = false;
      // return () => history.push('/detail/' + area)
      return (history.push('/detail/' + area));
    } else {
      window.alert("please login to view data");
    }
  };

  map = useMapEvent('click', (e) => {
    if (areas === undefined)
      return;

    // turf = lon/lat
    // let clickBounds = latLngBounds(e.latlng, e.latlng);
    let areasClicked = {} as Record<string, area>;

    areas.forEach((area, index) => {
      if (area.active === false)
        return;
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
          <Button key={area.name} classes={{ root: classes.button }}
            onClick={() => { linkInvoke(area.name) }}>Go To: {area.name}</Button>
          <Paper className={classes.mapBoxBedNumber}>{area.occupancy} / {area.maxBeds} Beds Occupied</Paper>
        </div>
      );
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

  if (!rendered && areas !== undefined) {
    let i = 0;
    map.eachLayer(() => { i++ });
    if (i > 0) // more than 1 layer
      return null;

    mapQuery().then(function (query: void | firebase.firestore.DocumentData) {
      if (query instanceof Object) {
        areas.forEach((area, index) => {
          area.occupancy = 0;
          area.maxBeds = 0;
          for (const hospitalId in area.hospitals) {
            if (query[area.hospitals[hospitalId]["Facility Name"]])
              area.occupancy += query[area.hospitals[hospitalId]["Facility Name"]];
            area.maxBeds += area.hospitals[hospitalId]["Max Bed Capacity"];
          }

          area.layers = [];
          // create geoJSONs
          area.polygons.forEach((polygon, index) => {
            let color = getColorForPercentage(1 - (area.occupancy / area.maxBeds));

            area.layers.push((geoJSON(polygon, {
              style: {
                "color": color
              }
            }).addTo(map)));
          });
        });
      }
      layersMapHandle(areas, map);
    });
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
  { pct: 1.0, color: { r: 0x42, g: 0xf5, b: 0x45 } }];

var getColorForPercentage = function (pct: any) {
  if (pct < 0.0) // over capacity
    return 'rgb(' + [percentColors[0].color.r, percentColors[0].color.g,
    percentColors[0].color.b].join(',') + ')';
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