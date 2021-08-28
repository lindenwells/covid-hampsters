/*
 * feel free to change everything
 * 
 * react-router for the different views?
 */

import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Table from "./Table";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      background: '#C4C4C4',
      height: '100%',
      // marginLeft: '55px',
      // marginRight: '55px',
      // background: 'linear-gradient(45deg, rgba(115,115,115,1) 0%, rgba(143,143,143,1) 35%, rgba(212,212,212,1) 100%)',
    },
    center: {
      height: '100%',
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
    title: {
      flex: '1 1 100%',
    },
  }),
);

export default function CenteredGrid() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Box mx={8}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box className={classes.center}>
              <Grid container>
                <Grid item xs={3} className={classes.buttons} justifyContent='flex-start'>
                  <Button variant="contained">Go Back to Map</Button>
                </Grid> 
                <Grid item xs={6} direction="column">
                  <Typography variant="h4" className={classes.title}>
                    Brisbane
                  </Typography>
                  <Typography variant="subtitle1">
                    Hospital Stats
                  </Typography>
                </Grid>
                <Grid item xs={3} className={classes.buttons} justifyContent='flex-end'>
                  <Button variant="contained" disabled>Data</Button>
                  <Button variant="contained">Trend</Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box>
              <Table/>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}