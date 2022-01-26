import * as React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import {
  useShowController,
  ReferenceField,
  FunctionField,
  BooleanField,
  Show,
  SimpleShowLayout,
  SimpleForm,
} from "react-admin";
import {
  Chip,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { FormControl } from "@mui/material";

const OrderShow = (props: any) => {
  const [status, setStatus] = React.useState("");
  const { record } = useShowController(props);
  const classes = useStyles();

  const handleChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  React.useEffect(() => {
    const status = props.statusList.find(
      ({ name }) => name === `${record?.status}`
    );
    setStatus(status);
  }, []);

  if (!record) return null;
  return (
    <Show {...props} title=" ">
      <SimpleShowLayout>
        <CardContent className={classes.root}>
          <Grid container>
            <Grid item xs="auto">
              <Typography variant="h6" gutterBottom>
                Date: {new Date(record.createdAt).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Typography variant="h5">Order:</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="h6">Car part:</Typography>
                      {record.carPart}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Year: {record.year}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Vin: {record.vin}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Drive: {record.drive}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Engine Volume: {record.engineVolume}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Model: {record.modelId}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Body Type: {record.bodyType}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Transmission: {record.transmission}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Status: {record.status}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Fuel:&nbsp;
                      {
                        <FunctionField
                          render={(record) =>
                            record.fuel.map((v, i) => (
                              <Chip key={i} size={"small"} label={v} />
                            ))
                          }
                        />
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Part Type:&nbsp;
                      {
                        <FunctionField
                          render={(record) =>
                            record.part.map((v, i) => (
                              <Chip key={i} size={"small"} label={v} />
                            ))
                          }
                        />
                      }
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Status
                </InputLabel>
                <Select
                  value={status}
                  onChange={handleChange}
                  label="Status"
                  labelId="demo-simple-select-standard-label"
                >
                  {props.statusList.map((status) => {
                    return (
                      <MenuItem key={status.id} value={status.id}>
                        {status.name.toLowerCase()}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs="auto">
              <Typography variant="h5">User:</Typography>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      Name:&nbsp;
                      <ReferenceField source="userId" reference="User">
                        <FunctionField
                          render={(record) =>
                            `${record.firstName} ${record.lastName}`
                          }
                        />
                      </ReferenceField>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Phone:&nbsp;
                      <ReferenceField
                        source="userId"
                        reference="User"
                        link={false}
                      >
                        <FunctionField
                          render={(record) => `${record.phoneNumber}`}
                        />
                      </ReferenceField>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Email:&nbsp;
                      <ReferenceField
                        source="userId"
                        reference="User"
                        link={false}
                      >
                        <FunctionField render={(record) => `${record.email}`} />
                      </ReferenceField>
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Telegram</TableCell>
                    <TableCell>Viber</TableCell>
                    <TableCell>Phone</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <ReferenceField
                        source="userId"
                        reference="User"
                        link={false}
                      >
                        <BooleanField source="telegramNotification" />
                      </ReferenceField>
                    </TableCell>
                    <TableCell>
                      <ReferenceField
                        source="userId"
                        reference="User"
                        link={false}
                      >
                        <BooleanField source="viberNotification" />
                      </ReferenceField>
                    </TableCell>
                    <TableCell>
                      <ReferenceField
                        source="userId"
                        reference="User"
                        link={false}
                      >
                        <BooleanField source="phoneNotification" />
                      </ReferenceField>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </CardContent>
      </SimpleShowLayout>
    </Show>
  );
};

export default OrderShow;
const useStyles = makeStyles({
  root: {},
  test: { display: "flex", alignItems: "center" },
  spacer: { height: 20 },
  rightAlignedCell: { textAlign: "right" },
  invoices: { margin: "10px 0" },
});
