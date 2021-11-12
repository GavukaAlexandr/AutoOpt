import React, { useEffect, useState } from "react";

import { useMutation, useQuery } from "@apollo/client";
import { ORDER, UPDATE_ORDER } from "./order-qgl";
import {
  Col,
  Row,
} from "antd";
import { errorMessage, succesMessage } from "../../helpres/messages";
import { OrderCard } from "./OrderCard";
import { UserCard } from "./UserCard";

const cardContent = {
  width: "100%",
  paddingBottom: "1rem",
  paddingTop: "1rem",
};

export const Expanded = ({statuses, record, transmissions, partTypes, driveTypes, bodyTypes, fuelTypes }: Record<string, any>) => {
  const [updateOrder] = useMutation(UPDATE_ORDER);
  const { loading, error, data } = useQuery(ORDER, {
    variables: {
      id: record.key,
    },
  });
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error </p>;
  return (
    <>
      <Row gutter={[16, 8]} className="site-card-border-less-wrapper">
        <Col span={16}>
          <OrderCard
            statuses={statuses.__type.enumValues}
            partTypes={partTypes.__type.enumValues}
            transmissions={transmissions.__type.enumValues}
            driveTypes={driveTypes.__type.enumValues}
            bodyTypes={bodyTypes.__type.enumValues}
            fuelTypes={fuelTypes.__type.enumValues}
            data={data}
            cardContent={cardContent}
          />
        </Col>
        <Col span={8}>
          <UserCard data={data} cardContent={cardContent} />
        </Col>
      </Row>
    </>
  );
};
