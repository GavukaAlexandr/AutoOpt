import { Modal, Input, Typography, Row, Col } from "antd";
import { useState } from "react";

export const ModalCreateType = ({
  isModalVisible,
  handleOk,
  handleCancel,
}: {
  isModalVisible: boolean;
  handleOk: (newBrand: string) => void;
  handleCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}) => {
  const [newType, setNewType] = useState("");

  return (
    <Modal
      title="Create Type"
      visible={isModalVisible}
      okButtonProps={{
        disabled:
        newType.length !== 0
            ? false
            : true,
      }}
      onOk={() => {
        handleOk(newType);
        return setNewType("");
      }}
      onCancel={handleCancel}
    >
      <Content
        setNewType={setNewType}
        newType={newType}
      />
    </Modal>
  );
};

const Content = ({
  setNewType,
  newType,
}: {
    setNewType: React.Dispatch<React.SetStateAction<string>>;
    newType: string
}) => {
  return (
    <Row gutter={[0, 16]}>
      <Col xs={24}>
        <Typography>Name</Typography>
        <Input
          placeholder="Name"
          value={newType}
          onChange={(v) => setNewType(v.target.value)}
        />
      </Col>
    </Row>
  );
};
