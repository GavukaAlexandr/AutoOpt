import { List, Datagrid, TextField, DateField, EmailField, ArrayField, SingleFieldList, ChipField, BooleanField, ReferenceArrayField, ReferenceField } from 'react-admin';

export const UserList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="firstName" />
            <TextField source="lastName" />
            <EmailField source="email" />
            {/* <ArrayField source="orders"><SingleFieldList><ChipField source="id" /></SingleFieldList></ArrayField> */}
            <TextField source="phoneNumber" />
            <BooleanField source="phoneNotification" />
            <BooleanField source="telegramNotification" />
            <BooleanField source="viberNotification" />
            <DateField source="createdAt" />
        </Datagrid>
    </List>
);
