import * as React from "react";
import { Create, SimpleForm, TextInput} from 'react-admin';

export const TypeCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name"/>
            {/* <TextInput source="model"/> */}
            {/* <TextInput source =""/> */}
            {/* <ReferenceInput></ReferenceInput> */}
        </SimpleForm>
    </Create>
);