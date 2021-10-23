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
//import { AreaChart, Area, ReferenceLine, Brush, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// "Area" Chart
export function AreaBedChart() {
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
  x : number,
  name : string,
  patients ?: number
  predicted ?: number
}
// example data

var data : DataPoint[] = [
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

const linearRegression = regression.polynomial(twoDim, {order : 3});

const [,dataPrediction1] = linearRegression.predict(12);
const [,dataPrediction2] = linearRegression.predict(13);
const [,dataPrediction3] = linearRegression.predict(14);

data = data.concat(
  {
    x: 13,
    name:  '13/09/2021', 
    predicted: dataPrediction1
  },
  {
    x: 14,
    name:  '14/09/2021', 
    predicted: dataPrediction2
  },
  {
    x: 15,
    name:  '15/09/2021', 
    predicted: dataPrediction3
  }
);

// "Hospital" Chart
export function HospitalBedChart() {
  return(
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
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" name="Beds" dataKey="bedsAvailable" stroke="#ff9800" activeDot={{ r: 6 }}
          strokeWidth="2"
          dot={{ r: 4 }}
        />
        <Line type="monotone" name="Beds (Predicted)" dataKey="bedsAvailablePredicted" stroke="#42a5f5" activeDot={{ r: 6 }}
          strokeWidth="2"
          dot={{ r: 4 }}
        />
        <ReferenceLine x='12/09/2021' stroke="#42a5f5" label={{ value: "Today", fill: "#ffffff" }} />
        <ReferenceLine y='7000' stroke="#ff1900" label={{ value: "Max Beds", fill: "#ffffff" }} />
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

type HospitalDataPoint = {
  x : number,
  name : string,
  bedsAvailable ?: number
  bedsAvailablePredicted ?: number
}
// example data

var hospitalBedData : HospitalDataPoint[] = [
  {
    x: 1,
    name: '1/09/2021',
    bedsAvailable: 1000,
  },
  {
    x: 2,
    name: '2/09/2021',
    bedsAvailable: 2000,
  },
  {
    x: 3,
    name: '3/09/2021',
    bedsAvailable: 2750,
  },
  {
    x: 4,
    name: '4/09/2021',
    bedsAvailable: 4000,
  },
  {
    x: 5,
    name: '5/09/2021',
    bedsAvailable: 3000,
  },
  {
    x: 6,
    name: '6/09/2021',
    bedsAvailable: 1550,
  },
  {
    x: 7,
    name: '7/09/2021',
    bedsAvailable: 1200,
  },
  {
    x: 8,
    name: '8/09/2021',
    bedsAvailable: 900,
  },
  {
    x: 9,
    name: '9/09/2021',
    bedsAvailable: 1000,
  },
  {
    x: 10,
    name: '10/09/2021',
    bedsAvailable: 1150,
  },
  {
    x: 11,
    name: '11/09/2021',
    bedsAvailable: 1400,
  },
  {
    x: 12,
    name: '12/09/2021',
    bedsAvailable: 8000,
  },
];

hospitalBedData = hospitalBedData.concat(
  {
    x: 13,
    name:  '13/09/2021', 
    bedsAvailablePredicted: 7500,
  },
  {
    x: 14,
    name:  '14/09/2021', 
    bedsAvailablePredicted: 6200,
  },
  {
    x: 15,
    name:  '15/09/2021', 
    bedsAvailablePredicted: 7000,
  }
);