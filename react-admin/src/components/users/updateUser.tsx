import { DateInput, Edit, SimpleForm, TextInput } from "react-admin";

export const UserEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="id"/>
            <TextInput source="firstName"/>
            <TextInput source="lastName" />
        </SimpleForm>
    </Edit>
);