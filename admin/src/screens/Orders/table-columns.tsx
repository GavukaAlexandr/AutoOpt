import { Tag } from "antd";

export const mainColumns = [
  {
    title: "User",
    dataIndex: "user",
    key: "user",
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: "Brand",
    dataIndex: "brand",
    key: "brand",
  },
  {
    title: "Model",
    dataIndex: "model",
    key: "model",
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    render: (status: string) => {
      let color;
      if (status === "PROCESSING") {
        color = "orange";
      }
      if (status === "SENT") {
        color = "blue";
      }
      if (status === "DONE") {
        color = "green";
      }
      return (
        <Tag color={color} key={status}>
          {status.toUpperCase()}
        </Tag>
      );
    },
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    ke: "createdAt",
  },
];