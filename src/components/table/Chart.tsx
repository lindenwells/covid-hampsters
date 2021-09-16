/*
 * The below charts are built with the Recharts library.
 * 
 * REFERENCE:
 * Recharts Group. "API." Recharts. 
 * https://recharts.org/en-US/api (accessed Wed. 8, 2021).
 *
 */

import { AreaChart, Area, ReferenceLine, Brush, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import regression from 'regression';
//import { AreaChart, Area, ReferenceLine, Brush, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function BedsRequiredChart() {
  return(
    <ResponsiveContainer width="100%" height="100%" minHeight="400px">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 45,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="patients" stroke="#ff9800" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="predicted" stroke="#42a5f5" />
        <ReferenceLine x="12/09/2021" stroke="#42a5f5" label="Today" />
        <Brush dataKey="name" height={40} stroke="#8884d8"/>
        <Line type="monotone" name="Patients" dataKey="patients" stroke="#ff9800" activeDot={{ r: 6 }} />
        <Line type="monotone" name="Patients (Predicted)" dataKey="patientsPredicted" stroke="#42a5f5" activeDot={{ r: 6 }} />
        <ReferenceLine x="8/09/2021" stroke="#42a5f5" label="Today" />
        <Brush dataKey="date" height={50} stroke="#8884d8">
          <AreaChart>
            <CartesianGrid />
            <YAxis hide domain={['auto', 'auto']} />
            <Area type="monotone" dataKey="patients" stroke="#ff9800" fill="#ff9800" dot={false} />
            <Area type="monotone" dataKey="patientsPredicted" stroke="#42a5f5" fill="#42a5f5" dot={false} />
          </AreaChart>
        </Brush>
      </LineChart>
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