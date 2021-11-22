import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Typography,
  Row,
  Spin,
} from "antd";
import { USER_LIST, USER_UPDATE } from "./user-gql";
import { useMutation, useQuery } from "@apollo/client";
import { errorMessage, succesMessage } from "../../helpres/messages";
import { computePage } from "../../helpres/pagination-helper";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ExpandedUser } from "./ExpandedUser";

interface Item {
  key: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  orders: string;
  phoneNotification: boolean;
  telegramNotification: boolean;
  viberNotification: boolean;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "text";
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const preparedData = (data: Item[]) => {
  return data.map((value: Record<string, any>, i: number) => {
    return {
      key: value.id,
      firstName: value.firstName,
      lastName: value.lastName,
      orders: value.orders.length.toString(),
      phoneNumber: value.phoneNumber,
      email: value.email,
      phoneNotification: value.phoneNotification,
      telegramNotification: value.telegramNotification,
      viberNotification: value.viberNotification,
      comment: value.comment,
    };
  });
};

export const UsersTable = ({
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
  const {
    loading: usersLoading,
    error,
    data: userData,
    refetch,
  } = useQuery(USER_LIST, {
    variables: {
      page,
      perPage,
      sortField,
      sortOrder,
      filter: {},
    },
  });
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [updateUser] = useMutation(USER_UPDATE);
  const [form] = Form.useForm();
  const [data, setData] = useState<Item[]>();
  const [editingKey, setEditingKey] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ fisrtName: "", lastName: "", ...record });
    setEditingKey(record.key);
  };

  useEffect(() => {
    setLoading(true);
    try {
      const delayDebounceFn = setTimeout(() => {
        refetch({
          filter:{
            firstName: searchFirstName,
            lastName: searchLastName,
            phoneNumber: searchPhone,
            email: searchEmail
          }
        });
        setLoading(false);
      }, 600);
      return () => clearTimeout(delayDebounceFn); 
    } catch (error) {
      errorMessage('Search Error')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFirstName, searchLastName, searchEmail, searchPhone]);

  useEffect(() => {
    if (!loading && userData) {
      setData(preparedData(userData.allUsers));
    }
  }, [loading, userData]);

  const cancel = () => {
    setEditingKey("");
  };

  const userUpdate = (newData: Item) => {
    setLoading(true);
    let { firstName, lastName, key } = newData;
    console.log(firstName, lastName);
    try {
      updateUser({
        variables: {
          updateUserInput: {
            id: key,
            firstName: firstName,
            lastName: lastName,
          },
        },
        refetchQueries: [USER_LIST, "allUsers"],
      });
      setLoading(false);
      return succesMessage("User updated");
    } catch (error) {
      setLoading(false);
      return errorMessage(`$User update error`);
    }
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;
      const newData = [...(data as Item[])];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        userUpdate(newData[index]);
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
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
    }
  };

  if (usersLoading)
    return (
      <Row justify="center" align="middle" style={{ minHeight: "100%" }}>
        <Spin />
      </Row>
    );
  if (error) return <p>Error </p>;
  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      editable: true,
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
        return <SearchOutlined
        style={{
          fontSize: "1.2rem",
          color: searchFirstName ? "yellow" : "white",
        }}
      />
      },
    },

    {
      title: "Last Name",
      dataIndex: "lastName",
      editable: true,
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
        return <SearchOutlined
        style={{
          fontSize: "1.2rem",
          color: searchLastName ? "yellow" : "white",
        }}
      />
      },
    },

    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
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
        return <SearchOutlined
        style={{
          fontSize: "1.2rem",
          color: searchPhone ? "yellow" : "white",
        }}
      />
      },
    },

    {
      title: "Orders",
      dataIndex: "orders",
      render(_: any, record: Item) {
        return <Link to="/">{record.orders}</Link>;
      },
    },

    {
      title: "Email",
      dataIndex: "email",
      filterDropdown: () => {
        return (
          <Input
            autoFocus
            value={searchEmail}
            onChange={(v) => {
              setSearchEmail(v.target.value);
            }}
          ></Input>
        );
      },
      filterIcon: () => {
        return <SearchOutlined
        style={{
          fontSize: "1.2rem",
          color: searchEmail ? "yellow" : "white",
        }}
      />
      },
    },
    {
      title: "Phone",
      dataIndex: "phoneNotification",
      width: "5%",
      render(_: any, record: Item) {
        return record.phoneNotification ? (
          <CheckCircleOutlined style={{ fontSize: "20px", color: "green" }} />
        ) : (
          <CloseCircleOutlined style={{ fontSize: "20px", color: "red" }} />
        );
      },
    },

    {
      title: "Telegram",
      dataIndex: "telegramNotification",
      width: "5%",
      render(_: any, record: Item) {
        return record.telegramNotification ? (
          <CheckCircleOutlined style={{ fontSize: "20px", color: "green" }} />
        ) : (
          <CloseCircleOutlined style={{ fontSize: "20px", color: "red" }} />
        );
      },
    },

    {
      title: "Viber",
      dataIndex: "viberNotification",
      width: "5%",
      render(_: any, record: Item) {
        return record.viberNotification ? (
          <CheckCircleOutlined style={{ fontSize: "20px", color: "green" }} />
        ) : (
          <CloseCircleOutlined style={{ fontSize: "20px", color: "red" }} />
        );
      },
    },

    {
      title: "operation",
      dataIndex: "operation",
      width: "5%",
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              href="#;"
              onClick={() => save(record.key)}
              style={{ marginRight: 8 }}
            >
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            <EditOutlined style={{ fontSize: "1.5rem" }} />
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        loading={loading}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        expandedRowRender={(record) => <ExpandedUser record={record} />}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ["10", "25", "50", "100", "200"],
          defaultPageSize: 50,
          onChange: onChangePage,
          total: userData.allUsersMeta.count,
        }}
      />
    </Form>
  );
};
