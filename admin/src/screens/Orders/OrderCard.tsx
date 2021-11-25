import { MouseEventHandler, useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
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
  BodyType,
  Brand,
  DriveType,
  FuelType,
  Model,
  Order,
  OrderStatus,
  PartType,
  Transmission,
  Type,
  useAllBrandsOfTypeQuery,
  useAllModelsQuery,
  useAllTypesQuery,
  useUpdateOrderMutation,
} from "../../generated/graphql";

const { TextArea } = Input;

const { Title, Paragraph } = Typography;
const { Option } = Select;

export const OrderCard = ({
  data,
  cardContent,
}: {
  data: Order;
  cardContent: Record<string, any>;
}) => {
  const [carPart, setCarPart] = useState(data.carPart);
  const [saveButtonState, setSaveButtonState] = useState(true);
  const [cancelButtonState, setCancelButtonState] = useState(true);
  const [status, setStatus] = useState<OrderStatus>(data.status);
  const [transmission, setTransmission] = useState<Transmission>(
    data.transmission
  );
  const [partType, setTypePart] = useState<PartType>(data.partOfType);
  const [bodyType, setBodyType] = useState<BodyType>(data.bodyType);
  const [driveType, setDriveType] = useState<DriveType>(data.drive);
  const [fuelType, setFuelType] = useState<FuelType[]>(data.fuel);
  const [comment, setComment] = useState(data.comment);
  const [engineVolume, setEngineVolume] = useState(Number(data.engineVolume));

  const [type, setType] = useState({
    name: data.model.type.name,
    id: data.model.type.id,
    isOpen: false,
  });

  const [brand, setBrand] = useState({
    name: data.model.brand.name,
    id: data.model.brand.id,
    isOpen: false,
  });

  const [model, setModel] = useState({
    name: data.model.name,
    id: data.model.id,
    isOpen: false,
  });

  const [updateOrder] = useUpdateOrderMutation();
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
        brandId: data.model.brand.id,
        typeId: data.model.type.id,
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
        typeId: data.model.type.id,
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

  const optionsForTagRender = (data: string[]) => {
    return data.map((data: string) => ({ value: data.toUpperCase() }));
  };

  const coloredArrayTags = (
    onPreventMouseDown: MouseEventHandler<HTMLSpanElement>,
    value: string,
    closable: boolean | undefined
  ) => {
    let color;
    if (value === "DIESEL") {
      color = "geekblue";
    }
    if (value === "ELECTRO") {
      color = "green";
    }
    if (value === "GASOLINE") {
      color = "volcano";
    }
    if (value === "HYBRID") {
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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      saveComment();
    }, 5000);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comment]);

  const saveComment = () => {
    updateOrder({
      variables: {
        id: data.id,
        updateOrderInput: {
          comment: comment,
        },
      },
    });
  };

  const statusMenu = (
    <Menu onClick={(v) => setStatus(v.key as OrderStatus)}>
      {Object.keys(OrderStatus).map((data: string) => {
        return (
          <Menu.Item key={data.toUpperCase()}>{coloredTags(data)}</Menu.Item>
        );
      })}
    </Menu>
  );

  const bodyTypeMenu = (
    <Menu onClick={(v) => setBodyType(v.key as BodyType)}>
      {Object.keys(BodyType).map((data: string) => {
        return (
          <Menu.Item key={data.toUpperCase()}>{coloredTags(data)}</Menu.Item>
        );
      })}
    </Menu>
  );

  const transmissionMenu = (
    <Menu onClick={(v) => setTransmission(v.key as Transmission)}>
      {Object.keys(Transmission).map((data: string) => {
        return (
          <Menu.Item key={data.toUpperCase()}>{coloredTags(data)}</Menu.Item>
        );
      })}
    </Menu>
  );

  const partTypeMenu = (
    <Menu onClick={(v) => setTypePart(v.key as PartType)}>
      {Object.keys(PartType).map((data: string) => {
        return (
          <Menu.Item key={data.toUpperCase()}>{coloredTags(data)}</Menu.Item>
        );
      })}
    </Menu>
  );
  const driveTypeMenu = (
    <Menu onClick={(v) => setDriveType(v.key as DriveType)}>
      {Object.keys(DriveType).map((data: string) => {
        return (
          <Menu.Item key={data.toUpperCase()}>{coloredTags(data)}</Menu.Item>
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
    try {
      updateOrder({
        variables: {
          id: data.id,
          updateOrderInput: {
            modelId: model.id,
            carPart: carPart,
            status: status,
            transmission: transmission,
            partOfType: partType,
            bodyType: bodyType,
            drive: driveType,
            fuel: fuelType,
            comment: comment,
          },
        },
      });
      setCancelButtonState(true);
      setSaveButtonState(true);
      return succesMessage("Заказ обновлен");
    } catch (error) {
      return errorMessage(`${error}`);
    }
  };

  const cancelChanges = () => {
    setCarPart(data.carPart);
    setStatus(data.status);
    setTransmission(data.transmission);
    setTypePart(data.partOfType);
    setBodyType(data.bodyType);
    setDriveType(data.drive);
    setFuelType(data.fuel);
    setComment(data.comment);
    setEngineVolume(Number(data.engineVolume));
    setType({
      name: data.model.type.name,
      id: data.model.type.id,
      isOpen: false,
    });
    setBrand({
      name: data.model.brand.name,
      id: data.model.brand.id,
      isOpen: false,
    });
    setModel({
      name: data.model.name,
      id: data.model.id,
      isOpen: false,
    });
    return succesMessage("Изменения были сброшены");
  };

  const arraysEqual = (a1: Array<any>, a2: Array<any>) => {
    console.log(JSON.stringify(a1) === JSON.stringify(a2));
    return JSON.stringify(a1) === JSON.stringify(a2);
  };

  const changeButtonState = () => {
    if (carPart.length !== 0 && carPart !== data.carPart) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (type.id.length !== 0 && type.id !== data.model.type.id) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (brand.id.length !== 0 && brand.id !== data.model.brand.id) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (model.id.length !== 0 && model.id !== data.model.id) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (status !== data.status) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (transmission !== data.transmission) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (partType !== data.partOfType) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (bodyType !== data.bodyType) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (driveType !== data.drive) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (fuelType !== data.fuel && !arraysEqual(fuelType, data.fuel)) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (engineVolume !== Number(data.engineVolume)) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (comment !== data.comment) {
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
          {coloredTags(status)}
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
          {coloredTags(transmission)}
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
          {coloredTags(partType)}
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
          {coloredTags(bodyType)}
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
          {coloredTags(driveType)}
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
            options={optionsForTagRender(Object.keys(FuelType))}
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
          onChange={(v) => setEngineVolume(v)}
        />
      </Card.Grid>

      <Card.Grid style={cardContent} hoverable={false}>
        <Title style={{ display: "inline" }} level={5}>
          Дата заказа :{" "}
        </Title>
        <Tag>
          <strong>
            {new Date(data.createdAt).toLocaleDateString("ua-UA")}
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
            backgroundColor: "green",
            border: "none",
          }}
        >
          Сохранить
        </Button>
      </Card.Grid>
    </Card>
  );
};
