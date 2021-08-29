/*
 * feel free to change everything
 * pretty rough currently
 * 
 * DataGrid shows:
 *   - Details of Certain Area Data/Trend
 *   - Data of available beds for certain hospital (click on hospital row)
 */

import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Table from "./Table";
import { Link } from "react-router-dom";
import chart from "./chart.png";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: '#C4C4C4',
      // display: 'flex',
      // marginLeft: '55px',
      // marginRight: '55px',
      // background: 'linear-gradient(45deg, rgba(115,115,115,1) 0%, rgba(143,143,143,1) 35%, rgba(212,212,212,1) 100%)',
    },
    center: {
      margin: 'auto',
      maxWidth: 1000,
    },
    buttons: {
      display: 'flex',
      alignItems: 'flex-end',
      '& > *': {
        margin: theme.spacing(0.25),
      },
    },
    img: {
      display: 'flex',
      maxHeight: '100%',
      minWidth: '50%',
    },
    padding: {
      marginTop: '16px',
      marginBottom: '16px',
    },
  }),
);

enum ThingToShow {
  data,
  trend,
  specific,
}
// type ThingToShowStrings = 'data' | 'trend';

interface ShowInterface {
  thingToShow: ThingToShow;
  clickHandle: (hospitalName: string) => void;
}

function Show(props: ShowInterface) {
  const classes = useStyles();
  const { thingToShow, clickHandle } = props;

  switch(thingToShow) { 
    case ThingToShow.data: { 
      return(
        <Table clickHandle={clickHandle}/>
      );
    } 
    case ThingToShow.trend: { 
      return(
        <Paper className={classes.center}>
          <Box display="flex">
            <img src={chart} className={`${classes.img} ${classes.center}`} alt="scuffed chart1" />
          </Box>
        </Paper>
      );
    }
    case ThingToShow.specific: { 
      return(
        <Paper className={classes.center}>
          <Box display="flex">
            <img src={chart} className={`${classes.img} ${classes.center}`} alt="scuffed chart2" />
          </Box>
        </Paper>
      );
    } 
    default: { 
      throw new Error('invalid ThingToShow');
    } 
  } 
}

// Pass in various data needed.
interface DataGridProps {
  area: string;
}

export default function DataGrid(props: DataGridProps) {
  const classes = useStyles();
  const { area } = props;
  const [show, setShow] = React.useState<ThingToShow>(ThingToShow.data);
  // get this from Table.tsx
  const [hospitalName, setHospitalName] = React.useState<string>(""); 

  const handleClick = (event: React.MouseEvent<unknown>, show: ThingToShow) => {
    setShow(show);
  }

  // Activates on cell click in Table.tsx
  const clickHandle = (hospitalName: string) => {
    setHospitalName(hospitalName);
    setShow(ThingToShow.specific);
  }

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item className={classes.padding} xs={12}>
          <Box className={classes.center}>
            <Grid container>
              <Grid item xs={3} className={classes.buttons} justifyContent='flex-start'>

                {show !== ThingToShow.specific &&
                <Button variant="contained"
                component={Link} to="/"
                >
                  Go Back to Map
                </Button>
                }

                {show === ThingToShow.specific &&
                <Button variant="contained"
                onClick={(event) => handleClick(event, ThingToShow.data)}
                >
                  Go Back to Data
                </Button>
                }

              </Grid> 
              <Grid item xs={6} direction="column">
                <Paper>
                  <Typography variant="h4">
                    {area}
                  </Typography>
                  <Typography variant="subtitle1">

                    {show === ThingToShow.data && 'Hospital Stats'}
                    {show === ThingToShow.trend && 'Available Beds'}
                    {show === ThingToShow.specific && <Typography variant="h6">{hospitalName}</Typography>}

                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={3} className={classes.buttons} justifyContent='flex-end'>

                {show !== ThingToShow.specific &&
                <>
                <Button variant="contained"
                  onClick={(event) => handleClick(event, ThingToShow.data)}
                  disabled={show === ThingToShow.data && true}
                >
                    Data
                </Button>
                <Button variant="contained"
                  onClick={(event) => handleClick(event, ThingToShow.trend)}
                  disabled={show === ThingToShow.trend && true}
                >
                    Trend
                </Button>
                </>
                }

              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item className={classes.padding} xs={12}>
          <Box>
            <Show thingToShow={show} clickHandle={clickHandle}/>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}