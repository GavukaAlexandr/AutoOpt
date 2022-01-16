import { Modal, Input, Typography, Row, Col, Select } from "antd";
import { useState } from "react";
const { Option } = Select;

export const ModalCreateModel = ({
  brandData,
  typeData,
  isModalVisible,
  handleOk,
  handleCancel,
}: {
  brandData: Record<string, any>[];
  typeData: Record<string, any>[];
  isModalVisible: boolean;
  handleOk: (createModelInput: {
    name: string;
    brand: string;
    type: string;
  }) => void;
  handleCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}) => {
  const [createModelInput, setCreateModelInput] = useState({
    name: "",
    brand: "",
    type: "",
  });

  return (
    <Modal
      title="Create Model"
      visible={isModalVisible}
      okButtonProps={{
        disabled:
          createModelInput.name.length !== 0 &&
          createModelInput.brand.length !== 0 &&
          createModelInput.type.length !== 0
            ? false
            : true,
      }}
      onOk={() => {
        handleOk(createModelInput);
        return setCreateModelInput({ name: "", brand: "", type: "" });
      }}
      onCancel={handleCancel}
    >
      <Content
        brandData={brandData}
        typeData={typeData}
        setCreateModelInput={setCreateModelInput}
        createModelInput={createModelInput}
      />
    </Modal>
  );
};

const Content = ({
  brandData,
  typeData,
  setCreateModelInput,
  createModelInput,
}: {
  brandData: Record<string, any>[];
  typeData: Record<string, any>[];
  setCreateModelInput: React.Dispatch<
    React.SetStateAction<{
      name: string;
      brand: string;
      type: string;
    }>
  >;
  createModelInput: {
    name: string;
    brand: string;
    type: string;
  };
}) => {
  return (
    <Row gutter={[0, 16]}>
      <Col xs={24}>
        <Typography>Name</Typography>
        <Input
          placeholder="Name"
          value={createModelInput.name}
          onChange={(v) => {
            setCreateModelInput((prevState) => ({
              ...prevState,
              name: v.target.value
            }));
          }}
        />
      </Col>
      <Col xs={24}>
        <Typography>Type</Typography>
        <Select
          showSearch
          style={{ width: "100%" }}
          optionFilterProp="children"
          value={createModelInput.type}
          onChange={(v: string) => {
            setCreateModelInput((prevState) => ({
              ...prevState,
              type: v,
            }));
          }}
        >
          {typeData.map((v) => {
            return (
              <Option key={v.id} value={v.name}>
                {v.name}
              </Option>
            );
          })}
        </Select>
      </Col>
      <Col xs={24}>
        <Typography>Brand</Typography>
        <Select
          showSearch
          style={{ width: "100%" }}
          optionFilterProp="children"
          value={createModelInput.brand}
          onChange={(v: string) => {
            setCreateModelInput((prevState) => ({
              ...prevState,
              brand: v,
            }));
          }}
        >
          {brandData.map((v) => {
            return (
              <Option key={v.id} value={v.name}>
                {v.name}
              </Option>
            );
          })}
        </Select>
      </Col>
    </Row>
  );
};
