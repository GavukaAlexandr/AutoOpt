import React, { useEffect, useState } from "react";

import { useQuery } from "@apollo/client";
import { Table, BackTop, Tag } from "antd";
import { computePage } from "../../helpres/pagination-helper";
import { mainColumns } from "./table-columns";
import { ORDERS_LIST } from "./order-qgl";
import { Expanded } from "./ExpandedTable";
import {
  BODY_TYPES,
  DRIVE_TYPES,
  PART_TYPES,
  STATUSES,
  TRANSMISSIONS,
} from "../enums-gql";

export const OrdersTable = ({
  page,
  perPage,
  sortField,
  sortOrder,
}: {
  page: number;
  perPage: number;
  sortField: string;
  sortOrder: string;
}) => {
  const { data: statusesData } = useQuery(STATUSES, {
    variables: {
      name: "OrderStatus",
    },
  });
  const { data: transmissionsData } = useQuery(TRANSMISSIONS, {
    variables: {
      name: "Transmission",
    },
  });
  const { data: partTypeData } = useQuery(PART_TYPES, {
    variables: {
      name: "PartType",
    },
  });
  const { data: driveTypeData } = useQuery(DRIVE_TYPES, {
    variables: {
      name: "DriveType",
    },
  });

  const { data: bodyTypeData } = useQuery(BODY_TYPES, {
    variables: {
      name: "BodyType",
    },
  });

  const { data: fuelTypeData } = useQuery(BODY_TYPES, {
    variables: {
      name: "FuelType",
    },
  });

  const { loading, error, data, refetch } = useQuery(ORDERS_LIST, {
    variables: {
      page,
      perPage,
      sortField,
      sortOrder,
    },
  });

  const tableFromResponse = (
    data: Record<string, any>[]
  ): Record<string, any>[] => {
    return data.map((v, i) => {
      return {
        key: v.id,
        user: `${v.user.firstName}  ${v.user.lastName}`,
        status: v.status,
        model: v.model.name,
        brand: v.model.brand.name,
        createdAt: new Date(v.createdAt).toLocaleDateString("ua-UA"),
      };
    });
  };

  const onChangePage = (currentPage: number, pageSize?: number): void => {
    refetch({
      page: computePage(currentPage, pageSize!), //skip
      perPage: pageSize, //take
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error </p>;
  return (
    <>
      <Table
        className="table-striped-rows"
        columns={mainColumns}
        expandedRowRender={(record) => (
          <Expanded
            fuelTypes={fuelTypeData}
            bodyTypes={bodyTypeData}
            driveTypes={driveTypeData}
            partTypes={partTypeData}
            transmissions={transmissionsData}
            statuses={statusesData}
            record={record}
          />
        )}
        dataSource={tableFromResponse(data.allOrders)}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ["10", "25", "50"],
          onChange: onChangePage,
          total: data.allOrdersMeta.count,
        }}
      />
      <BackTop />
    </>
  );
};
