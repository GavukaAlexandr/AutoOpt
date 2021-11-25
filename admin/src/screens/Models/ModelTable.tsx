import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Select,
  Popconfirm,
  Form,
  Typography,
  Row,
  Spin,
  BackTop,
} from "antd";
import { gql } from "@apollo/client";
import { errorMessage, succesMessage } from "../../helpres/messages";
import { computePage } from "../../helpres/pagination-helper";
import { ModalCreateModel } from "./ModelCreateModal";
import { EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Brand,
  Type,
  useAllBrandsQuery,
  useAllModelsQuery,
  useAllTypesQuery,
  useCreateModelMutation,
  useUpdateModelMutation,
} from "../../generated/graphql";
const { Option } = Select;

interface Item {
  key: string;
  name: string;
  type: string;
  brand: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "select" | "text";
  record: Item;
  index: number;
  children: React.ReactNode;
}

const preparedData = (data: any[]) => {
  return data.map((value: Record<string, any>, i: number) => {
    return {
      key: value.id,
      name: value.name,
      type: value.type.name,
      brand: value.brand.name,
    };
  });
};

export const ModelTable = ({
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
    loading: modelsLoading,
    error,
    data: modeldData,
    refetch,
  } = useAllModelsQuery({
    variables: {
      page,
      perPage,
      sortField,
      sortOrder,
      filter: {},
    },
  });

  const {
    loading: typeLoading,
    data: typeData,
    error: typeError,
  } = useAllTypesQuery({
    variables: {
      page: 0,
      perPage: 50,
      sortField: "id",
      sortOrder: "asc",
    },
  });

  const {
    loading: brandLoading,
    data: brandData,
    error: brandError,
  } = useAllBrandsQuery({
    variables: {
      sortField: "id",
      sortOrder: "asc",
      filter: {},
    },
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [createModelMutation] = useCreateModelMutation();
  const [updateModelMutation] = useUpdateModelMutation();
  const [form] = Form.useForm();
  const [data, setData] = useState<Item[]>();
  const [editingKey, setEditingKey] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchBrand, setSearchBrand] = useState("");
  const [loading, setLoading] = useState(false);
  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ name: "", brand: "", type: "", ...record });
    setEditingKey(record.key);
  };

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      try {
        refetch({
          filter: {
            q: searchName,
            brand: searchBrand,
          },
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        errorMessage("Model search error");
      }
    }, 600);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchName, searchBrand]);

  useEffect(() => {
    if (!modelsLoading && modeldData) {
      setData(preparedData(modeldData.allModels));
    }
  }, [modelsLoading, modeldData]);

  if (modelsLoading || brandLoading || typeLoading)
    return (
      <Row justify="center" align="middle" style={{ minHeight: "100%" }}>
        <Spin />
      </Row>
    );
  if (error || brandError || typeError) return <p>Error </p>;

  const cancel = () => {
    setEditingKey("");
  };

  const handleOk = (createModelInput: {
    name: string;
    brand: string;
    type: string;
  }) => {
    setLoading(true);
    const brandObject = brandData?.allBrands.find(
      ({ name }: any) => name === createModelInput.brand
    );
    const typeObject = typeData?.allTypes.find(
      ({ name }: any) => name === createModelInput.type
    );
    try {
      createModelMutation({
        variables: {
          name: createModelInput.name,
          brandId: brandObject!.id,
          typeId: typeObject!.id,
        },
        update(cache, { data: { createModel } }: any) {
          cache.modify({
            fields: {
              allModels(existingTypes = []) {
                const newModelRef = cache.writeFragment({
                  data: createModel,
                  fragment: gql`
                    fragment NewModel on Model {
                      id
                      name
                      brand {
                        id
                        name
                      }
                      type {
                        id
                        name
                      }
                    }
                  `,
                });
                return [...existingTypes, newModelRef];
              },
            },
          });
        },
      });
      setLoading(false);
      setIsModalVisible(false);
      return succesMessage("Model was created");
    } catch (error) {
      setLoading(false);
      setIsModalVisible(false);
      return errorMessage("Error Model created");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const typeUpdate = (newData: Item) => {
    setLoading(true);
    try {
      let { key, name, brand: brandName, type: typeName } = newData;
      const brand = brandData!.allBrands.find(
        ({ name }: any) => name === brandName
      );
      const type = typeData?.allTypes.find(
        ({ name }: any) => name === typeName
      );
      updateModelMutation({
        variables: {
          id: key,
          name,
          brand: brand?.id,
          type: type?.id,
        },
      });
      setLoading(false);
      return succesMessage("Model updated");
    } catch (error) {
      setLoading(false);
      return errorMessage("Error Model Update");
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

  const onChangePage = (currentPage: number, pageSize?: number): void => {
    setLoading(true);
    try {
      refetch({
        page: computePage(currentPage, pageSize!), //skip
        perPage: pageSize, //take
      });
      setLoading(false);
    } catch (error) {
      errorMessage("Error Model Pagination");
      setLoading(false);
    }
  };

  const preparedDataToSelect = (data: Brand[] | Type[]) => {
    return data.map((v) => {
      return {
        id: v.id,
        name: v.name,
      };
    });
  };

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
    let inputNode: any;
    if (inputType === "select" && dataIndex === "type") {
      inputNode = (
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="Change a type"
          optionFilterProp="children"
        >
          {preparedDataToSelect(typeData?.allTypes as Brand[]).map((v) => {
            return (
              <Option key={v.id} value={v.name}>
                {v.name}
              </Option>
            );
          })}
        </Select>
      );
    } else if (inputType === "select" && dataIndex === "brand") {
      inputNode = (
        <Select showSearch style={{ width: 200 }} optionFilterProp="children">
          {preparedDataToSelect(typeData?.allTypes as Brand[]).map((v) => {
            return (
              <Option key={v.id} value={v.name}>
                {v.name}
              </Option>
            );
          })}
        </Select>
      );
    } else {
      inputNode = <Input />;
    }
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
        return (
          <SearchOutlined
            style={{
              fontSize: "1.2rem",
              color: searchName ? "yellow" : "white",
            }}
          />
        );
      },
    },
    {
      title: "Brand",
      dataIndex: "brand",
      editable: true,
      filterDropdown: () => {
        return (
          <Input
            autoFocus
            value={searchBrand}
            onChange={(v) => {
              setSearchBrand(v.target.value);
            }}
          ></Input>
        );
      },
      filterIcon: () => {
        return (
          <SearchOutlined
            style={{
              fontSize: "1.2rem",
              color: searchBrand ? "yellow" : "white",
            }}
          />
        );
      },
    },
    {
      title: "Type",
      dataIndex: "type",
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
        inputType:
          col.dataIndex === "brand" || col.dataIndex === "type"
            ? "select"
            : "text",
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
            total: modeldData?.allModelsMeta.count as number,
          }}
          columns={mergedColumns}
        />
      </Form>
      <ModalCreateModel
        brandData={preparedDataToSelect(brandData?.allBrands as Brand[])}
        typeData={preparedDataToSelect(typeData?.allTypes as Type[])}
        isModalVisible={isModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
      <BackTop />
    </>
  );
};
