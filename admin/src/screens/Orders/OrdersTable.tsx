import React, { useEffect, useState } from "react";
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
import { ExpandedOrder } from "./ExpandedTable";
import { SearchOutlined } from "@ant-design/icons";
import { CustomRangePicker } from "./RangePicker";
import { errorMessage } from "../../helpres/messages";
import { coloredTags } from "../../helpres/ColoredTags";
import { Order, useAllOrdersQuery } from "../../generated/graphql";

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
  const [status, setStatus] = useState({id: "", name: "Статус"});
  const [loading, setLoading] = useState(false);
  const {
    loading: loadingList,
    error,
    data,
    refetch,
  } = useAllOrdersQuery({
    variables: {
      page,
      perPage,
      sortField,
      sortOrder,
      filter: {},
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

  const tableFromResponse = (data: Order[]) => {
    return data.map((v, i) => {
      return {
        key: v.id,
        firstName: v.user.firstName,
        lastName: v.user.lastName,
        userComment: v.user.comment,
        comment: v.comment,
        userId: v.user.id,
        email: v.user.email,
        telegramNotification: v.user.telegramNotification,
        viberNotification: v.user.viberNotification,
        phoneNotification: v.user.phoneNotification,
        status: v.status.name,
        model: v.model.name,
        brand: v.model.brand.name,
        createdAt: new Date(v.createdAt).toLocaleDateString("ua-UA"),
        phoneNumber: v.user.phoneNumber,
        type: v.model.type.name,
        carPart: v.carPart,
        userCarParamId: v.id
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
        const arrayOfStatus: Record<string, any>[] = data?.orderStatuses.filter(value => value.id == v.key) as Record<string, any>[]; 
        const [{id, name}] = arrayOfStatus;
        setStatus({id, name});
        try {
          refetch({
            filter: {
              status: id,
            },
          });
        } catch (error) {
          errorMessage(`${error}`);
        }
      }}
    >
      {data?.orderStatuses.map(data => {
        return <Menu.Item key={data.id}>{coloredTags(data.name)}</Menu.Item>;
      })}
    </Menu>
  );

  const mainColumns = [
    {
      title: "Имя",
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
      title: "Фамилия",
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
      title: "Телефон",
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
      title: "Запчасть",
      dataIndex: "carPart",
      key: "carPart",
      render: (text: string) => (
        <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: "больше" }}>
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
      title: "Тип",
      dataIndex: "type",
      key: "type",
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: "Бренд",
      dataIndex: "brand",
      key: "brand",
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: "Модель",
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
            {coloredTags(status.name)}
          </Dropdown>
        </>
      ),
      key: "status",
      dataIndex: "status",
      render: (status: string) => coloredTags(status)
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
            record={record}
            orderStatuses={data!.orderStatuses}
            transmissions={data!.transmissions}
            fuelTypes={data!.fuelTypes}
            bodyTypes={data!.bodyTypes}
            driveTypes={data!.driveTypes}
            partTypes={data!.partTypes}
          />
        )}
        dataSource={tableFromResponse(data?.allOrders as Order[])}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ["10", "25", "50", "100", "200"],
          defaultPageSize: 50,
          onChange: onChangePage,
          total: data?.allOrdersMeta.count as number,
        }}
      />
      <BackTop />
    </>
  );
};
