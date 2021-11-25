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
import { errorMessage, succesMessage } from "../../helpres/messages";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Type,
  useAllTypesQuery,
  useCreateTypeMutation,
  useUpdateTypeMutation,
} from "../../generated/graphql";
import { ModalCreateType } from "./TypeCreateModal";
import gql from "graphql-tag";

interface Item {
  key: string;
  name: string;
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
              message: `Введите ${title}!`,
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
const preparedData = (data: Array<Type>) => {
  return data.map((value: Type, i: number) => {
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
  } = useAllTypesQuery({
    variables: {
      page,
      perPage,
      sortField,
      sortOrder,
    },
  });
  const [createTypeMutation] = useCreateTypeMutation();
  const [updateTypeMutation] = useUpdateTypeMutation();
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
      setData(preparedData(typeData.allTypes as Type[]));
    }
  }, [loading, typeData]);

  const cancel = () => {
    setEditingKey("");
  };

  const handleOk = (newType: string) => {
    try {
      createTypeMutation({
        variables: {
          name: newType,
        },
        update(cache, { data: { createType } }: any) {
          cache.modify({
            fields: {
              allTypes(existingTypes = []) {
                const newTypeRef = cache.writeFragment({
                  data: createType,
                  fragment: gql`
                    fragment NewType on Type {
                      id
                      name
                    }
                  `,
                });
                return [...existingTypes, newTypeRef];
              },
            },
          });
        },
      });
      console.log(createTypeMutation);
      setIsModalVisible(false);
      return succesMessage("Тип транспорта создан");
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
      updateTypeMutation({
        variables: {
          id: key,
          name,
        },
      });
      return succesMessage("Тип транспорта обновлен");
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
      title: "Тип транспорта",
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
              Сохранить
            </a>
            <Popconfirm title="Отменить?" onConfirm={cancel}>
              <a>Отмена</a>
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
