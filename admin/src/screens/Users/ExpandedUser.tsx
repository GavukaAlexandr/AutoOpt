import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { errorMessage, succesMessage } from "../../helpres/messages";

import { Card, Col, Row, Typography } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { OrdersTableByUser } from "../Orders/OrdersTable";

const { Title } = Typography;
const cardContent = {
  width: "100%",
  paddingBottom: "1rem",
  paddingTop: "1rem",
};

export const ExpandedUser = ({ record }: Record<string, any>) => {
  const { comment, key: id } = record;
  return (
    <>
      <Row gutter={[16, 24]} className="site-card-border-less-wrapper">
        <Col span={24}>
          <Card>
            <Card.Grid style={cardContent} hoverable={false}>
              <Title style={{ display: "inline" }} level={5}>
                Orders:{" "}
              </Title>
              <OrdersTableByUser
                page={0}
                perPage={10}
                sortField={"createdAt"}
                sortOrder={"desc"}
                userId={id}
              />
            </Card.Grid>
          </Card>
        </Col>
        <Col span={24}>
          <Card>
            <Card.Grid style={cardContent} hoverable={false}>
              <Title style={{ display: "inline" }} level={5}>
                Comment about User:{" "}
              </Title>
              <ReactQuill
                theme="snow"
                value={comment}
                onChange={(v) => console.log(v)}
              />{" "}
            </Card.Grid>
          </Card>
        </Col>
      </Row>
    </>
  );
};
