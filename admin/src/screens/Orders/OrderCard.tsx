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
import { BRAND_LIST_OF_TYPE } from "../Brands/brand-gql";
import { MODEL_LIST } from "../Models/model-gql";
import { TYPE_LIST } from "../Types/type-qls";
import { ORDER, UPDATE_ORDER } from "./order-qgl";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const { TextArea } = Input;

const { Title, Paragraph } = Typography;
const { Option } = Select;

const styleTag = {
  fontSize: "16px",
};

const coloredTags = (value: string) => {
  let color;
  if (value === "PROCESSING") {
    color = "orange";
  }
  if (value === "SENT") {
    color = "blue";
  }
  if (value === "DONE") {
    color = "green";
  }
  if (value === "ANALOGUE") {
    color = "purple";
  }
  if (value === "ORIGINAL") {
    color = "lime";
  }
  return (
    <Tag style={styleTag} color={color} key={value}>
      <strong>{value.toLowerCase()}</strong>
    </Tag>
  );
};

export const OrderCard = ({
  data,
  cardContent,
  statuses,
  transmissions,
  partTypes,
  driveTypes,
  bodyTypes,
  fuelTypes,
}: {
  data: Record<string, any>;
  cardContent: Record<string, any>;
  statuses: Record<string, any>[];
  transmissions: Record<string, any>[];
  partTypes: Record<string, any>[];
  driveTypes: Record<string, any>[];
  bodyTypes: Record<string, any>[];
  fuelTypes: Record<string, any>[];
}) => {
  const [carPart, setCarPart] = useState(data.Order.carPart);
  const [saveButtonState, setSaveButtonState] = useState(true);
  const [cancelButtonState, setCancelButtonState] = useState(true);
  const [status, setStatus] = useState(data.Order.status);
  const [transmission, setTransmission] = useState(data.Order.transmission);
  const [partType, setTypePart] = useState(data.Order.partOfType);
  const [bodyType, setBodyType] = useState(data.Order.bodyType);
  const [driveType, setDriveType] = useState(data.Order.drive);
  const [fuelType, setFuelType] = useState(data.Order.fuel);
  const [comment, setComment] = useState(data.Order.comment);
  const [engineVolume, setEngineVolume] = useState(
    Number(data.Order.engineVolume)
  );
  const [type, setType] = useState({
    name: data.Order.model.type.name,
    id: data.Order.model.type.id,
    isOpen: false,
  });
  const [brand, setBrand] = useState({
    name: data.Order.model.brand.name,
    id: data.Order.model.brand.id,
    isOpen: false,
  });
  const [model, setModel] = useState({
    name: data.Order.model.name,
    id: data.Order.model.id,
    isOpen: false,
  });
  const [updateOrder] = useMutation(UPDATE_ORDER);
  const { loading: typeLoading, data: typeData } = useQuery(TYPE_LIST, {
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
  } = useQuery(MODEL_LIST, {
    variables: {
      page: 0,
      perPage: 100,
      sortField: "id",
      sortOrder: "asc",
      filter: {
        brandId: data.Order.model.brand.id,
        typeId: data.Order.model.type.id,
        q: "",
      },
    },
  });
  const {
    loading: brandLoading,
    data: brandData,
    refetch: brandRefetch,
  } = useQuery(BRAND_LIST_OF_TYPE, {
    variables: {
      page: 0,
      perPage: 100,
      filter: {
        q: "",
        typeId: data.Order.model.type.id,
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
  }, [comment]);

  const saveComment = () => {
    updateOrder({
      variables: {
        id: data.Order.id,
        updateOrderInput: {
          comment: comment,
        },
      },
    });
  };

  const statusMenu = (
    <Menu onClick={(v) => setStatus(v.key)}>
      {statuses.map((data) => {
        return <Menu.Item key={data.name}>{coloredTags(data.name)}</Menu.Item>;
      })}
    </Menu>
  );

  const bodyTypeMenu = (
    <Menu onClick={(v) => setBodyType(v.key)}>
      {bodyTypes.map((data) => {
        return <Menu.Item key={data.name}>{coloredTags(data.name)}</Menu.Item>;
      })}
    </Menu>
  );

  const transmissionMenu = (
    <Menu onClick={(v) => setTransmission(v.key)}>
      {transmissions.map((data) => {
        return <Menu.Item key={data.name}>{coloredTags(data.name)}</Menu.Item>;
      })}
    </Menu>
  );

  const partTypeMenu = (
    <Menu onClick={(v) => setTypePart(v.key)}>
      {partTypes.map((data) => {
        return <Menu.Item key={data.name}>{coloredTags(data.name)}</Menu.Item>;
      })}
    </Menu>
  );
  const driveTypeMenu = (
    <Menu onClick={(v) => setDriveType(v.key)}>
      {driveTypes.map((data) => {
        return <Menu.Item key={data.name}>{coloredTags(data.name)}</Menu.Item>;
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
          id: data.Order.id,
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
        refetchQueries: [ORDER, "Order"],
      });
      setCancelButtonState(true);
      setSaveButtonState(true);
      return succesMessage("Order updated");
    } catch (error) {
      return errorMessage(`${error}`);
    }
  };

  const cancelChanges = () => {
    setCarPart(data.Order.carPart);
    setStatus(data.Order.status);
    setTransmission(data.Order.transmission);
    setTypePart(data.Order.partOfType);
    setBodyType(data.Order.bodyType);
    setDriveType(data.Order.drive);
    setFuelType(data.Order.fuel);
    setComment(data.Order.comment);
    setEngineVolume(Number(data.Order.engineVolume));
    setType({
      name: data.Order.model.type.name,
      id: data.Order.model.type.id,
      isOpen: false,
    });
    setBrand({
      name: data.Order.model.brand.name,
      id: data.Order.model.brand.id,
      isOpen: false,
    });
    setModel({
      name: data.Order.model.name,
      id: data.Order.model.id,
      isOpen: false,
    });
    return succesMessage("Chages was discard");
  };

  const arraysEqual = (a1: Array<any>, a2: Array<any>) => {
    console.log(JSON.stringify(a1) == JSON.stringify(a2));
    return JSON.stringify(a1) == JSON.stringify(a2);
  };

  const changeButtonState = () => {
    if (carPart.length !== 0 && carPart !== data.Order.carPart) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (type.id.length !== 0 && type.id !== data.Order.model.type.id) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (
      brand.id.length !== 0 &&
      brand.id !== data.Order.model.brand.id
    ) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (model.id.length !== 0 && model.id !== data.Order.model.id) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (status !== data.Order.status) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (transmission !== data.Order.transmission) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (partType !== data.Order.partOfType) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (bodyType !== data.Order.bodyType) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (driveType !== data.Order.drive) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (
      fuelType !== data.Order.fuel &&
      !arraysEqual(fuelType, data.Order.fuel)
    ) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (engineVolume !== Number(data.Order.engineVolume)) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (comment !== data.Order.comment) {
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
    const typeFromValue = getDataFromValue(typeData.allTypes, value);
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
    const modelFromValue = getDataFromValue(modelData.allModels, value);
    setModel({
      isOpen: false,
      name: modelFromValue.name,
      id: modelFromValue.id,
    });
  };

  const getDataFromValue = (data: Record<string, any>[], value: string) => {
    const result: Record<string, any> | undefined = data.find(
      ({ id }) => id === value
    );
    if (result === undefined) throw new Error("result undefined");
    return result;
  };

  const onChangeBrandsSelect = (value: string) => {
    const brandFromValue = getDataFromValue(brandData.allBrandsOfType, value);
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
          Car part:{" "}
        </Title>
        <Paragraph
          copyable
          style={{ display: "inline", fontSize: "18px" }}
          editable={{
            onChange: updateCarPart,
          }}
        >
          {carPart}
        </Paragraph>
      </Card.Grid>

      <Card.Grid style={cardContent} hoverable={false}>
        <Title style={{ display: "inline" }} level={5}>
          Type:{" "}
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
          Brand:{" "}
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
          Model:{" "}
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
          Status:{" "}
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
          Transmission:{" "}
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
          Type Part:{" "}
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
          Body Type:{" "}
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
          Drive:{" "}
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
          Fuel type:{" "}
          <Select
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
          Engine volume:{" "}
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
          Created at:{" "}
        </Title>
        <Tag>
          <strong>
            {new Date(data.Order.createdAt).toLocaleDateString("ua-UA")}
          </strong>
        </Tag>
      </Card.Grid>

      <Card.Grid style={cardContent} hoverable={false}>
        <Title style={{ display: "inline" }} level={5}>
          Comment about current order:{" "}
        </Title>
        <ReactQuill
          theme="snow"
          value={comment}
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
          Cancel
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
          Save
        </Button>
      </Card.Grid>
    </Card>
  );
};
