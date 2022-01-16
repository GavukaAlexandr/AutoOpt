
import { Col, Row } from "antd";
import { OrderCard } from "./OrderCard";
import { UserCard } from "./UserCard";
import {
  Order,
  useOrderQuery,
} from "../../generated/graphql";

const cardContent = {
  width: "100%",
  paddingBottom: "1rem",
  paddingTop: "1rem",
};

export const ExpandedOrder = ({
  translations,
  record,
  orderStatuses,
  transmissions,
  fuelTypes,
  bodyTypes,
  driveTypes,
  partTypes,
}: {
  translations: Record<string, any>
  record: Record<string, any>;
  orderStatuses: Record<string, any>[]
  transmissions: Record<string, any>[]
  fuelTypes: Record<string, any>[]
  bodyTypes: Record<string, any>[]
  driveTypes: Record<string, any>[]
  partTypes: Record<string, any>[]
}) => {
  const { loading: oderLoading, error: orderError, data: orderData } = useOrderQuery({
    variables: {
      id: record.key
    }
  })

  if (oderLoading) return <p>Loading...</p>;
  if (orderError) return <p>Error </p>;
  
  return (
    <>
      <Row gutter={[16, 8]} className="site-card-border-less-wrapper">
        <Col 
        span={16}
        xs={16}
        sm={14}
        md={14}
        lg={14}
        xl={14}
        xxl={14}
        >
          <OrderCard
            translations={translations}
            order={orderData?.Order as Order}
            cardContent={cardContent}
            orderStatuses={orderStatuses}
            transmissions={transmissions}
            fuelTypes={fuelTypes}
            bodyTypes={bodyTypes}
            driveTypes={driveTypes}
            partTypes={partTypes}
          />
        </Col>
        <Col span={8} 
        xs={8}
        sm={10}
        md={10}
        lg={10}
        xl={10}
        xxl={10}
        >
          <UserCard record={record} cardContent={cardContent} />
        </Col>
      </Row>
    </>
  );
};
