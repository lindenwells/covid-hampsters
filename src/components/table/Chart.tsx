/*
 * The below charts are built with the Recharts library.
 * 
 * REFERENCE:
 * Recharts Group. "API." Recharts. 
 * https://recharts.org/en-US/api (accessed Wed. 8, 2021).
 */

import { AreaChart, Area, ReferenceLine, Brush, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

// example data
const data = [
  {
    date: '1/09/2021',
    patients: 4100,
  },
  {
    date: '2/09/2021',
    patients: 3200,
  },
  {
    date: '3/09/2021',
    patients: 1900,
  },
  {
    date: '4/09/2021',
    patients: 2800,
  },
  {
    date: '5/09/2021',
    patients: 1903,
  },
  {
    date: '6/09/2021',
    patients: 2306,
  },
  {
    date: '7/09/2021',
    patients: 3500,
  },
  {
    date: '8/09/2021',
    patients: 4000,
    patientsPredicted: 4000,
  },
  {
    date: '9/09/2021',
    patientsPredicted: 5444,
  },
  {
    date: '10/09/2021',
    patientsPredicted: 6000,
  },
  {
    date: '11/09/2021',
    patientsPredicted: 7444,
  },
  {
    date: '12/09/2021',
    patientsPredicted: 7000,
  },
];