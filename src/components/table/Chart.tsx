/*
 * This file contains the charts within our app.
 * The below charts are built with the Recharts library.
 * 
 * REFERENCE:
 * Recharts Group. "API." Recharts. 
 * https://recharts.org/en-US/api (accessed Sep. 12, 2021).
 */

import { AreaChart, Area, ReferenceLine, Brush, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import regression from 'regression';
import { graphQuery } from "../../assets/databaseMap";
import firebase from "../../firebase";
import moment from 'moment';
import { useEffect, useState } from 'react';
import { checkAuth } from '../../firebase';
import { useHistory } from "react-router-dom";
import { data as hospitalData } from "../../assets/hospitals";
interface areaChartHelper {
  area: string
}

// "Area" Chart
export function AreaBedChart(props: areaChartHelper) {
  const [hospitalAreaBedData, setHosAreaBedData] = useState<HospitalDataPoint[]>([]);
  var maxBeds: number = 0;
  var hospitals: string[] = [];

  const history = useHistory();
  if (!checkAuth()) {
    window.alert("please login to view data");
    history.push("/");
  }

  hospitalData.forEach((hospital) => {
    if (hospital["Hospital and Health Service"] === props.area) {
      maxBeds += hospital["Max Bed Capacity"];
      hospitals.push(hospital["Facility Name"]);
    }
  });
  console.log("max beds " + props.area + ": " + maxBeds);
  console.log("hospitals: " + hospitals);

  //use effect start
  useEffect(() => {
    graphQuery().then((query: firebase.firestore.DocumentData) => {
      // TODO: get at current date (currently gets last 10 days from data)
      const result = query.slice(-10).map((doc: firebase.firestore.DocumentData, index: number) => {
        var totalBeds = 0;
        hospitals.forEach((hos) => {
          totalBeds += doc.get(hos);
        }
        );
        var newData: HospitalDataPoint = createData(index, doc.id, totalBeds);
        return newData
      });
      var finalResult = result;
      for (let i=0; i < finalResult.length; i++) {
        var newElem = finalResult[i];
        newElem.x = i;
        finalResult[i] = newElem;
      }
      setHosAreaBedData(finalResult); // Set to last 10 days
    })
    .catch((error) => {
      console.log("Error getting documents chart: ", error);
    });
  })//[props.hospitalName])
  //use effect end

  if (hospitalAreaBedData.length === 0) {
    return <></>
  }

  let twoDim =
    hospitalAreaBedData.map(
      (date) => [date.x, date.bedsAvailable]
    );

  const linearRegression = regression.polynomial(twoDim, { order: 3 });

  function addDays(tickItem: string, days: number) {
    return moment(tickItem, 'YYYY-MM-DD').add(days, 'day').format('YYYY-MM-DD')
  }

  var xVal = hospitalAreaBedData.slice(-1)[0].x;
  var date = hospitalAreaBedData.slice(-1)[0].name;
  var [, pred1] = linearRegression.predict(xVal + 1);
  var [, pred2] = linearRegression.predict(xVal + 2);
  var [, pred3] = linearRegression.predict(xVal + 3);

  if (pred1 < 0) {
    pred1 = 0;
  }

  if (pred2 < 0) {
    pred2 = 0;
  }

  if (pred3 < 0) {
    pred3 = 0;
  }

  var predictedAreaData: HospitalDataPoint[] = [];

  // Push first value from previous to fill gap
  predictedAreaData.push(
    hospitalAreaBedData.slice(-1)[0]
  );

  // Push predictions
  predictedAreaData.push(
    {
      x: xVal + 1,
      name: addDays(date, 1),
      bedsAvailable: pred1
    },
    {
      x: xVal + 2,
      name: addDays(date, 2),
      bedsAvailable: pred2
    },
    {
      x: xVal + 3,
      name: addDays(date, 3),
      bedsAvailable: pred3
    }
  );

  console.log("total data: ");
  var totalData = hospitalAreaBedData.concat(predictedAreaData);
  console.log(totalData);

  // function formatXAxis(x: number) {
  //   var date = totalData[x].name;
  //   return date
  // }

  var totalAreaData = hospitalAreaBedData.concat(predictedAreaData);

  // let twoDimData =
  //   hospitalAreaBedData.map(
  //     (date) => [date.x, date.bedsAvailable]
  //   );

  // var data1: string[] = [];
  // hospitalAreaBedData.forEach((d) => {
  //   data1.push(d.name);
  // });
  // var data2: number[] = [];
  // hospitalAreaBedData.forEach((d) => {
  //   data2.push(d.x);
  // });

  return(
    <ResponsiveContainer width="100%" height="100%" minHeight="400px">
      <AreaChart
        data={totalAreaData}
        margin={{
          top: 5,
          right: 45,
          left: 0,
          bottom: 5,
        }}
      >
        <defs>
          <linearGradient id="OrangeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="rgba(255, 152, 0, 0.8)" />
            <stop offset="95%" stopColor="rgba(255, 152, 0, 0)" />
          </linearGradient>
          <linearGradient id="BlueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="rgba(66, 165, 245, 0.8)" />
            <stop offset="95%" stopColor="rgba(66, 165, 245, 0)" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0,maxBeds]}/>
        <Tooltip />
        <Legend height={5}/>
        <Area type="monotone" name="Patients" dataKey="bedsAvailable" stroke="#ff9800" activeDot={{ r: 6 }}
          strokeWidth="2"
          fillOpacity="1"
          fill="url(#OrangeGradient)"
          dot={{ r: 4 }}
        />
        {/* <Area type="monotone" name="Patients (Predicted)" dataKey="bedsAvailable" stroke="#42a5f5" activeDot={{ r: 6 }}
          strokeWidth="2"
          fillOpacity="1"
          fill="url(#BlueGradient)"
          dot={{ r: 4 }}
        /> */}
        <ReferenceLine x={hospitalAreaBedData.slice(-1)[0].x} stroke="#42a5f5" label={{ value: "Today", fill: "#ffffff" }} />
        <ReferenceLine y={maxBeds} stroke="#ff1900" label={{ value: "Max Beds", fill: "#ffffff" }} />
        <Brush dataKey="name" height={50} stroke="#8884d8" >
          <AreaChart>
            <CartesianGrid fill="#1E1D2B" />
            <YAxis hide domain={['auto', 'auto']} />
            {/* <Area type="monotone" dataKey="bedsAvailable" stroke="#ff9800" fill="#ff9800" dot={false} /> */}
            <Area type="monotone" dataKey="bedsAvailable" stroke="#42a5f5" fill="#42a5f5" dot={false} />
          </AreaChart>
        </Brush>
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface chartHelper {
  hospitalName: string
}

type HospitalDataPoint = {
  x: number,
  name: string,
  bedsAvailable: number
}

function createData(
  x: number,
  name: string,
  bedsAvailable: number
): HospitalDataPoint {
  return { x, name, bedsAvailable };
}

// "Hospital" Chart
export function HospitalBedChart(props: chartHelper): JSX.Element {
  const [bedData, setBedData] = useState<Array<any>>([]);
  useEffect(() => {
    graphQuery().then((query: firebase.firestore.DocumentData) => {
      // TODO: get at current date
      // console.log("starting query, getting hospitals");
      const result = query.map((doc: firebase.firestore.DocumentData, index: number) => {
        console.log("hospital: " + props.hospitalName + ", Occupancy for " + doc.id + ": " + doc.get(props.hospitalName));
        var newData: object = {x:index, name:doc.id, bedsAvailable:doc.get(props.hospitalName)};
        return newData
      });
      // console.log("inside query data: " + result);
      var finalResult = result.slice(-10);
      for (let i=0; i < finalResult.length; i++) {
        var newElem = finalResult[i];
        newElem.x = i;
        finalResult[i] = newElem;
      }
      console.log("fin res: " + finalResult);
      console.log(finalResult);
      setBedData(finalResult); // Set to last 10 days
    })
      .catch((error) => {
        console.log("Error getting documents chart: ", error);
      });
  }, [props.hospitalName])

  // Make regression model predictions
  if (bedData.length === 0) {
    return <></>
  }

  let twoDim =
    bedData.map(
      (date) => [date.x, date.bedsAvailable]
    );
  const linearRegression = regression.polynomial(twoDim, { order: 3 });

  console.log("top 10 moments before disaster: " + bedData);
  console.log(bedData);

  function addDays(tickItem: string, days: number) {
    return moment(tickItem, 'YYYY-MM-DD').add(days, 'day').format('YYYY-MM-DD')
  }

  // console.log("TIME TESTING START: ");
  // function formatXAxisToEpoch(date: string) {
  //   return moment(date, 'YYYY-MM-DD').valueOf()
  // }
  // function formatXAxisFromEpoch(epoch: number) {
  //   return moment(epoch, 'YYYY-MM-DD').format('YYYY-MM-DD')
  // }
  // var testDate = "2020-03-28";
  // console.log("test date: " + testDate);
  // var epoch = formatXAxisToEpoch(testDate);
  // console.log(epoch);
  // console.log(formatXAxisFromEpoch(epoch));
  // console.log("TIME TESTING END: ");

  var xVal = bedData.slice(-1)[0].x;
  var date = bedData.slice(-1)[0].name;
  var [, pred1] = linearRegression.predict(xVal + 1);
  var [, pred2] = linearRegression.predict(xVal + 2);
  var [, pred3] = linearRegression.predict(xVal + 3);

  if (pred1 < 0) {
    pred1 = 0;
  }

  if (pred2 < 0) {
    pred2 = 0;
  }

  if (pred3 < 0) {
    pred3 = 0;
  }

  var predictedData: Array<any> = [];

  // Push first value from previous to fill gap
  bedData[bedData.length - 1] = 
    {
      x: xVal,
      name: bedData.slice(-1)[0].name,
      // name: moment(date).,
      bedsAvailable: bedData.slice(-1)[0].bedsAvailable,
      bedsAvailablePrediction: bedData.slice(-1)[0].bedsAvailable,
    };

  // Push predictions
  predictedData.push(
    {
      x: xVal + 1,
      name: addDays(date, 1),
      // name: moment(date).,
      bedsAvailablePrediction: pred1
    },
    {
      x: xVal + 2,
      name: addDays(date, 2),
      bedsAvailablePrediction: pred2
    },
    {
      x: xVal + 3,
      name: addDays(date, 3),
      bedsAvailablePrediction: pred3
    }
  );

    console.log("total data: ");
    var totalData = bedData.concat(predictedData);
    console.log(JSON.stringify(totalData));

  function formatXAxis(x: number) {
    var date = totalData[x].name;
    return date
  }

  // Get max bed capacity
  var maxBedCapacity : number = 0;
  hospitalData.forEach((hospital) => {
    if (hospital["Facility Name"] === props.hospitalName) {
      maxBedCapacity = hospital["Max Bed Capacity"];
    }
  });

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight="400px">
      <LineChart
        data={totalData}
        margin={{
          top: 5,
          right: 45,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
        // domain={[hospitalBedData[0].x, predictedData.slice(-1)[0].x]}
        // ticks={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
        />
        <YAxis domain={[0, 'auto']}/>
        <Tooltip />
        <Legend />
        <Line type="monotone" name="Beds" dataKey="bedsAvailable" stroke="#ff6200" activeDot={{ r: 6 }}
          strokeWidth="2"
          dot={{ r: 4 }}
        />
        <Line type="monotone" name="Beds (Predicted)" dataKey="bedsAvailablePrediction" stroke="#424ef5" activeDot={{ r: 6 }}
          strokeWidth="2"
          dot={{ r: 4 }}
        />
        <ReferenceLine x={bedData[bedData.length - 1].name} stroke="#42a5f5" label={{ value: "Today", fill: "#ffffff" }} />
        <ReferenceLine y={maxBedCapacity} stroke="#ff1900" label={{ value: "Max Beds", fill: "#ffffff" }} />
        {/* TODO: Fix mini graph */}
        <Brush data={hospitalBedData} dataKey="x" type="number" tickFormatter={formatXAxis} height={50} stroke="#8884d8" >
          <LineChart>
            <CartesianGrid fill="#1E1D2B" />
            <YAxis hide domain={['auto', 'auto']} />
            <Line type="monotone" dataKey="bedsAvailable" stroke="#ff9800" dot={false} />
            <Line type="monotone" dataKey="bedsAvailablePrediction" stroke="#42a5f5" dot={false} />
          </LineChart>
        </Brush>
        <Legend height={5}/>
      </LineChart>
    </ResponsiveContainer>
  );
}
