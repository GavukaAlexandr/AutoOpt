import { message } from "antd";

export const succesMessage = (text: string) => {
    return message.success(text)
  }
  
export const errorMessage = (text: string) => {
    return message.error(text);
  }