import React, { useEffect, useState } from "react";

import { useMutation, useQuery } from "@apollo/client";
import { Col, Row } from "antd";
import { errorMessage, succesMessage } from "../../helpres/messages";
import { OrderCard } from "./OrderCard";
import { UserCard } from "./UserCard";
import {
  Order,
  useOrderQuery,
  useUpdateOrderMutation,
} from "../../generated/graphql";

const cardContent = {
  width: "100%",
  paddingBottom: "1rem",
  paddingTop: "1rem",
};

export const ExpandedOrder = ({
  record,
}: Record<string, any>) => {
  const [updateOrder] = useUpdateOrderMutation();
  const { loading, error, data } = useOrderQuery({
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
            data={data?.Order as Order}
            cardContent={cardContent}
          />
        </Col>
        <Col span={8}>
          <UserCard data={data?.Order as Order} cardContent={cardContent} />
        </Col>
      </Row>
    </>
  );
};
