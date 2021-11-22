import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Table,
  BackTop,
  Tag,
  Typography,
  Input,
  Spin,
  Row,
  Dropdown,
  Menu,
} from "antd";
import { computePage } from "../../helpres/pagination-helper";
import { ORDERS_LIST } from "./order-qgl";
import { ExpandedOrder, ExpandedOrderByUser } from "./ExpandedTable";
import {
  BODY_TYPES,
  DRIVE_TYPES,
  PART_TYPES,
  STATUSES,
  TRANSMISSIONS,
} from "../enums-gql";
import { SearchOutlined } from "@ant-design/icons";
import { CustomRangePicker } from "./RangePicker";
import { errorMessage } from "../../helpres/messages";
import { coloredTags } from "../../helpres/ColoredTags";

const { Paragraph } = Typography;

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
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchCarPart, setSearchCarPart] = useState("");
  const [status, setStatus] = useState("PROCESSING");
  const [loading, setLoading] = useState(false);
  const {
    loading: loadingList,
    error,
    data,
    refetch,
  } = useQuery(ORDERS_LIST, {
    variables: {
      page,
      perPage,
      sortField,
      sortOrder,
      filter: {},
    },
  });

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

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      try {
        refetch({
          filter: {
            firstName: searchFirstName,
            lastName: searchLastName,
            phoneNumber: searchPhone,
            carPart: searchCarPart,
          },
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        errorMessage(`${error}`);
      }
    }, 400);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFirstName, searchLastName, searchPhone, searchCarPart]);

  const tableFromResponse = (data: Record<string, any>[]) => {
    return data.map((v, i) => {
      return {
        key: v.id,
        firstName: v.user.firstName,
        lastName: v.user.lastName,
        status: v.status,
        model: v.model.name,
        brand: v.model.brand.name,
        createdAt: new Date(v.createdAt).toLocaleDateString("ua-UA"),
        phoneNumber: v.user.phoneNumber,
        type: v.model.type.name,
        carPart: v.carPart,
      };
    });
  };

  const handleDate = (startDate: string, endDate: string) => {
    setLoading(true);
    try {
      refetch({
        filter: {
          startDate,
          endDate,
        },
      });
      setLoading(false);
    } catch (error) {
      errorMessage(`${error}`);
      setLoading(false);
    }
  };

  const onChangePage = (currentPage: number, pageSize?: number): void => {
    setLoading(true);
    try {
      refetch({
        page: computePage(currentPage, pageSize!), //skip
        perPage: pageSize, //take
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      errorMessage(`${error}`);
    }
  };

  if (loadingList)
    return (
      <Row justify="center" align="middle" style={{ minHeight: "100%" }}>
        <Spin />
      </Row>
    );
  if (error) return <p>Oppps Something Wrong </p>;

  const statusMenu = (
    <Menu
      onClick={(v) => {
        setStatus(v.key);
        try {
          refetch({
            filter: {
              status: v.key,
            },
          });
        } catch (error) {
          errorMessage(`${error}`);
        }
      }}
    >
      {statusesData.__type.enumValues.map((data: Record<string, any>) => {
        return <Menu.Item key={data.name}>{coloredTags(data.name)}</Menu.Item>;
      })}
    </Menu>
  );

  const mainColumns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      render: (text: string) => <a>{text}</a>,
      filterDropdown: () => {
        return (
          <Input
            autoFocus
            value={searchFirstName}
            onChange={(v) => {
              setSearchFirstName(v.target.value);
            }}
          ></Input>
        );
      },
      filterIcon: () => {
        return (
          <SearchOutlined
            style={{
              fontSize: "1.2rem",
              color: searchFirstName ? "yellow" : "white",
            }}
          />
        );
      },
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      render: (text: string) => <a>{text}</a>,
      filterDropdown: () => {
        return (
          <Input
            autoFocus
            value={searchLastName}
            onChange={(v) => {
              setSearchLastName(v.target.value);
            }}
          ></Input>
        );
      },
      filterIcon: () => {
        return (
          <SearchOutlined
            style={{
              fontSize: "1.2rem",
              color: searchLastName ? "yellow" : "white",
            }}
          />
        );
      },
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text: string) => <Paragraph copyable>{text}</Paragraph>,
      filterDropdown: () => {
        return (
          <Input
            autoFocus
            value={searchPhone}
            onChange={(v) => {
              setSearchPhone(v.target.value);
            }}
          ></Input>
        );
      },
      filterIcon: () => {
        return (
          <SearchOutlined
            style={{
              fontSize: "1.2rem",
              color: searchPhone ? "yellow" : "white",
            }}
          />
        );
      },
    },
    {
      width: "30%",
      title: "Car part",
      dataIndex: "carPart",
      key: "carPart",
      render: (text: string) => (
        <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: "more" }}>
          {text}
        </Paragraph>
      ),
      filterDropdown: () => {
        return (
          <Input
            autoFocus
            value={searchCarPart}
            onChange={(v) => {
              setSearchCarPart(v.target.value);
            }}
          ></Input>
        );
      },
      filterIcon: () => {
        return (
          <SearchOutlined
            style={{
              fontSize: "1.2rem",
              color: searchCarPart ? "yellow" : "white",
            }}
          />
        );
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: () => (
        <>
          <Dropdown
            overlay={statusMenu}
            trigger={["click"]}
            placement="bottomCenter"
          >
            {coloredTags(status)}
          </Dropdown>
        </>
      ),
      key: "status",
      dataIndex: "status",
      render: (status: string) => {
        let color;
        if (status === "PROCESSING") {
          color = "orange";
        }
        if (status === "SENT") {
          color = "blue";
        }
        if (status === "DONE") {
          color = "green";
        }
        return (
          <Tag color={color} key={status}>
            {status.toLowerCase()}
          </Tag>
        );
      },
    },
    {
      title: () => {
        return <CustomRangePicker handleDate={handleDate} />;
      },
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => <div style={{ marginLeft: "25%" }}>{text}</div>,
    },
  ];
  return (
    <>
      <Table
        className="table-striped-rows"
        columns={mainColumns}
        loading={loading}
        expandedRowRender={(record) => (
          <ExpandedOrder
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
          pageSizeOptions: ["10", "25", "50", "100", "200"],
          defaultPageSize: 50,
          onChange: onChangePage,
          total: data.allOrdersMeta.count,
        }}
      />
      <BackTop />
    </>
  );
};

export const OrdersTableByUser = ({
  page,
  perPage,
  sortField,
  sortOrder,
  userId,
}: {
  page: number;
  perPage: number;
  sortField: string;
  sortOrder: string;
  userId: string;
}) => {
  const [searchCarPart, setSearchCarPart] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    loading: ordersLoading,
    error,
    data,
    refetch,
  } = useQuery(ORDERS_LIST, {
    variables: {
      page,
      perPage,
      sortField,
      sortOrder,
      filter: {
        user: userId,
        carPart: "",
      },
    },
  });
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

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      try {
        refetch({
          filter: {
            user: userId,
            carPart: searchCarPart,
          },
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        errorMessage(`${error}`);
      }
    }, 400);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchCarPart]);

  const tableFromResponse = (data: Record<string, any>[]) => {
    return data.map((v, i) => {
      return {
        key: v.id,
        firstName: v.user.firstName,
        lastName: v.user.lastName,
        status: v.status,
        model: v.model.name,
        brand: v.model.brand.name,
        createdAt: new Date(v.createdAt).toLocaleDateString("ua-UA"),
        phoneNumber: v.user.phoneNumber,
        type: v.model.type.name,
        carPart: v.carPart,
      };
    });
  };

  const onChangePage = (currentPage: number, pageSize?: number): void => {
    setLoading(true);
    try {
      refetch({
        page: computePage(currentPage, pageSize!), //skip
        perPage: pageSize, //take
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      errorMessage(`${error}`);
    }
  };

  if (ordersLoading)
    return (
      <Row justify="center" align="middle" style={{ minHeight: "100%" }}>
        <Spin />
      </Row>
    );
  if (error) return <p>Oppps Something Wrong </p>;

  const mainColumns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text: string) => <Paragraph copyable>{text}</Paragraph>,
    },
    {
      width: "40%",
      title: () => {
        return (
          <>
            <span>CarPart: </span>
            {"  "}
            <Input
              style={{ width: "auto" }}
              autoFocus
              value={searchCarPart}
              onChange={(v) => {
                v.preventDefault();
                setSearchCarPart(v.target.value);
              }}
            ></Input>
          </>
        );
      },
      dataIndex: "carPart",
      key: "carPart",
      render: (text: string) => (
        <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: "more" }}>
          {text}
        </Paragraph>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status: string) => {
        let color;
        if (status === "PROCESSING") {
          color = "orange";
        }
        if (status === "SENT") {
          color = "blue";
        }
        if (status === "DONE") {
          color = "green";
        }
        return (
          <Tag color={color} key={status}>
            {status.toLowerCase()}
          </Tag>
        );
      },
    },
    {
      title: "createdAt",
      dataIndex: "createdAt",
      key: "createdAt",
    },
  ];
  return (
    <>
      <Table
        className="table-striped-rows"
        columns={mainColumns}
        loading={loading}
        expandedRowRender={(record) => (
          <ExpandedOrderByUser
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
          pageSizeOptions: ["10", "25", "50", "100", "200"],
          defaultPageSize: 10,
          onChange: onChangePage,
          total: data.allOrdersMeta.count,
        }}
      />
      <BackTop />
    </>
  );
};
