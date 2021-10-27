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
import { graphQuery, mapQuery } from "../../assets/databaseMap";
import firebase from "../../firebase";
import moment from 'moment';
import { useEffect, useState } from 'react';
import { checkAuth } from '../../firebase';
import { useHistory } from "react-router-dom";
import { data as hospitalData } from "../../assets/hospitals";
//import { AreaChart, Area, ReferenceLine, Brush, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// TODO: use real data for area chart as well
// "Area" Chart
export function AreaBedChart() {
  const history = useHistory();
  if (!checkAuth()) {
    window.alert("please login to view data");
    history.push("/");
  } 
  return(
    <ResponsiveContainer width="100%" height="100%" minHeight="400px">
      <AreaChart
        data={data}
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
        <YAxis />
        <Tooltip />
        <Legend />
        <Area type="monotone" name="Patients" dataKey="patients" stroke="#ff9800" activeDot={{ r: 6 }}
          strokeWidth="2"
          fillOpacity="1"
          fill="url(#OrangeGradient)"
          dot={{ r: 4 }}
        />
        <Area type="monotone" name="Patients (Predicted)" dataKey="predicted" stroke="#42a5f5" activeDot={{ r: 6 }}
          strokeWidth="2"
          fillOpacity="1"
          fill="url(#BlueGradient)"
          dot={{ r: 4 }}
        />
        <ReferenceLine x='12/09/2021' stroke="#42a5f5" label={{ value: "Today", fill: "#ffffff" }} />
        <ReferenceLine y='8500' stroke="#ff1900" label={{ value: "Max Beds", fill: "#ffffff" }} />
        <Brush dataKey="name" height={50} stroke="#8884d8" >
          <AreaChart>
            <CartesianGrid fill="#1E1D2B" />
            <YAxis hide domain={['auto', 'auto']} />
            <Area type="monotone" dataKey="patients" stroke="#ff9800" fill="#ff9800" dot={false} />
            <Area type="monotone" dataKey="predicted" stroke="#42a5f5" fill="#42a5f5" dot={false} />
          </AreaChart>
        </Brush>
      </AreaChart>
    </ResponsiveContainer>
  );
}

type DataPoint = {
  x: number,
  name: string,
  patients?: number
  predicted?: number
}
// example data

// TODO: call mapQuery() (import from databaseMap.tsx), for real data

var data: DataPoint[] = [
  {
    x: 1,
    name: '1/09/2021',
    patients: 4100,
  },
  {
    x: 2,
    name: '2/09/2021',
    patients: 3200,
  },
  {
    x: 3,
    name: '3/09/2021',
    patients: 1900,
  },
  {
    x: 4,
    name: '4/09/2021',
    patients: 2800,
  },
  {
    x: 5,
    name: '5/09/2021',
    patients: 1903,
  },
  {
    x: 6,
    name: '6/09/2021',
    patients: 2306,
  },
  {
    x: 7,
    name: '7/09/2021',
    patients: 3500,
  },
  {
    x: 8,
    name: '8/09/2021',
    patients: 4000,
  },
  {
    x: 9,
    name: '9/09/2021',
    patients: 5444,
  },
  {
    x: 10,
    name: '10/09/2021',
    patients: 6000,
  },
  {
    x: 11,
    name: '11/09/2021',
    patients: 7444,
  },
  {
    x: 12,
    name: '12/09/2021',
    patients: 8000,
    predicted: 8000,
  },
];

let twoDim =
  data.map(
    (date) => [date.x, date.patients]
  );

console.log(twoDim);

const linearRegression = regression.polynomial(twoDim, { order: 3 });

const [, dataPrediction1] = linearRegression.predict(12);
const [, dataPrediction2] = linearRegression.predict(13);
const [, dataPrediction3] = linearRegression.predict(14);

data = data.concat(
  {
    x: 13,
    name: '13/09/2021',
    predicted: dataPrediction1
  },
  {
    x: 14,
    name: '14/09/2021',
    predicted: dataPrediction2
  },
  {
    x: 15,
    name: '15/09/2021',
    predicted: dataPrediction3
  }
);

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
  const [hospitalBedData, setHosBedData] = useState<HospitalDataPoint[]>([]);
  useEffect(() => {
    graphQuery().then((query: firebase.firestore.DocumentData) => {
      // TODO: get at current date
      // console.log("starting query, getting hospitals");
      const result = query.map((doc: firebase.firestore.DocumentData, index: number) => {
        console.log("hospital: " + props.hospitalName + ", Occupancy for " + doc.id + ": " + doc.get(props.hospitalName));
        var newData: HospitalDataPoint = createData(index, doc.id, doc.get(props.hospitalName));
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
      setHosBedData(finalResult); // Set to last 10 days
    })
      .catch((error) => {
        console.log("Error getting documents chart: ", error);
      });
  }, [])

  // Make regression model predictions
  if (hospitalBedData.length === 0) {
    return <></>
  }

  let twoDim =
    hospitalBedData.map(
      (date) => [date.x, date.bedsAvailable]
    );
  const linearRegression = regression.polynomial(twoDim, { order: 3 });

  console.log("top 10 moments before disaster: " + hospitalBedData);
  console.log(hospitalBedData);

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

  var xVal = hospitalBedData.slice(-1)[0].x;
  var date = hospitalBedData.slice(-1)[0].name;
  const [, pred1] = linearRegression.predict(xVal + 1);
  const [, pred2] = linearRegression.predict(xVal + 2);
  const [, pred3] = linearRegression.predict(xVal + 3);

  var predictedData: HospitalDataPoint[] = [];

  // Push first value from previous to fill gap
  predictedData.push(
    hospitalBedData.slice(-1)[0]
  );

  // Push predictions
  predictedData.push(
    {
      x: xVal + 1,
      name: addDays(date, 1),
      // name: moment(date).,
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
    var totalData = hospitalBedData.concat(predictedData);
    console.log(totalData);

    function formatXAxis(x: number) {
      var date = totalData[x].name;
      return date//moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD')
    }
  // TODO: fix YAxis range going below 0

  // Get max bed capacity
  var maxBedCapacity : number = 0;
  hospitalData.forEach((hospital) => {
    if (hospital["Facility Name"] == props.hospitalName) {
      maxBedCapacity = hospital["Max Bed Capacity"];
    }
  });

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight="400px">
      <LineChart
        data={hospitalBedData}
        margin={{
          top: 5,
          right: 45,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="x"
          type="number"
          tickFormatter={formatXAxis}
        // domain={[hospitalBedData[0].x, predictedData.slice(-1)[0].x]}
        // ticks={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
        />
        <YAxis domain={[-20, 'auto']}/>
        <Tooltip />
        <Legend />
        <Line type="monotone" data={hospitalBedData} name="Beds" dataKey="bedsAvailable" stroke="#ff6200" activeDot={{ r: 6 }}
          strokeWidth="2"
          dot={{ r: 4 }}
        />
        <Line type="monotone" data={predictedData} name="Beds (Predicted)" dataKey="bedsAvailable" stroke="#424ef5" activeDot={{ r: 6 }}
          strokeWidth="2"
          dot={{ r: 4 }}
        />
        {/* TODO: fix referenceline below, Max Beds, get from firebase etc. */}
        <ReferenceLine x={hospitalBedData.slice(-1)[0].x} stroke="#42a5f5" label={{ value: "Today", fill: "#ffffff" }} />
        <ReferenceLine y={maxBedCapacity} stroke="#ff1900" label={{ value: "Max Beds", fill: "#ffffff" }} />
        <Brush dataKey="name" height={50} stroke="#8884d8" >
          <LineChart>
            <CartesianGrid fill="#1E1D2B" />
            <YAxis hide domain={['auto', 'auto']} />
            <Line type="monotone" dataKey="bedsAvailable" stroke="#ff9800" dot={false} />
            <Line type="monotone" dataKey="bedsAvailablePredicted" stroke="#42a5f5" dot={false} />
          </LineChart>
        </Brush>
      </LineChart>

    </ResponsiveContainer>
  );
}

// example data

// var hospitalBedData : HospitalDataPoint[] = 
// [
//   {
//     x: 1,
//     name: '1/09/2021',
//     bedsAvailableMild: 4100,
//     bedsAvailableSevere: 1000,
//   },
//   {
//     x: 2,
//     name: '2/09/2021',
//     bedsAvailableMild: 3200,
//     bedsAvailableSevere: 2000,
//   },
//   {
//     x: 3,
//     name: '3/09/2021',
//     bedsAvailableMild: 1900,
//     bedsAvailableSevere: 2750,
//   },
//   {
//     x: 4,
//     name: '4/09/2021',
//     bedsAvailableMild: 2800,
//     bedsAvailableSevere: 4000,
//   },
//   {
//     x: 5,
//     name: '5/09/2021',
//     bedsAvailableMild: 1903,
//     bedsAvailableSevere: 3000,
//   },
//   {
//     x: 6,
//     name: '6/09/2021',
//     bedsAvailableMild: 2306,
//     bedsAvailableSevere: 1550,
//   },
//   {
//     x: 7,
//     name: '7/09/2021',
//     bedsAvailableMild: 3500,
//     bedsAvailableSevere: 1200,
//   },
//   {
//     x: 8,
//     name: '8/09/2021',
//     bedsAvailableMild: 4000,
//     bedsAvailableSevere: 900,
//   },
//   {
//     x: 9,
//     name: '9/09/2021',
//     bedsAvailableMild: 5444,
//     bedsAvailableSevere: 1000,
//   },
//   {
//     x: 10,
//     name: '10/09/2021',
//     bedsAvailableMild: 6000,
//     bedsAvailableSevere: 1150,
//   },
//   {
//     x: 11,
//     name: '11/09/2021',
//     bedsAvailableMild: 7444,
//     bedsAvailableSevere: 1400,
//   },
//   {
//     x: 12,
//     name: '12/09/2021',
//     bedsAvailableMild: 8000,
//     bedsAvailableMildPredicted: 8000,
//     bedsAvailableSevere: 1600,
//     bedsAvailableSeverePredicted: 1600,
//   },
// ];

// hospitalBedData = hospitalBedData.concat(
//   {
//     x: 13,
//     name:  '13/09/2021', 
//     bedsAvailableMildPredicted: 7500,
//     bedsAvailableSeverePredicted: 1800,
//   },
//   {
//     x: 14,
//     name:  '14/09/2021', 
//     bedsAvailableMildPredicted: 6200,
//     bedsAvailableSeverePredicted: 1450,
//   },
//   {
//     x: 15,
//     name:  '15/09/2021', 
//     bedsAvailableMildPredicted: 7000,
//     bedsAvailableSeverePredicted: 1550,
//   }
// );