import { RedoOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { DatePicker } from "antd";
import moment from "moment";
import { errorMessage } from "../../helpres/messages";
import { FIRST_ORDER } from "./order-qgl";
import locale from 'antd/es/date-picker/locale/uk_UA';
const { RangePicker } = DatePicker;

const dateFormat = "MM/DD/YYYY";

export const CustomRangePicker = ({ handleDate }: any) => {
  const { loading, error, data, refetch } = useQuery(FIRST_ORDER, {
    variables: {
      sortField: "createdAt",
      sortOrder: "asc",
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error </p>;
  const [{ createdAt }] = data.getFirstOrder;
  return (
    <>
      <RangePicker
        locale={locale}
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
