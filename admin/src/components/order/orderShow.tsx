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
  RichTextField,
} from "react-admin";
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";

const OrderShow = (props: any) => {
  const { record } = useShowController(props);
  const classes = useStyles();

  if (!record) return null;
  return (
    <Show
      {...props}
      /* disable the app title change when shown */
      title=" "
    >
      <SimpleShowLayout className={classes.card}>
        <CardContent >
          <Grid container>
            <Grid item xs={6}>
              <Typography variant="h6" gutterBottom className={classes.test}>
                Date: {new Date(record.createdAt).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <Typography variant="h6" gutterBottom align="center">
                Order
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" gutterBottom align="center">
                User
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={10}>
            <Grid item xs={6}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Car part:&nbsp; {record.carPart}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Year: {record.year}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Vin: {record.vin}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Drive {record.drive}</TableCell>
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
            </Grid>

            <Grid item xs={6}>
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
  root: {
    maxWidth: 1000,
    margin: "auto",
    marginTop: "5px",
    marginBottom: "5px",
  },
  card: {
    border: ".1px solid grey",
    padding: "10px",
    boxShadow: "3.px 2.5px grey",
  },
  test: { display: "flex", alignItems: "center" },
  text: { fontSize: "16px" },
  bold: { fontSize: "18px", fontWeight: "bold" },
  spacer: { height: 20 },
  rightAlignedCell: { textAlign: "right" },
  invoices: { margin: "10px 0" },
});
