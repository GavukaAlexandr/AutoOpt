import { DatePicker } from "antd";
import moment from "moment";
import { Order, useGetFirstOrderQuery } from "../../generated/graphql";
const { RangePicker } = DatePicker;

const dateFormat = "MM/DD/YYYY";

export const CustomRangePicker = ({ handleDate }: any) => {
  const { loading, error, data } = useGetFirstOrderQuery({
    variables: {
      sortField: "createdAt",
      sortOrder: "asc",
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error </p>;
  if (data!.getFirstOrder.length === 0) return null;
  const [{ createdAt }] = data?.getFirstOrder as Order[]
  return (
    <>
      <RangePicker
        size={"large"}
        style={{ width: "100%", maxWidth: "220px" }}
        defaultValue={[
          moment(new Date(createdAt), dateFormat),
          moment(new Date(), dateFormat),
        ]}
        format={dateFormat}
        onChange={(value, dateString) => {
          if (dateString[0] !== "" && dateString[1] !== "") {
            return handleDate(new Date(dateString[0]), new Date(dateString[1]));
          }
          console.log(value);
          console.log(dateString);
        }}
        disabledDate={(current) => {
          const start = moment(new Date(createdAt), dateFormat);
          return current < start || current > moment();
        }}
      />
    </>
  );
};
