import { MouseEventHandler, useEffect, useState } from "react";
import {
  Card,
  Select,
  Tag,
  Typography,
  Input,
  Spin,
  Button,
  Menu,
  Dropdown,
  InputNumber,
} from "antd";
import { debounce } from "ts-debounce";
import { errorMessage, succesMessage } from "../../helpres/messages";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { coloredTags } from "../../helpres/ColoredTags";
import {
  Brand,
  Model,
  Order,
  Type,
  useAllBrandsOfTypeQuery,
  useAllModelsQuery,
  useAllTypesQuery,
  useCreateOrderMutation,
  useUpdateUserCarParamsMutation,
} from "../../generated/graphql";
import gql from "graphql-tag";

const { TextArea } = Input;

const { Title, Paragraph } = Typography;
const { Option } = Select;

export const OrderCard = ({
  cardContent,
  order,
  orderStatuses,
  transmissions,
  fuelTypes,
  bodyTypes,
  driveTypes,
  partTypes,
}: {
  cardContent: Record<string, any>;
  order: Order;
  orderStatuses: Record<string, any>[]
  transmissions: Record<string, any>[]
  fuelTypes: Record<string, any>[]
  bodyTypes: Record<string, any>[]
  driveTypes: Record<string, any>[]
  partTypes: Record<string, any>[]
}) => {
  const [carPart, setCarPart] = useState(order.carPart);
  const [saveButtonState, setSaveButtonState] = useState(true);
  const [cancelButtonState, setCancelButtonState] = useState(true);
  const [status, setStatus] = useState(order.status);
  const [transmission, setTransmission] = useState(order.transmission);
  const [partType, setTypePart] = useState(order.partOfType);
  const [bodyType, setBodyType] = useState(order.bodyType);
  const [driveType, setDriveType] = useState(order.drive);
  const [fuelType, setFuelType] = useState(order.fuels.map(v => v.name));
  const [comment, setComment] = useState(order.comment);
  const [engineVolume, setEngineVolume] = useState(Number(order.engineVolume));
  const [type, setType] = useState({
    name: order.model.type.name,
    id: order.model.type.id,
    isOpen: false,
  });

  const [brand, setBrand] = useState({
    name: order.model.brand.name,
    id: order.model.brand.id,
    isOpen: false,
  });

  const [model, setModel] = useState({
    name: order.model.name,
    id: order.model.id,
    isOpen: false,
  });

  const [createOrder] = useCreateOrderMutation();
  const [updateUserCarParams] = useUpdateUserCarParamsMutation();

  const { loading: typeLoading, data: typeData } = useAllTypesQuery({
    variables: {
      page: 0,
      perPage: 100,
      sortField: "id",
      sortOrder: "asc",
    },
  });

  const {
    loading: modelLoading,
    data: modelData,
    refetch: modelRefetch,
  } = useAllModelsQuery({
    variables: {
      page: 0,
      perPage: 100,
      sortField: "id",
      sortOrder: "asc",
      filter: {
        brandId: order.model.brand.id,
        typeId: order.model.type.id,
        q: "",
      },
    },
  });

  const {
    loading: brandLoading,
    data: brandData,
    refetch: brandRefetch,
  } = useAllBrandsOfTypeQuery({
    variables: {
      page: 0,
      perPage: 100,
      filter: {
        q: "",
        typeId: order.model.type.id,
      },
    },
  });

  const fuelTagRender = (props: any) => {
    const { value, closable } = props;
    const onPreventMouseDown = (event: {
      preventDefault: () => void;
      stopPropagation: () => void;
    }) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return coloredArrayTags(onPreventMouseDown, value, closable);
  };

  const optionsForTagRender = (data: Record<string, any>[]) => {
    return data.map((data: Record<string, any>) => ({ value: data.name }));
  };

  const coloredArrayTags = (
    onPreventMouseDown: MouseEventHandler<HTMLSpanElement>,
    value: string,
    closable: boolean | undefined
  ) => {
    let color;
    if (value === "diesel") {
      color = "geekblue";
    }
    if (value === "electro") {
      color = "green";
    }
    if (value === "gasoline") {
      color = "volcano";
    }
    if (value === "hybrid") {
      color = "cyan";
    }
    return (
      <Tag
        color={color}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        style={{ marginRight: 3 }}
        onClose={() =>
          setFuelType(fuelType.filter((fuel: string) => fuel !== value))
        }
        key={value}
      >
        {value.toLowerCase()}
      </Tag>
    );
  };

  // useEffect(() => {
  //   const delayDebounceFn = setTimeout(() => {
  //     saveComment();
  //   }, 5000);
  //   return () => clearTimeout(delayDebounceFn);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [comment]);

  // const saveComment = () => {
  //   updateOrder({
  //     variables: {
  //       updateOrderInput: {
  //         id: order.id,
  //         comment: comment,
  //       },
  //     },
  //   });
  // };

  const statusMenu = (
    <Menu onClick={(v) => {
      const arrayOfStatus: Record<string, any>[] = orderStatuses.filter(value => value.id == v.key) as Record<string, any>[];
      const [{ id, name }] = arrayOfStatus;
      setStatus({ id, name })
    }}>
      {orderStatuses.map((data) => {
        return (
          <Menu.Item key={data.id}>{coloredTags(data.name)}</Menu.Item>
        );
      })}
    </Menu>
  );

  const bodyTypeMenu = (
    <Menu onClick={(v) => {
      const arrayOfBodyTypes: Record<string, any>[] = bodyTypes.filter(value => value.id == v.key) as Record<string, any>[];
      const [{ id, name }] = arrayOfBodyTypes;
      setBodyType({ id, name })
    }}>
      {bodyTypes.map((data) => {
        return (
          <Menu.Item key={data.id}>{coloredTags(data.name)}</Menu.Item>
        );
      })}
    </Menu>
  );

  const transmissionMenu = (
    <Menu onClick={(v) => {
      const arrayOfTransmissions: Record<string, any>[] = transmissions.filter(value => value.id == v.key) as Record<string, any>[];
      const [{ id, name }] = arrayOfTransmissions;
      setTransmission({ id, name })
    }}>
      {transmissions.map((data) => {
        return (
          <Menu.Item key={data.id}>{coloredTags(data.name)}</Menu.Item>
        );
      })}
    </Menu>
  );

  const partTypeMenu = (
    <Menu onClick={(v) => {
      const arrayOfPartTypes: Record<string, any>[] = partTypes.filter(value => value.id == v.key) as Record<string, any>[];
      const [{ id, name }] = arrayOfPartTypes;
      setTypePart({ id, name })
    }}>
      {partTypes.map((data) => {
        return (
          <Menu.Item key={data.id}>{coloredTags(data.name)}</Menu.Item>
        );
      })}
    </Menu>
  );

  const driveTypeMenu = (
    <Menu onClick={(v) => {
      const arrayOfDriveTypes: Record<string, any>[] = driveTypes.filter(value => value.id == v.key) as Record<string, any>[];
      const [{ id, name }] = arrayOfDriveTypes;
      setDriveType({ id, name })
    }}>
      {driveTypes.map((data) => {
        return (
          <Menu.Item key={data.id}>{coloredTags(data.name)}</Menu.Item>
        );
      })}
    </Menu>
  );

  const updateCarPart = (value: string) => {
    if (value === carPart) return;
    if (value.length !== 0 && value !== carPart) {
      setCarPart(value);
    } else {
      return errorMessage("Uncorrect Fields");
    }
  };

  const saveData = () => {
    const fuels = fuelType.map(fuel => {
      return fuelTypes.find(v => v.name === fuel)
    })
    const fuelIds = fuels.map(v => v?.id)
    try {
      createOrder({
        variables: {
          createOrderInput: {
            orderNumber: order.orderNumber,
            status: status.id,
            comment: comment,
            bodyTypeId: bodyType.id,
            carPart: carPart,
            driveTypeId: driveType.id,
            engineVolume: engineVolume.toString(),
            modelId: model.id,
            partTypeId: partType.id,
            transmissionId: transmission.id,
            userCarParamId: order.userCarParamId,
            userId: order.user.id,
            vin: order.vin,
            year: order.year,
            fuelId: fuelIds
          },
        },
        update(cache, { data: { createOrder } }: any) {
          cache.modify({
            fields: {
              allOrders(existingOrdersRefs = [], { readField }) {
                const indexOrder = existingOrdersRefs.findIndex(
                  (orderNumber: any) => {
                    console.log(readField('orderNumber', orderNumber));
                    return order.orderNumber === readField('orderNumber', orderNumber)
                  },
                );
                const newTypeRef = cache.writeFragment({
                  data: createOrder,
                  fragment: gql`
                    fragment NewOrder on Order {
                      id
                    }`,
                });
                let prepared = [...existingOrdersRefs];
                prepared.splice(indexOrder, 1, newTypeRef);
                existingOrdersRefs = [...prepared];
                return existingOrdersRefs;
              },
            },
          });
        },

      });
      setCancelButtonState(true);
      setSaveButtonState(true);
      return succesMessage("Заказ обновлен");
    } catch (error) {
      return errorMessage(`${error}`);
    }
  };

  const saveForUserToo = () => {
    const fuels = fuelType.map(fuel => {
      return fuelTypes.find(v => v.name === fuel)
    })
    const fuelIds = fuels.map(v => v?.id)
    try {
      updateUserCarParams({
        variables: {
          updateUserCarParamsInput: {
            id: order.userCarParamId,
            fuel: fuelIds,
            transmission: transmission.id,
            bodyType: bodyType.id,
            carPart: carPart,
            drive: driveType.id,
		        engineVolume: engineVolume.toString(),
            modelId: model.id,
            partOfType: partType.id,
            vin: order.vin,
            year: order.year
          }
        }
      })
    } catch (error) {
      return errorMessage(`${error}`);
    } 
      saveData();
  }

  const cancelChanges = () => {
    setCarPart(carPart);
    setStatus(status);
    setTransmission(order.transmission);
    setTypePart(order.partOfType);
    setBodyType(order.bodyType);
    setDriveType(order.drive);
    setFuelType(order.fuels.map(v => v.name));
    setComment(comment);
    setEngineVolume(Number(order.engineVolume));
    setType({
      name: order.model.type.name,
      id: order.model.type.id,
      isOpen: false,
    });
    setBrand({
      name: order.model.brand.name,
      id: order.model.brand.id,
      isOpen: false,
    });
    setModel({
      name: order.model.name,
      id: order.model.id,
      isOpen: false,
    });
    return succesMessage("Изменения были сброшены");
  };

  const arraysEqual = (a1: Array<any>, a2: Array<any>) => {
    return JSON.stringify(a1) === JSON.stringify(a2);
  };

  const changeButtonState = () => {
    const fuels = order.fuels.map(v => v.name);
    if (carPart.length !== 0 && carPart !== order.carPart) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (type.id.length !== 0 && type.id !== order.model.type.id) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (brand.id.length !== 0 && brand.id !== order.model.brand.id) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (model.id.length !== 0 && model.id !== order.model.id) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (status !== order.status) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    }
    else if (transmission !== order.transmission) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (partType !== order.partOfType) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (bodyType !== order.bodyType) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (driveType !== order.drive) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (fuelType !== fuels && !arraysEqual(fuelType, fuels)) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (engineVolume !== Number(order.engineVolume)) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    }
    else if (comment !== order.comment) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    }
    setCancelButtonState(true);
    return setSaveButtonState(true);
  };

  useEffect(() => {
    changeButtonState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    carPart,
    type,
    brand,
    model,
    status,
    transmission,
    partType,
    bodyType,
    driveType,
    fuelType,
    engineVolume,
    comment,
  ]);

  const onChangeTypesSelect = (value: string) => {
    const typeFromValue = getDataFromValue(typeData?.allTypes as Type[], value);
    setType({ isOpen: false, name: typeFromValue.name, id: typeFromValue.id });
    setBrand({ isOpen: true, name: "", id: "" });
    setModel({ isOpen: false, name: "", id: "" });
    try {
      brandRefetch({
        filter: {
          typeId: value,
          q: "",
        },
      });
    } catch (error) {
      return errorMessage(`${error}`);
    }
  };
  const onChangeModelsSelect = (value: any) => {
    const modelFromValue = getDataFromValue(
      modelData?.allModels as Model[],
      value
    );
    setModel({
      isOpen: false,
      name: modelFromValue.name,
      id: modelFromValue.id,
    });
  };

  const getDataFromValue = (data: any[], value: string) => {
    const result: Record<string, any> | undefined = data.find(
      ({ id }) => id === value
    );
    if (result === undefined) throw new Error("result undefined");
    return result;
  };

  const onChangeBrandsSelect = (value: string) => {
    const brandFromValue = getDataFromValue(
      brandData?.allBrandsOfType as Brand[],
      value
    );
    setBrand({
      isOpen: false,
      name: brandFromValue.name,
      id: brandFromValue.id,
    });
    setModel({ isOpen: true, name: "", id: "" });
    try {
      modelRefetch({
        filter: {
          typeId: type.id,
          brandId: brandFromValue!.id,
          q: "",
        },
      });
    } catch (error) {
      return errorMessage(`${error}`);
    }
  };

  const onSearchModelsSelect = (val: string) => {
    modelRefetch({
      filter: {
        brandId: brand.id,
        typeId: type.id,
        q: val,
      },
    });
  };

  const onSearchBrandsSelect = (val: string) => {
    brandRefetch({
      filter: {
        typeId: type.id,
        q: val,
      },
    });
  };

  const preparedDataToSelect = (data: Record<string, any>[]) => {
    return data.map((v) => {
      return {
        id: v.id,
        name: v.name,
      };
    });
  };

  return (
    <Card className="card-style">
      <Card.Grid
        style={{
          textAlign: "center",
          width: "100%",
          paddingBottom: "0",
          paddingTop: "1rem",
        }}
        hoverable={false}
      >
        <Title level={3}>Order</Title>
      </Card.Grid>
      <Card.Grid
        style={{ ...cardContent, paddingTop: "1rem" }}
        hoverable={false}
      >
        <Title style={{ display: "inline" }} level={4}>
          Запчасть:{" "}
        </Title>
        <Paragraph
          copyable
          style={{ display: "inline" }}
          editable={{
            onChange: updateCarPart,
          }}
        >
          {carPart}
        </Paragraph>
      </Card.Grid>

      <Card.Grid style={cardContent} hoverable={false}>
        <Title style={{ display: "inline" }} level={5}>
          Тип транспорта:{" "}
        </Title>

        {!type.isOpen ? (
          <Tag
            onClick={() => {
              setType((prevState) => ({
                ...prevState,
                isOpen: true,
              }));
            }}
          >
            {type.name}
          </Tag>
        ) : !typeLoading && typeData ? (
          <Select
            showSearch
            open={type.isOpen}
            autoFocus={type.isOpen}
            onBlur={() => {
              setType((prevState) => ({
                ...prevState,
                isOpen: false,
              }));
            }}
            style={{ width: 200 }}
            placeholder="Change a type"
            optionFilterProp="children"
            onChange={onChangeTypesSelect}
            value={type.id}
          >
            {preparedDataToSelect(typeData.allTypes).map((v) => {
              return (
                <Option key={v.id} value={v.id}>
                  {v.name}
                </Option>
              );
            })}
          </Select>
        ) : (
          <Spin />
        )}
      </Card.Grid>

      <Card.Grid style={cardContent} hoverable={false}>
        <Title style={{ display: "inline" }} level={5}>
          Бренд:{" "}
        </Title>
        {!brand.isOpen ? (
          <Tag
            onClick={() => {
              setBrand((prevState) => ({
                ...prevState,
                isOpen: true,
              }));
            }}
          >
            {brand.name}
          </Tag>
        ) : !brandLoading && brandData ? (
          <Select
            showSearch
            open={brand.isOpen}
            autoFocus={brand.isOpen}
            onBlur={() => {
              setBrand((prevState) => ({
                ...prevState,
                isOpen: false,
              }));
            }}
            style={{ width: 200 }}
            placeholder="Change a brand"
            optionFilterProp="children"
            onChange={debounce(onChangeBrandsSelect, 400)}
            onSearch={onSearchBrandsSelect}
            value={brand.id}
          >
            {preparedDataToSelect(brandData.allBrandsOfType).map((v) => {
              return (
                <Option key={v.id} value={v.id}>
                  {v.name}
                </Option>
              );
            })}
          </Select>
        ) : (
          <Spin />
        )}
      </Card.Grid>

      <Card.Grid style={cardContent} hoverable={false}>
        <Title style={{ display: "inline" }} level={5}>
          Модель:{" "}
        </Title>
        {!model.isOpen ? (
          <Tag
            onClick={() => {
              setModel((prevState) => ({
                ...prevState,
                isOpen: true,
              }));
            }}
          >
            {model.name}
          </Tag>
        ) : !modelLoading && modelData ? (
          <Select
            showSearch
            open={model.isOpen}
            autoFocus={model.isOpen}
            onBlur={() => {
              setModel((prevState) => ({
                ...prevState,
                isOpen: false,
              }));
            }}
            style={{ width: 200 }}
            placeholder="Change a Model"
            optionFilterProp="children"
            onSearch={debounce(onSearchModelsSelect, 400)}
            onChange={onChangeModelsSelect}
            value={model.id}
          >
            {preparedDataToSelect(modelData.allModels).map((v) => {
              return (
                <Option key={v.id} value={v.id}>
                  {v.name}
                </Option>
              );
            })}
          </Select>
        ) : (
          <Spin />
        )}
      </Card.Grid>

      <Card.Grid style={cardContent} hoverable={false}>
        <Title style={{ display: "inline" }} level={5}>
          Статус:{" "}
        </Title>
        <Dropdown
          overlay={statusMenu}
          trigger={["click"]}
          placement="bottomCenter"
        >
          {coloredTags(status.name)}
        </Dropdown>
      </Card.Grid>

      <Card.Grid style={cardContent} hoverable={false}>
        <Title style={{ display: "inline" }} level={5}>
          Коробка передач :{" "}
        </Title>
        <Dropdown
          overlay={transmissionMenu}
          trigger={["click"]}
          placement="bottomCenter"
        >
          {coloredTags(transmission.name)}
        </Dropdown>
      </Card.Grid>

      <Card.Grid style={cardContent} hoverable={false}>
        <Title style={{ display: "inline" }} level={5}>
          Тип запчасти:{" "}
        </Title>
        <Dropdown
          overlay={partTypeMenu}
          trigger={["click"]}
          placement="bottomCenter"
        >
          {coloredTags(partType.name)}
        </Dropdown>
      </Card.Grid>

      <Card.Grid style={cardContent} hoverable={false}>
        <Title style={{ display: "inline" }} level={5}>
          Кузов:{" "}
        </Title>
        <Dropdown
          overlay={bodyTypeMenu}
          trigger={["click"]}
          placement="bottomCenter"
        >
          {coloredTags(bodyType.name)}
        </Dropdown>
      </Card.Grid>

      <Card.Grid style={cardContent} hoverable={false}>
        <Title style={{ display: "inline" }} level={5}>
          Привод:{" "}
        </Title>
        <Dropdown
          overlay={driveTypeMenu}
          trigger={["click"]}
          placement="bottomCenter"
        >
          {coloredTags(driveType.name)}
        </Dropdown>
      </Card.Grid>
      <Card.Grid style={cardContent} hoverable={false}>
        <Title style={{ display: "inline" }} level={5}>
          Тип топлива:{" "}
          <Select
            style={{ minWidth: "100px" }}
            mode="multiple"
            showArrow
            tagRender={fuelTagRender}
            value={fuelType}
            onChange={(v) => setFuelType(v)}
            options={optionsForTagRender(fuelTypes)}
          />
        </Title>
      </Card.Grid>

      <Card.Grid style={cardContent} hoverable={false}>
        <Title style={{ display: "inline" }} level={5}>
          Объем двигателя:{" "}
        </Title>
        <InputNumber
          min={0.1}
          size="large"
          value={engineVolume}
          precision={1}
          step={0.1}
          max={100}
          onChange={(v) => {
            setEngineVolume(Number(v));
            console.log(typeof v)
          }}
        />
      </Card.Grid>

      <Card.Grid style={cardContent} hoverable={false}>
        <Title style={{ display: "inline" }} level={5}>
          Дата заказа :{" "}
        </Title>
        <Tag>
          <strong>
            {new Date(order.createdAt).toLocaleDateString("ua-UA")}
          </strong>
        </Tag>
      </Card.Grid>

      <Card.Grid style={cardContent} hoverable={false}>
        <Title style={{ display: "inline" }} level={5}>
          Комментарий о текущем заказе:{" "}
        </Title>
        <ReactQuill
          theme="snow"
          value={comment as string}
          onChange={(v) => setComment(v)}
        />
      </Card.Grid>

      <Card.Grid style={{ textAlign: "end", ...cardContent }} hoverable={false}>
        <Button
          type="primary"
          size="large"
          disabled={cancelButtonState}
          onClick={cancelChanges}
          style={{
            paddingLeft: "1rem",
            paddingRight: "1rem",
            marginRight: "1rem",
            backgroundColor: "red",
            border: "none",
          }}
        >
          Отмена
        </Button>
        <Button
          type="primary"
          size="large"
          disabled={saveButtonState}
          onClick={saveData}
          style={{
            paddingLeft: "1rem",
            paddingRight: "1rem",
            marginRight: "1rem",
            backgroundColor: "green",
            border: "none",
          }}
        >
          Сохранить
        </Button>
         <Button
          type="primary"
          size="large"
          disabled={saveButtonState}
          onClick={saveForUserToo}
          style={{
            paddingLeft: "1rem",
            paddingRight: "1rem",
            backgroundColor: "green",
            border: "none",
          }}
        >
          Сохранить и применить
        </Button>
      </Card.Grid>
    </Card>
  );
};
