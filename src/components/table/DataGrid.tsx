/*
 * DataGrid shows:
 *   - Details of Certain Area Data/Trend.
 *   - Data of available beds for certain hospital (click on hospital row).
 *   - Uses material-ui, recharts.
 */

import React from "react";
import { Link, useParams } from "react-router-dom";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import MapIcon from '@material-ui/icons/Map';
import BarChartIcon from '@material-ui/icons/BarChart';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import { AreaBedChart, HospitalBedChart } from "./Chart";
import Table from "./Table";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    center: {
      margin: "auto",
      maxWidth: 1000,
      background: "#1E1D2B",
    },
    titleContainer: {
      alignItems: "center",
    },
    buttonContainer: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      "& > *": {
        margin: theme.spacing(0.25),
      },
    },
    button: {
      backgroundColor: "#2B2C3E",
      [theme.breakpoints.down('xs')]: {
        maxWidth: "40px",
        minWidth: "40px",
      },
    },
    img: {
      display: "flex",
      maxHeight: "100%",
      minWidth: "50%",
    },
    padding: {
      marginTop: "16px",
      marginBottom: "16px",
    },
    icon: {
      fontSize: 30,
      [theme.breakpoints.down('xs')]: {
        fontSize: 25,
      },
      color: "#FFFFFF",
    },
    chartContainer: {
      minWidth: 1000,
      minHeight: 600,
    },
    paper: {
      background: "#2B2C3E",
      color: "#FFFFFF",
    }
  })
);

enum ThingToShow {
  data,
  trend,
  specific,
}
// type ThingToShowStrings = 'data' | 'trend';

interface ShowInterface {
  thingToShow: ThingToShow;
  clickHandle: (hospitalName: string) => void,
  area: string,
  hosName: string
}

/* Decides what to show based on current state of DataGrid */
function Show(props: ShowInterface) {
  const classes = useStyles();
  const { thingToShow, clickHandle } = props;

  switch (thingToShow) {
    case ThingToShow.data: {
      return <Table clickHandle={clickHandle} area={props.area} />;
    }
    case ThingToShow.trend: {
      return (
        <Box className={classes.center} display="flex">
          <AreaBedChart />
        </Box>
      );
    }
    case ThingToShow.specific: {
      // TODO: try call graphQuery here
      return (
        <Box className={classes.center} display="flex">
          <HospitalBedChart hospitalName={props.hosName}/>
        </Box>
      );
    }
    default: {
      throw new Error("invalid ThingToShow");
    }
  }
}

export default function DataGrid() {
  const classes = useStyles();
  const { area } = useParams(); // PATH: /detail/:area
  const [show, setShow] = React.useState<ThingToShow>(ThingToShow.data);
  // get this from Table.tsx
  const [hospitalName, setHospitalName] = React.useState<string>("");

  const handleClick = (event: React.MouseEvent<unknown>, show: ThingToShow) => {
    setShow(show);
  };

  // Activates on cell click in Table.tsx
  const clickHandle = (hospitalName: string) => {
    setHospitalName(hospitalName);
    setShow(ThingToShow.specific);
  };

  return (
    <div>
      <Grid container>
        <Grid item className={classes.padding} xs={12}>
          <Box className={classes.center}>
            <Grid container>
              <Grid
                item
                xs={2}
                sm={3}
                className={classes.buttonContainer}
              >
                {show !== ThingToShow.specific && (
                  <Button classes={{root: classes.button}} variant="contained" component={Link} to="/">
                    <MapIcon classes={{root: classes.icon}} />
                  </Button>
                )}

                {show === ThingToShow.specific && (
                  <Button
                    classes={{root: classes.button}}
                    variant="contained"
                    onClick={(event) => handleClick(event, ThingToShow.data)}
                  >
                    <BarChartIcon classes={{root: classes.icon}} />
                  </Button>
                )}
              </Grid>
              <Grid item className={classes.titleContainer} xs={6} sm={6}>
                <Paper className={classes.paper}>
                  <Typography variant="h4">{area}</Typography>
                  <Typography variant="subtitle1">
                    {show === ThingToShow.data && "Hospital Stats"}
                    {show === ThingToShow.trend && "Patients in Need of Beds"}
                    {show === ThingToShow.specific && hospitalName + " Available Beds"}
                  </Typography>
                </Paper>
              </Grid>
              <Grid
                item
                xs={4}
                sm={3}
                className={classes.buttonContainer}
              >
                {show !== ThingToShow.specific && (
                  <React.Fragment>
                    <Button
                      classes={{root: classes.button}}
                      variant="contained"
                      onClick={(event) => handleClick(event, ThingToShow.data)}
                      disabled={show === ThingToShow.data && true}
                    >
                      <BarChartIcon classes={{root: classes.icon}} />
                    </Button>
                    <Button
                      classes={{root: classes.button}}
                      variant="contained"
                      onClick={(event) => handleClick(event, ThingToShow.trend)}
                      disabled={show === ThingToShow.trend && true}
                    >
                      <TrendingUpIcon classes={{root: classes.icon}} />
                    </Button>
                  </React.Fragment>
                )}
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item className={classes.padding} xs={12}>
          <Box>
            <Show thingToShow={show} clickHandle={clickHandle} area={area} hosName={hospitalName} />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}