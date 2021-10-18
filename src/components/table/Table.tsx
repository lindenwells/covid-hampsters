/*
 * This file contains the tables used for DataGrid, which displays our
 * hospital data.
 * The below table is built with the material-ui framework, using the code 
 * example "Sorting & selecting" given in their website referenced below:
 * 
 * REFERENCE:
 * Material-UI. "Table." Material-UI. 
 * https://material-ui.com/components/tables/ (accessed Sep. 12, 2021).
 */

import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { blue } from '@material-ui/core/colors';
import { data as hospitalData } from "../../assets/hospitals";
/*
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
*/

interface Data {
  // bedsMild: number;
  // bedsMildTotal: number;
  // bedsSevere: number;
  // bedsSevereTotal: number;
  beds: number;
  bedsTotal: number;
  hospitalName: string;
  totalBeds: number;
}

function createData(
  hospitalName: string,
  beds: number,
  bedsTotal: number,
  // bedsSevere: number,
  // bedsSevereTotal: number,
  // bedsMild: number,
  // bedsMildTotal: number,
  totalBeds: number,
): Data {
  return { hospitalName, beds, bedsTotal, totalBeds };//bedsSevere, bedsSevereTotal, bedsMild, bedsMildTotal, totalBeds };
}

// TODO: replace this with hospitalData
// i.e. set rows to the rows of hospitals in a certain area
const rows = [
  createData('Hospital 1', 100, 200, 200),
  createData('Hospital 2', 200, 300, 300),
  createData('Hospital 3', 300, 400, 400),
  createData('Hospital 4', 400, 500, 500),
  createData('Hospital 5', 500, 600, 600),
  createData('Hospital 6', 600, 700, 700),
  createData('Hospital 7', 700, 800, 800),
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: 'hospitalName', numeric: false, disablePadding: true, label: 'Hospital Name' },
  { id: 'beds', numeric: true, disablePadding: false, label: 'Available beds for patients' },
  // { id: 'bedsMild', numeric: true, disablePadding: false, label: 'Available beds for mild patients' },
  { id: 'totalBeds', numeric: true, disablePadding: false, label: 'Total number of beds' },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell className={classes.cell} padding="checkbox">
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            className={classes.cell}
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <CustomTableSortLabel
              classes={{icon: classes.cell}}
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </CustomTableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 1000,
      margin: 'auto',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
      backgroundColor: "#2B2C3E",
    },
    table: {
    },
    cell: {
      color: "#FFFFFF",
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
    tableRow: {
      "&.Mui-selected, &.Mui-selected:hover": {
        // !important is bad practice, search better way later
        backgroundColor: blue[500] + "!important",
      }
    }
  }),
);

const ColoredTableRow = withStyles({
  root: {
    '&:nth-of-type(odd)': {
      // backgroundColor: "#efefef",
    },
  },
})(TableRow);

const BlueSwitch = withStyles({
  switchBase: {
    color: blue[500],
    '&$checked': {
      color: blue[600],
    },
    '&$checked + $track': {
      backgroundColor: blue[600],
    },
  },
  checked: {},
  track: {},
})(Switch);

const CustomTableSortLabel = withStyles({
  root: {
    color: '#ffffff',
    "&:hover": {
      color: '#ffffff',
    },
    '&$active': {
      color: '#ffffff',
    },
  },
  active: {},
  icon: {
    color: '#ffffff !important'
  },
})(TableSortLabel);

const BlueCheckbox = withStyles({
  root: {
    color: blue[600],
    '&$checked': {
      color: blue[700],
    },
  },
  checked: {},
})(Checkbox);

interface detailProps {
  clickHandle: (hospitalName: string) => void; 
}

export default function EnhancedTable(props: detailProps) {
  const { clickHandle } = props;

  function test(region: string) {
    hospitalData.forEach(function (hospital, index) {
      // if (areas[hospital["Hospital and Health Service"]])
      //   area = areas[hospital["Hospital and Health Service"]]

      //TODO: somehow get hospitalName here in props or something
      if (hospital["Hospital and Health Service"] == region) {
        console.log(hospital["Facility Name"]);
      }
    });
  }

  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('desc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('totalBeds');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.hospitalName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    console.log("testing: " + name);
    test(name); // TODO: function called here


    clickHandle(name)

    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.hospitalName);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <ColoredTableRow
                      hover
                      onClick={(event) => handleClick(event, row.hospitalName)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.hospitalName}
                      selected={isItemSelected}
                      className={classes.tableRow}
                    >
                      <TableCell className={classes.cell} padding="checkbox">
                        <BlueCheckbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell className={classes.cell} component="th" id={labelId} scope="row" padding="none">
                        {row.hospitalName}
                      </TableCell>
                      <TableCell className={classes.cell} align="right">{row.beds} / {row.bedsTotal}</TableCell>
                      {/* <TableCell className={classes.cell} align="right">{row.bedsMild} / {row.bedsMildTotal}</TableCell> */}
                      <TableCell className={classes.cell} align="right">{row.totalBeds}</TableCell>
                    </ColoredTableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell className={classes.cell} colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          className={classes.cell}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Paper className={classes.paper}>
        <FormControlLabel
          className={classes.cell}
          control={<BlueSwitch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
        />
      </Paper>
    </div>
  );
}