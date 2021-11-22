import React, { useEffect, useState } from "react";
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Spin, Row } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { errorMessage, succesMessage } from "../../helpres/messages";
import { debounce } from "ts-debounce";
import { TYPE_LIST, UPDATE_TYPE } from "../Types/type-qls";
import { BRAND_LIST, BRAND_UPDATE, CREATE_BRAND } from "./brand-gql";
import { computePage } from "../../helpres/pagination-helper";
import {
  CloseOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { ModalCreateBrand } from "./BrandCreateModal";

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

export const BrandTable = ({
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
    loading: brandsLoading,
    error,
    data: brandData,
    refetch,
  } = useQuery(BRAND_LIST, {
    variables: {
      page,
      perPage,
      sortField,
      sortOrder,
      filter: {},
    },
  });
  const [updateBrand] = useMutation(BRAND_UPDATE);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [createBrand] = useMutation(CREATE_BRAND);
  const [data, setData] = useState<Item[]>();
  const [searchName, setSearchName] = useState("");
  const [editingKey, setEditingKey] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ name: "", ...record });
    setEditingKey(record.key);
  };

  useEffect(() => {
    if (!brandsLoading && brandData) {
      setData(preparedData(brandData.allBrands));
    }
  }, [brandsLoading, brandData]);

  const cancel = () => {
    setEditingKey("");
  };

  const handleOk = (newBrand: string) => {
    setLoading(true);
    try {
      createBrand({
        variables: {
          name: newBrand,
        },
        refetchQueries: [BRAND_LIST, "allBrands"],
      });
      setLoading(false);
      setIsModalVisible(false);
      return succesMessage("Brand was created");
    } catch (error) {
      setLoading(false);
      setIsModalVisible(false);
      return errorMessage(`Brand create error`);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const typeUpdate = (newData: Item) => {
    let { name, key } = newData;
    setLoading(true)
    try {
      updateBrand({
        variables: {
          id: key,
          name,
        },
        refetchQueries: [BRAND_LIST, "allBrands"],
      });
      setLoading(false);
      return succesMessage("Brand updated");
    } catch (error) {
      setLoading(false);
      return errorMessage('Brand update error');
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
        typeUpdate(newData[index]);
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

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      try {
        refetch({
          filter:{
            name: searchName
          }
        }); 
        setLoading(false);
      } catch (error) {
        setLoading(false)
        errorMessage("brand search error")
      }
    }, 600);
    return () => clearTimeout(delayDebounceFn);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchName]);

  const onChangePage = (currentPage: number, pageSize?: number): void => {
    refetch({
      page: computePage(currentPage, pageSize!), //skip
      perPage: pageSize, //take
    });
  };

  if (brandsLoading) return (
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
      width: "29%",
      title: "Name",
      dataIndex: "name",
      editable: true,
      filterDropdown: () => {
        return (
          <Input
            autoFocus
            value={searchName}
            onChange={(v) => {
              setSearchName(v.target.value);
            }}
          ></Input>
        );
      },
      filterIcon: () => {
        return <SearchOutlined
        style={{
          fontSize: "1.2rem",
          color: searchName ? "yellow" : "white",
        }}
      />
      },
    },
    {
      dataIndex: "operation",
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
    <>
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
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ["10", "25", "50", "100", "200"],
            defaultPageSize: 50,
            onChange: onChangePage,
            total: brandData.allBrandsMeta.count,
          }}
          columns={mergedColumns}
        />
      </Form>
      <ModalCreateBrand
        isModalVisible={isModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
    </>
  );
};
