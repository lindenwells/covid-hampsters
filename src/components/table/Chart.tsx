/*
 * The below charts are built with the Recharts library.
 * 
 * REFERENCE:
 * Recharts Group. "API." Recharts. 
 * https://recharts.org/en-US/api (accessed Wed. 8, 2021).
 *
 */

import { ReferenceLine, Brush, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Patients" stroke="#ff9800" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="Patients (Predicted)" stroke="#42a5f5" />
        <ReferenceLine x="8/09/2021" stroke="#42a5f5" label="Today" />
        <Brush dataKey="name" height={40} stroke="#8884d8"/>
      </LineChart>
    </ResponsiveContainer>
  );
}

// example data
const data = [
  {
    name: '1/09/2021',
    Patients: 4100,
  },
  {
    name: '2/09/2021',
    Patients: 3200,
  },
  {
    name: '3/09/2021',
    Patients: 1900,
  },
  {
    name: '4/09/2021',
    Patients: 2800,
  },
  {
    name: '5/09/2021',
    Patients: 1903,
  },
  {
    name: '6/09/2021',
    Patients: 2306,
  },
  {
    name: '7/09/2021',
    Patients: 3500,
  },
  {
    name: '8/09/2021',
    Patients: 4000,
    "Patients (Predicted)": 4000,
  },
  {
    name: '9/09/2021',
    "Patients (Predicted)": 5444,
  },
  {
    name: '10/09/2021',
    "Patients (Predicted)": 6000,
  },
  {
    name: '11/09/2021',
    "Patients (Predicted)": 7444,
  },
  {
    name: '12/09/2021',
    "Patients (Predicted)": 7000,
  },
];