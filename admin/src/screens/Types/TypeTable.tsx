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
  BackTop,
} from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { errorMessage, succesMessage } from "../../helpres/messages";
import { CREATE_TYPE, TYPE_LIST, UPDATE_TYPE } from "./type-qls";
import {
  CloseOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { ModalCreateType } from "./TypeCreateModal";

interface Item {
  key: string;
  name: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
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
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
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
      name: value.name,
    };
  });
};

export const TypeTable = ({
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
    loading,
    error,
    data: typeData,
    refetch,
  } = useQuery(TYPE_LIST, {
    variables: {
      page,
      perPage,
      sortField,
      sortOrder,
      filter: {},
    },
  });
  const [createType] = useMutation(CREATE_TYPE);
  const [updateType] = useMutation(UPDATE_TYPE);
  const [form] = Form.useForm();
  const [data, setData] = useState<Item[]>();
  const [editingKey, setEditingKey] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ name: "", ...record });
    setEditingKey(record.key);
  };

  useEffect(() => {
    if (!loading && typeData) {
      setData(preparedData(typeData.allTypes));
    }
  }, [loading, typeData]);

  const cancel = () => {
    setEditingKey("");
  };

  const handleOk = (newType: string) => {
    console.log(newType);
    try {
      createType({
        variables: {
          name: newType,
        },
        refetchQueries: [TYPE_LIST, "allTypes"],
      });
      setIsModalVisible(false);
      return succesMessage("Type was created");
    } catch (error) {
      setIsModalVisible(false);
      return errorMessage(`${error}`);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const typeUpdate = (newData: Item[]) => {
    let [{ name, key }] = newData;
    try {
      updateType({
        variables: {
          id: key,
          name,
        },
        refetchQueries: [TYPE_LIST, "allTypes"],
      });
      return succesMessage("Type updated");
    } catch (error) {
      return errorMessage(`${error}`);
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
        typeUpdate(newData);
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

  if (loading)
    return (
      <Row justify="center" align="middle" style={{ minHeight: "100%" }}>
        <Spin />
      </Row>
    );
  if (error) return <p>Error </p>;
  const columns = [
    {
      width: "1%",
      title: () => {
        return (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => setIsModalVisible(true)}
          >
            <PlusOutlined style={{ fontSize: "1.5rem" }} />
          </Typography.Link>
        );
      },
      dataIndex: "create",
    },
    {
      title: "Name",
      dataIndex: "name",
      editable: true,
    },
    {
      dataIndex: "operation",
      width: "6%",
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
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          pagination={{
            onChange: cancel,
          }}
          columns={mergedColumns}
        />
      </Form>
      <ModalCreateType
        isModalVisible={isModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
      <BackTop />
    </>
  );
};
