import React, { useEffect, useState } from "react";

import { useMutation, useQuery } from "@apollo/client";
import { Col, Row } from "antd";
import { errorMessage, succesMessage } from "../../helpres/messages";
import { OrderCard } from "./OrderCard";
import { UserCard } from "./UserCard";
import {
  Order,
  useOrderQuery,
  UserCarParams,
  useUpdateUserCarParamsMutation,
} from "../../generated/graphql";

const cardContent = {
  width: "100%",
  paddingBottom: "1rem",
  paddingTop: "1rem",
};

export const ExpandedOrder = ({
  record,
  orderStatuses,
  transmissions,
  fuelTypes,
  bodyTypes,
  driveTypes,
  partTypes,
}: {
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
        <Col span={16}>
          <OrderCard
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
        <Col span={8}>
          <UserCard record={record} cardContent={cardContent} />
        </Col>
      </Row>
    </>
  );
};
