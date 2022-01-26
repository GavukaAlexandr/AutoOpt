import { Modal, Input, Typography, Row, Col } from "antd";
import { useState } from "react";
export const ModalCreateBrand = ({
  isModalVisible,
  handleOk,
  handleCancel,
}: {
  isModalVisible: boolean;
  handleOk: (newBrand: string) => void;
  handleCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}) => {
  const [newOrder, setNewOrder] = useState("");

  return (
    <Modal
      title="Create Brand"
      visible={isModalVisible}
      okButtonProps={{
        disabled:
          newOrder.length !== 0
            ? false
            : true,
      }}
      onOk={() => {
        handleOk(newOrder);
        return setNewOrder("");
      }}
      onCancel={handleCancel}
    >
      <Content
        setNewOrder={setNewOrder}
        newOrder={newOrder}
      />
    </Modal>
  );
};

const Content = ({
  setNewOrder,
  newOrder,
}: {
  setNewOrder: React.Dispatch<React.SetStateAction<string>>;
  newOrder: string
}) => {
  return (
    <Row gutter={[0, 16]}>
      <Col xs={24}>
        <Typography>Name</Typography>
        <Input
          placeholder="Name"
          value={newOrder}
          onChange={(v) => setNewOrder(v.target.value)}
        />
      </Col>
    </Row>
  );
};
