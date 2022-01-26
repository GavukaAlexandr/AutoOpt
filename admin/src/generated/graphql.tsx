import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
};

export type Admin = {
  __typename?: 'Admin';
  email: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  phoneNumber: Scalars['String'];
};

export type AdminCreateInput = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  phoneNumber: Scalars['String'];
};

export type AdminInput = {
  password: Scalars['String'];
  phoneNumber: Scalars['String'];
};

export type Brand = {
  __typename?: 'Brand';
  id: Scalars['ID'];
  models: Array<Model>;
  name: Scalars['String'];
  type: Array<Type>;
};

export type BrandFilter = {
  name?: InputMaybe<Scalars['String']>;
  q?: InputMaybe<Scalars['String']>;
  typeId?: InputMaybe<Scalars['String']>;
};

export type CreateCarParamsInput = {
  bodyTypeId: Scalars['ID'];
  carPart: Scalars['String'];
  driveTypeId: Scalars['ID'];
  engineVolume: Scalars['String'];
  fuelId: Array<Scalars['ID']>;
  modelId: Scalars['String'];
  partTypeId: Scalars['ID'];
  transmissionId: Scalars['ID'];
  userId: Scalars['String'];
  vin: Scalars['String'];
  year: Scalars['String'];
};

export type CreateOrderInput = {
  bodyTypeId: Scalars['ID'];
  carPart: Scalars['String'];
  comment?: InputMaybe<Scalars['String']>;
  driveTypeId: Scalars['ID'];
  engineVolume: Scalars['String'];
  fuelId: Array<Scalars['ID']>;
  modelId: Scalars['String'];
  orderNumber?: InputMaybe<Scalars['String']>;
  partTypeId: Scalars['ID'];
  status?: InputMaybe<Scalars['String']>;
  transmissionId: Scalars['ID'];
  userCarParamId: Scalars['String'];
  userId: Scalars['String'];
  vin: Scalars['String'];
  year: Scalars['String'];
};

export type CreateUserInput = {
  email: Scalars['String'];
  firebaseUid: Scalars['String'];
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  phoneNotification: Scalars['Boolean'];
  phoneNumber: Scalars['String'];
  telegramNotification: Scalars['Boolean'];
  viberNotification: Scalars['Boolean'];
};

export type IBodyType = {
  __typename?: 'IBodyType';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type IDriveType = {
  __typename?: 'IDriveType';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type IFuelType = {
  __typename?: 'IFuelType';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type IOrderStatus = {
  __typename?: 'IOrderStatus';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type IPartType = {
  __typename?: 'IPartType';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type ITransmission = {
  __typename?: 'ITransmission';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type ListMetadata = {
  __typename?: 'ListMetadata';
  count?: Maybe<Scalars['Int']>;
};

export type Model = {
  __typename?: 'Model';
  brand: Brand;
  id: Scalars['ID'];
  name: Scalars['String'];
  type: Type;
};

export type ModelFilter = {
  brand?: InputMaybe<Scalars['String']>;
  brandId?: InputMaybe<Scalars['String']>;
  q?: InputMaybe<Scalars['String']>;
  typeId?: InputMaybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  create: Admin;
  createBrand: Brand;
  createCarParams: UserCarParams;
  createModel: Model;
  createOrder: Order;
  createType: Type;
  createUser: User;
  updateBrand: Brand;
  updateModel: Model;
  updateOrder: Order;
  updateType: Type;
  updateUser: User;
  updateUserCarParams: UserCarParams;
};


export type MutationCreateArgs = {
  adminCreateInput: AdminCreateInput;
};


export type MutationCreateBrandArgs = {
  name?: InputMaybe<Scalars['String']>;
};


export type MutationCreateCarParamsArgs = {
  createCarParamsInput: CreateCarParamsInput;
};


export type MutationCreateModelArgs = {
  brandId?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
  typeId?: InputMaybe<Scalars['ID']>;
};


export type MutationCreateOrderArgs = {
  createOrderInput: CreateOrderInput;
};


export type MutationCreateTypeArgs = {
  name?: InputMaybe<Scalars['String']>;
};


export type MutationCreateUserArgs = {
  createUserInput?: InputMaybe<CreateUserInput>;
};


export type MutationUpdateBrandArgs = {
  id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateModelArgs = {
  brand?: InputMaybe<Scalars['ID']>;
  id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['ID']>;
};


export type MutationUpdateOrderArgs = {
  updateOrderInput?: InputMaybe<UpdateOrderInput>;
};


export type MutationUpdateTypeArgs = {
  id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateUserArgs = {
  updateUserInput?: InputMaybe<UpdateUserInput>;
};


export type MutationUpdateUserCarParamsArgs = {
  updateUserCarParamsInput?: InputMaybe<UpdateUserCarParamsInput>;
};

export type Order = {
  __typename?: 'Order';
  bodyType: IBodyType;
  carPart: Scalars['String'];
  comment?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  drive: IDriveType;
  engineVolume: Scalars['String'];
  fuels: Array<IFuelType>;
  id: Scalars['String'];
  model: Model;
  orderNumber: Scalars['String'];
  partOfType: IPartType;
  status: IOrderStatus;
  transmission: ITransmission;
  updatedAt: Scalars['DateTime'];
  user: User;
  userCarParamId: Scalars['String'];
  vin: Scalars['String'];
  year: Scalars['String'];
};

export type OrderFilter = {
  carPart?: InputMaybe<Scalars['String']>;
  endDate?: InputMaybe<Scalars['DateTime']>;
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
  status?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['ID']>;
};

export type Query = {
  __typename?: 'Query';
  Brand: Brand;
  Model: Model;
  Order: Order;
  Type: Type;
  User: User;
  allBrands: Array<Brand>;
  allBrandsMeta: ListMetadata;
  allBrandsOfType: Array<Brand>;
  allModels: Array<Model>;
  allModelsMeta: ListMetadata;
  allOrders: Array<Order>;
  allOrdersMeta: ListMetadata;
  allTypes: Array<Type>;
  allTypesMeta: ListMetadata;
  allUsers: Array<User>;
  allUsersMeta: ListMetadata;
  bodyTypes: Array<IBodyType>;
  driveTypes: Array<IDriveType>;
  fuelTypes: Array<IFuelType>;
  getFirstOrder: Array<Order>;
  login: Token;
  orderStatuses: Array<IOrderStatus>;
  partTypes: Array<IPartType>;
  transmissions: Array<ITransmission>;
  userCarParams: UserCarParams;
};


export type QueryBrandArgs = {
  id: Scalars['String'];
};


export type QueryModelArgs = {
  id: Scalars['String'];
};


export type QueryOrderArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type QueryTypeArgs = {
  id: Scalars['String'];
};


export type QueryUserArgs = {
  id: Scalars['String'];
};


export type QueryAllBrandsArgs = {
  filter?: InputMaybe<BrandFilter>;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
  sortField?: InputMaybe<Scalars['String']>;
  sortOrder?: InputMaybe<Scalars['String']>;
};


export type QueryAllBrandsMetaArgs = {
  filter?: InputMaybe<BrandFilter>;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
  sortField?: InputMaybe<Scalars['String']>;
  sortOrder?: InputMaybe<Scalars['String']>;
};


export type QueryAllBrandsOfTypeArgs = {
  filter?: InputMaybe<BrandFilter>;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
};


export type QueryAllModelsArgs = {
  filter?: InputMaybe<ModelFilter>;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
  sortField?: InputMaybe<Scalars['String']>;
  sortOrder?: InputMaybe<Scalars['String']>;
};


export type QueryAllModelsMetaArgs = {
  filter?: InputMaybe<ModelFilter>;
  sortField?: InputMaybe<Scalars['String']>;
  sortOrder?: InputMaybe<Scalars['String']>;
};


export type QueryAllOrdersArgs = {
  filter?: InputMaybe<OrderFilter>;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
  sortField?: InputMaybe<Scalars['String']>;
  sortOrder?: InputMaybe<Scalars['String']>;
};


export type QueryAllOrdersMetaArgs = {
  filter?: InputMaybe<OrderFilter>;
  sortField?: InputMaybe<Scalars['String']>;
  sortOrder?: InputMaybe<Scalars['String']>;
};


export type QueryAllTypesArgs = {
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
  sortField?: InputMaybe<Scalars['String']>;
  sortOrder?: InputMaybe<Scalars['String']>;
};


export type QueryAllTypesMetaArgs = {
  sortField?: InputMaybe<Scalars['String']>;
  sortOrder?: InputMaybe<Scalars['String']>;
};


export type QueryAllUsersArgs = {
  filter?: InputMaybe<UserFilter>;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
  sortField?: InputMaybe<Scalars['String']>;
  sortOrder?: InputMaybe<Scalars['String']>;
};


export type QueryAllUsersMetaArgs = {
  filter?: InputMaybe<UserFilter>;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
  sortField?: InputMaybe<Scalars['String']>;
  sortOrder?: InputMaybe<Scalars['String']>;
};


export type QueryGetFirstOrderArgs = {
  sortField?: InputMaybe<Scalars['String']>;
  sortOrder?: InputMaybe<Scalars['String']>;
};


export type QueryLoginArgs = {
  variables?: InputMaybe<AdminInput>;
};


export type QueryUserCarParamsArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type Token = {
  __typename?: 'Token';
  token: Scalars['String'];
};

export type Type = {
  __typename?: 'Type';
  brands: Array<Brand>;
  id: Scalars['ID'];
  models: Array<Model>;
  name: Scalars['String'];
};

export type UpdateOrderInput = {
  comment?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  status?: InputMaybe<Scalars['String']>;
};

export type UpdateUserCarParamsInput = {
  bodyType?: InputMaybe<Scalars['String']>;
  carPart?: InputMaybe<Scalars['String']>;
  drive?: InputMaybe<Scalars['String']>;
  engineVolume?: InputMaybe<Scalars['String']>;
  fuel?: InputMaybe<Array<Scalars['String']>>;
  id?: InputMaybe<Scalars['ID']>;
  modelId?: InputMaybe<Scalars['String']>;
  partOfType?: InputMaybe<Scalars['String']>;
  transmission?: InputMaybe<Scalars['String']>;
  vin?: InputMaybe<Scalars['String']>;
  year?: InputMaybe<Scalars['String']>;
};

export type UpdateUserInput = {
  comment?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  comment?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['String'];
  lastName: Scalars['String'];
  orders: Array<Order>;
  phoneNotification: Scalars['Boolean'];
  phoneNumber: Scalars['String'];
  telegramNotification: Scalars['Boolean'];
  updatedAt: Scalars['DateTime'];
  viberNotification: Scalars['Boolean'];
};

export type UserCarParams = {
  __typename?: 'UserCarParams';
  bodyType: IBodyType;
  carPart: Scalars['String'];
  createdAt: Scalars['DateTime'];
  drive: IDriveType;
  engineVolume: Scalars['String'];
  fuels: Array<IFuelType>;
  id: Scalars['String'];
  model: Model;
  partOfType: IPartType;
  transmission: ITransmission;
  updatedAt: Scalars['DateTime'];
  user: User;
  vin: Scalars['String'];
  year: Scalars['String'];
};

export type UserFilter = {
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
};

export type CreateTypeMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']>;
}>;


export type CreateTypeMutation = { __typename?: 'Mutation', createType: { __typename?: 'Type', id: string, name: string } };

export type UpdateTypeMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
}>;


export type UpdateTypeMutation = { __typename?: 'Mutation', updateType: { __typename?: 'Type', id: string, name: string } };

export type UpdateBrandMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
}>;


export type UpdateBrandMutation = { __typename?: 'Mutation', updateBrand: { __typename?: 'Brand', id: string } };

export type CreateBrandMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']>;
}>;


export type CreateBrandMutation = { __typename?: 'Mutation', createBrand: { __typename?: 'Brand', id: string } };

export type UpdateModelMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
  brand?: InputMaybe<Scalars['ID']>;
  type?: InputMaybe<Scalars['ID']>;
}>;


export type UpdateModelMutation = { __typename?: 'Mutation', updateModel: { __typename?: 'Model', id: string } };

export type CreateModelMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']>;
  brandId?: InputMaybe<Scalars['ID']>;
  typeId?: InputMaybe<Scalars['ID']>;
}>;


export type CreateModelMutation = { __typename?: 'Mutation', createModel: { __typename?: 'Model', id: string, name: string, brand: { __typename?: 'Brand', id: string, name: string }, type: { __typename?: 'Type', id: string, name: string } } };

export type UpdateUserMutationVariables = Exact<{
  updateUserInput?: InputMaybe<UpdateUserInput>;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: string } };

export type CreateOrderMutationVariables = Exact<{
  createOrderInput: CreateOrderInput;
}>;


export type CreateOrderMutation = { __typename?: 'Mutation', createOrder: { __typename?: 'Order', id: string, userCarParamId: string, orderNumber: string, comment?: string | null | undefined, createdAt: any, model: { __typename?: 'Model', id: string, name: string, type: { __typename?: 'Type', id: string, name: string }, brand: { __typename?: 'Brand', id: string, name: string } }, status: { __typename?: 'IOrderStatus', id: string, name: string }, user: { __typename?: 'User', id: string, firstName: string, lastName: string, phoneNumber: string, email: string, phoneNotification: boolean, viberNotification: boolean, telegramNotification: boolean, comment?: string | null | undefined } } };

export type UpdateUserCarParamsMutationVariables = Exact<{
  updateUserCarParamsInput?: InputMaybe<UpdateUserCarParamsInput>;
}>;


export type UpdateUserCarParamsMutation = { __typename?: 'Mutation', updateUserCarParams: { __typename?: 'UserCarParams', id: string } };

export type OrderQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']>;
}>;


export type OrderQuery = { __typename?: 'Query', Order: { __typename?: 'Order', id: string, userCarParamId: string, orderNumber: string, comment?: string | null | undefined, createdAt: any, carPart: string, engineVolume: string, vin: string, year: string, fuels: Array<{ __typename?: 'IFuelType', name: string, id: string }>, model: { __typename?: 'Model', id: string, name: string, type: { __typename?: 'Type', id: string, name: string }, brand: { __typename?: 'Brand', id: string, name: string } }, status: { __typename?: 'IOrderStatus', id: string, name: string }, user: { __typename?: 'User', id: string, firstName: string, lastName: string, phoneNumber: string, email: string, phoneNotification: boolean, viberNotification: boolean, telegramNotification: boolean, comment?: string | null | undefined }, transmission: { __typename?: 'ITransmission', name: string, id: string }, drive: { __typename?: 'IDriveType', name: string, id: string }, partOfType: { __typename?: 'IPartType', name: string, id: string }, bodyType: { __typename?: 'IBodyType', name: string, id: string } } };

export type AllOrdersQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
  sortField?: InputMaybe<Scalars['String']>;
  sortOrder?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<OrderFilter>;
}>;


export type AllOrdersQuery = { __typename?: 'Query', allOrders: Array<{ __typename?: 'Order', id: string, comment?: string | null | undefined, createdAt: any, carPart: string, status: { __typename?: 'IOrderStatus', id: string, name: string }, model: { __typename?: 'Model', id: string, name: string, type: { __typename?: 'Type', id: string, name: string }, brand: { __typename?: 'Brand', id: string, name: string } }, user: { __typename?: 'User', id: string, firstName: string, lastName: string, phoneNumber: string, email: string, phoneNotification: boolean, viberNotification: boolean, telegramNotification: boolean, comment?: string | null | undefined } }>, allOrdersMeta: { __typename?: 'ListMetadata', count?: number | null | undefined }, orderStatuses: Array<{ __typename?: 'IOrderStatus', id: string, name: string }>, partTypes: Array<{ __typename?: 'IPartType', id: string, name: string }>, bodyTypes: Array<{ __typename?: 'IBodyType', id: string, name: string }>, driveTypes: Array<{ __typename?: 'IDriveType', id: string, name: string }>, fuelTypes: Array<{ __typename?: 'IFuelType', id: string, name: string }>, transmissions: Array<{ __typename?: 'ITransmission', id: string, name: string }> };

export type GetFirstOrderQueryVariables = Exact<{
  sortField?: InputMaybe<Scalars['String']>;
  sortOrder?: InputMaybe<Scalars['String']>;
}>;


export type GetFirstOrderQuery = { __typename?: 'Query', getFirstOrder: Array<{ __typename?: 'Order', createdAt: any }> };

export type AllTypesQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
  sortField?: InputMaybe<Scalars['String']>;
  sortOrder?: InputMaybe<Scalars['String']>;
}>;


export type AllTypesQuery = { __typename?: 'Query', allTypes: Array<{ __typename?: 'Type', id: string, name: string }>, allOrdersMeta: { __typename?: 'ListMetadata', count?: number | null | undefined } };

export type AllBrandsOfTypeQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
  filter?: InputMaybe<BrandFilter>;
}>;


export type AllBrandsOfTypeQuery = { __typename?: 'Query', allBrandsOfType: Array<{ __typename?: 'Brand', id: string, name: string }> };

export type AllBrandsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
  sortField?: InputMaybe<Scalars['String']>;
  sortOrder?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<BrandFilter>;
}>;


export type AllBrandsQuery = { __typename?: 'Query', allBrands: Array<{ __typename?: 'Brand', id: string, name: string }>, allBrandsMeta: { __typename?: 'ListMetadata', count?: number | null | undefined } };

export type AllModelsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
  sortField?: InputMaybe<Scalars['String']>;
  sortOrder?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ModelFilter>;
}>;


export type AllModelsQuery = { __typename?: 'Query', allModels: Array<{ __typename?: 'Model', id: string, name: string, brand: { __typename?: 'Brand', id: string, name: string }, type: { __typename?: 'Type', id: string, name: string } }>, allModelsMeta: { __typename?: 'ListMetadata', count?: number | null | undefined } };

export type AllUsersQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
  sortField?: InputMaybe<Scalars['String']>;
  sortOrder?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<UserFilter>;
}>;


export type AllUsersQuery = { __typename?: 'Query', allUsers: Array<{ __typename?: 'User', id: string, comment?: string | null | undefined, createdAt: any, email: string, firstName: string, lastName: string, phoneNotification: boolean, phoneNumber: string, telegramNotification: boolean, viberNotification: boolean, orders: Array<{ __typename?: 'Order', id: string }> }>, allUsersMeta: { __typename?: 'ListMetadata', count?: number | null | undefined } };

export type LoginQueryVariables = Exact<{
  variables?: InputMaybe<AdminInput>;
}>;


export type LoginQuery = { __typename?: 'Query', login: { __typename?: 'Token', token: string } };


export const CreateTypeDocument = gql`
    mutation createType($name: String) {
  createType(name: $name) {
    id
    name
  }
}
    `;
export type CreateTypeMutationFn = Apollo.MutationFunction<CreateTypeMutation, CreateTypeMutationVariables>;

/**
 * __useCreateTypeMutation__
 *
 * To run a mutation, you first call `useCreateTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTypeMutation, { data, loading, error }] = useCreateTypeMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateTypeMutation(baseOptions?: Apollo.MutationHookOptions<CreateTypeMutation, CreateTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTypeMutation, CreateTypeMutationVariables>(CreateTypeDocument, options);
      }
export type CreateTypeMutationHookResult = ReturnType<typeof useCreateTypeMutation>;
export type CreateTypeMutationResult = Apollo.MutationResult<CreateTypeMutation>;
export type CreateTypeMutationOptions = Apollo.BaseMutationOptions<CreateTypeMutation, CreateTypeMutationVariables>;
export const UpdateTypeDocument = gql`
    mutation updateType($name: String, $id: ID) {
  updateType(id: $id, name: $name) {
    id
    name
  }
}
    `;
export type UpdateTypeMutationFn = Apollo.MutationFunction<UpdateTypeMutation, UpdateTypeMutationVariables>;

/**
 * __useUpdateTypeMutation__
 *
 * To run a mutation, you first call `useUpdateTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTypeMutation, { data, loading, error }] = useUpdateTypeMutation({
 *   variables: {
 *      name: // value for 'name'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUpdateTypeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTypeMutation, UpdateTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTypeMutation, UpdateTypeMutationVariables>(UpdateTypeDocument, options);
      }
export type UpdateTypeMutationHookResult = ReturnType<typeof useUpdateTypeMutation>;
export type UpdateTypeMutationResult = Apollo.MutationResult<UpdateTypeMutation>;
export type UpdateTypeMutationOptions = Apollo.BaseMutationOptions<UpdateTypeMutation, UpdateTypeMutationVariables>;
export const UpdateBrandDocument = gql`
    mutation updateBrand($id: ID, $name: String) {
  updateBrand(id: $id, name: $name) {
    id
  }
}
    `;
export type UpdateBrandMutationFn = Apollo.MutationFunction<UpdateBrandMutation, UpdateBrandMutationVariables>;

/**
 * __useUpdateBrandMutation__
 *
 * To run a mutation, you first call `useUpdateBrandMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBrandMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBrandMutation, { data, loading, error }] = useUpdateBrandMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useUpdateBrandMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBrandMutation, UpdateBrandMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBrandMutation, UpdateBrandMutationVariables>(UpdateBrandDocument, options);
      }
export type UpdateBrandMutationHookResult = ReturnType<typeof useUpdateBrandMutation>;
export type UpdateBrandMutationResult = Apollo.MutationResult<UpdateBrandMutation>;
export type UpdateBrandMutationOptions = Apollo.BaseMutationOptions<UpdateBrandMutation, UpdateBrandMutationVariables>;
export const CreateBrandDocument = gql`
    mutation createBrand($name: String) {
  createBrand(name: $name) {
    id
  }
}
    `;
export type CreateBrandMutationFn = Apollo.MutationFunction<CreateBrandMutation, CreateBrandMutationVariables>;

/**
 * __useCreateBrandMutation__
 *
 * To run a mutation, you first call `useCreateBrandMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBrandMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBrandMutation, { data, loading, error }] = useCreateBrandMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateBrandMutation(baseOptions?: Apollo.MutationHookOptions<CreateBrandMutation, CreateBrandMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBrandMutation, CreateBrandMutationVariables>(CreateBrandDocument, options);
      }
export type CreateBrandMutationHookResult = ReturnType<typeof useCreateBrandMutation>;
export type CreateBrandMutationResult = Apollo.MutationResult<CreateBrandMutation>;
export type CreateBrandMutationOptions = Apollo.BaseMutationOptions<CreateBrandMutation, CreateBrandMutationVariables>;
export const UpdateModelDocument = gql`
    mutation updateModel($id: ID, $name: String, $brand: ID, $type: ID) {
  updateModel(id: $id, name: $name, brand: $brand, type: $type) {
    id
  }
}
    `;
export type UpdateModelMutationFn = Apollo.MutationFunction<UpdateModelMutation, UpdateModelMutationVariables>;

/**
 * __useUpdateModelMutation__
 *
 * To run a mutation, you first call `useUpdateModelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateModelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateModelMutation, { data, loading, error }] = useUpdateModelMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      brand: // value for 'brand'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useUpdateModelMutation(baseOptions?: Apollo.MutationHookOptions<UpdateModelMutation, UpdateModelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateModelMutation, UpdateModelMutationVariables>(UpdateModelDocument, options);
      }
export type UpdateModelMutationHookResult = ReturnType<typeof useUpdateModelMutation>;
export type UpdateModelMutationResult = Apollo.MutationResult<UpdateModelMutation>;
export type UpdateModelMutationOptions = Apollo.BaseMutationOptions<UpdateModelMutation, UpdateModelMutationVariables>;
export const CreateModelDocument = gql`
    mutation createModel($name: String, $brandId: ID, $typeId: ID) {
  createModel(name: $name, brandId: $brandId, typeId: $typeId) {
    id
    name
    brand {
      id
      name
    }
    type {
      id
      name
    }
  }
}
    `;
export type CreateModelMutationFn = Apollo.MutationFunction<CreateModelMutation, CreateModelMutationVariables>;

/**
 * __useCreateModelMutation__
 *
 * To run a mutation, you first call `useCreateModelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateModelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createModelMutation, { data, loading, error }] = useCreateModelMutation({
 *   variables: {
 *      name: // value for 'name'
 *      brandId: // value for 'brandId'
 *      typeId: // value for 'typeId'
 *   },
 * });
 */
export function useCreateModelMutation(baseOptions?: Apollo.MutationHookOptions<CreateModelMutation, CreateModelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateModelMutation, CreateModelMutationVariables>(CreateModelDocument, options);
      }
export type CreateModelMutationHookResult = ReturnType<typeof useCreateModelMutation>;
export type CreateModelMutationResult = Apollo.MutationResult<CreateModelMutation>;
export type CreateModelMutationOptions = Apollo.BaseMutationOptions<CreateModelMutation, CreateModelMutationVariables>;
export const UpdateUserDocument = gql`
    mutation updateUser($updateUserInput: UpdateUserInput) {
  updateUser(updateUserInput: $updateUserInput) {
    id
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      updateUserInput: // value for 'updateUserInput'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const CreateOrderDocument = gql`
    mutation createOrder($createOrderInput: CreateOrderInput!) {
  createOrder(createOrderInput: $createOrderInput) {
    id
    userCarParamId
    orderNumber
    model {
      id
      name
      type {
        id
        name
      }
      brand {
        id
        name
      }
    }
    status {
      id
      name
    }
    comment
    createdAt
    user {
      id
      firstName
      lastName
      phoneNumber
      email
      phoneNotification
      viberNotification
      telegramNotification
      comment
    }
  }
}
    `;
export type CreateOrderMutationFn = Apollo.MutationFunction<CreateOrderMutation, CreateOrderMutationVariables>;

/**
 * __useCreateOrderMutation__
 *
 * To run a mutation, you first call `useCreateOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrderMutation, { data, loading, error }] = useCreateOrderMutation({
 *   variables: {
 *      createOrderInput: // value for 'createOrderInput'
 *   },
 * });
 */
export function useCreateOrderMutation(baseOptions?: Apollo.MutationHookOptions<CreateOrderMutation, CreateOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateOrderMutation, CreateOrderMutationVariables>(CreateOrderDocument, options);
      }
export type CreateOrderMutationHookResult = ReturnType<typeof useCreateOrderMutation>;
export type CreateOrderMutationResult = Apollo.MutationResult<CreateOrderMutation>;
export type CreateOrderMutationOptions = Apollo.BaseMutationOptions<CreateOrderMutation, CreateOrderMutationVariables>;
export const UpdateUserCarParamsDocument = gql`
    mutation updateUserCarParams($updateUserCarParamsInput: UpdateUserCarParamsInput) {
  updateUserCarParams(updateUserCarParamsInput: $updateUserCarParamsInput) {
    id
  }
}
    `;
export type UpdateUserCarParamsMutationFn = Apollo.MutationFunction<UpdateUserCarParamsMutation, UpdateUserCarParamsMutationVariables>;

/**
 * __useUpdateUserCarParamsMutation__
 *
 * To run a mutation, you first call `useUpdateUserCarParamsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserCarParamsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserCarParamsMutation, { data, loading, error }] = useUpdateUserCarParamsMutation({
 *   variables: {
 *      updateUserCarParamsInput: // value for 'updateUserCarParamsInput'
 *   },
 * });
 */
export function useUpdateUserCarParamsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserCarParamsMutation, UpdateUserCarParamsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserCarParamsMutation, UpdateUserCarParamsMutationVariables>(UpdateUserCarParamsDocument, options);
      }
export type UpdateUserCarParamsMutationHookResult = ReturnType<typeof useUpdateUserCarParamsMutation>;
export type UpdateUserCarParamsMutationResult = Apollo.MutationResult<UpdateUserCarParamsMutation>;
export type UpdateUserCarParamsMutationOptions = Apollo.BaseMutationOptions<UpdateUserCarParamsMutation, UpdateUserCarParamsMutationVariables>;
export const OrderDocument = gql`
    query Order($id: ID) {
  Order(id: $id) {
    id
    userCarParamId
    orderNumber
    fuels {
      name
      id
    }
    model {
      id
      name
      type {
        id
        name
      }
      brand {
        id
        name
      }
    }
    status {
      id
      name
    }
    comment
    createdAt
    user {
      id
      firstName
      lastName
      phoneNumber
      email
      phoneNotification
      viberNotification
      telegramNotification
      comment
    }
    transmission {
      name
      id
    }
    drive {
      name
      id
    }
    partOfType {
      name
      id
    }
    bodyType {
      name
      id
    }
    carPart
    engineVolume
    vin
    year
  }
}
    `;

/**
 * __useOrderQuery__
 *
 * To run a query within a React component, call `useOrderQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrderQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOrderQuery(baseOptions?: Apollo.QueryHookOptions<OrderQuery, OrderQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrderQuery, OrderQueryVariables>(OrderDocument, options);
      }
export function useOrderLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrderQuery, OrderQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrderQuery, OrderQueryVariables>(OrderDocument, options);
        }
export type OrderQueryHookResult = ReturnType<typeof useOrderQuery>;
export type OrderLazyQueryHookResult = ReturnType<typeof useOrderLazyQuery>;
export type OrderQueryResult = Apollo.QueryResult<OrderQuery, OrderQueryVariables>;
export const AllOrdersDocument = gql`
    query allOrders($page: Int, $perPage: Int, $sortField: String, $sortOrder: String, $filter: OrderFilter) {
  allOrders(
    page: $page
    perPage: $perPage
    sortField: $sortField
    sortOrder: $sortOrder
    filter: $filter
  ) {
    id
    status {
      id
      name
    }
    comment
    createdAt
    carPart
    model {
      id
      name
      type {
        id
        name
      }
      brand {
        id
        name
      }
    }
    user {
      id
      firstName
      lastName
      phoneNumber
      email
      phoneNotification
      viberNotification
      telegramNotification
      comment
    }
  }
  allOrdersMeta(sortField: "id", sortOrder: "asc", filter: $filter) {
    count
  }
  orderStatuses {
    id
    name
  }
  partTypes {
    id
    name
  }
  bodyTypes {
    id
    name
  }
  driveTypes {
    id
    name
  }
  fuelTypes {
    id
    name
  }
  transmissions {
    id
    name
  }
}
    `;

/**
 * __useAllOrdersQuery__
 *
 * To run a query within a React component, call `useAllOrdersQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllOrdersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllOrdersQuery({
 *   variables: {
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *      sortField: // value for 'sortField'
 *      sortOrder: // value for 'sortOrder'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useAllOrdersQuery(baseOptions?: Apollo.QueryHookOptions<AllOrdersQuery, AllOrdersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllOrdersQuery, AllOrdersQueryVariables>(AllOrdersDocument, options);
      }
export function useAllOrdersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllOrdersQuery, AllOrdersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllOrdersQuery, AllOrdersQueryVariables>(AllOrdersDocument, options);
        }
export type AllOrdersQueryHookResult = ReturnType<typeof useAllOrdersQuery>;
export type AllOrdersLazyQueryHookResult = ReturnType<typeof useAllOrdersLazyQuery>;
export type AllOrdersQueryResult = Apollo.QueryResult<AllOrdersQuery, AllOrdersQueryVariables>;
export const GetFirstOrderDocument = gql`
    query getFirstOrder($sortField: String, $sortOrder: String) {
  getFirstOrder(sortField: $sortField, sortOrder: $sortOrder) {
    createdAt
  }
}
    `;

/**
 * __useGetFirstOrderQuery__
 *
 * To run a query within a React component, call `useGetFirstOrderQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFirstOrderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFirstOrderQuery({
 *   variables: {
 *      sortField: // value for 'sortField'
 *      sortOrder: // value for 'sortOrder'
 *   },
 * });
 */
export function useGetFirstOrderQuery(baseOptions?: Apollo.QueryHookOptions<GetFirstOrderQuery, GetFirstOrderQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFirstOrderQuery, GetFirstOrderQueryVariables>(GetFirstOrderDocument, options);
      }
export function useGetFirstOrderLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFirstOrderQuery, GetFirstOrderQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFirstOrderQuery, GetFirstOrderQueryVariables>(GetFirstOrderDocument, options);
        }
export type GetFirstOrderQueryHookResult = ReturnType<typeof useGetFirstOrderQuery>;
export type GetFirstOrderLazyQueryHookResult = ReturnType<typeof useGetFirstOrderLazyQuery>;
export type GetFirstOrderQueryResult = Apollo.QueryResult<GetFirstOrderQuery, GetFirstOrderQueryVariables>;
export const AllTypesDocument = gql`
    query allTypes($page: Int, $perPage: Int, $sortField: String, $sortOrder: String) {
  allTypes(
    page: $page
    perPage: $perPage
    sortField: $sortField
    sortOrder: $sortOrder
  ) {
    id
    name
  }
  allOrdersMeta(sortField: "id", sortOrder: "asc", filter: {}) {
    count
  }
}
    `;

/**
 * __useAllTypesQuery__
 *
 * To run a query within a React component, call `useAllTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllTypesQuery({
 *   variables: {
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *      sortField: // value for 'sortField'
 *      sortOrder: // value for 'sortOrder'
 *   },
 * });
 */
export function useAllTypesQuery(baseOptions?: Apollo.QueryHookOptions<AllTypesQuery, AllTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllTypesQuery, AllTypesQueryVariables>(AllTypesDocument, options);
      }
export function useAllTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllTypesQuery, AllTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllTypesQuery, AllTypesQueryVariables>(AllTypesDocument, options);
        }
export type AllTypesQueryHookResult = ReturnType<typeof useAllTypesQuery>;
export type AllTypesLazyQueryHookResult = ReturnType<typeof useAllTypesLazyQuery>;
export type AllTypesQueryResult = Apollo.QueryResult<AllTypesQuery, AllTypesQueryVariables>;
export const AllBrandsOfTypeDocument = gql`
    query allBrandsOfType($page: Int, $perPage: Int, $filter: BrandFilter) {
  allBrandsOfType(page: $page, perPage: $perPage, filter: $filter) {
    id
    name
  }
}
    `;

/**
 * __useAllBrandsOfTypeQuery__
 *
 * To run a query within a React component, call `useAllBrandsOfTypeQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllBrandsOfTypeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllBrandsOfTypeQuery({
 *   variables: {
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useAllBrandsOfTypeQuery(baseOptions?: Apollo.QueryHookOptions<AllBrandsOfTypeQuery, AllBrandsOfTypeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllBrandsOfTypeQuery, AllBrandsOfTypeQueryVariables>(AllBrandsOfTypeDocument, options);
      }
export function useAllBrandsOfTypeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllBrandsOfTypeQuery, AllBrandsOfTypeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllBrandsOfTypeQuery, AllBrandsOfTypeQueryVariables>(AllBrandsOfTypeDocument, options);
        }
export type AllBrandsOfTypeQueryHookResult = ReturnType<typeof useAllBrandsOfTypeQuery>;
export type AllBrandsOfTypeLazyQueryHookResult = ReturnType<typeof useAllBrandsOfTypeLazyQuery>;
export type AllBrandsOfTypeQueryResult = Apollo.QueryResult<AllBrandsOfTypeQuery, AllBrandsOfTypeQueryVariables>;
export const AllBrandsDocument = gql`
    query allBrands($page: Int, $perPage: Int, $sortField: String, $sortOrder: String, $filter: BrandFilter) {
  allBrands(
    page: $page
    perPage: $perPage
    sortField: $sortField
    sortOrder: $sortOrder
    filter: $filter
  ) {
    id
    name
  }
  allBrandsMeta(sortField: "id", sortOrder: "desc", filter: $filter) {
    count
  }
}
    `;

/**
 * __useAllBrandsQuery__
 *
 * To run a query within a React component, call `useAllBrandsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllBrandsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllBrandsQuery({
 *   variables: {
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *      sortField: // value for 'sortField'
 *      sortOrder: // value for 'sortOrder'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useAllBrandsQuery(baseOptions?: Apollo.QueryHookOptions<AllBrandsQuery, AllBrandsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllBrandsQuery, AllBrandsQueryVariables>(AllBrandsDocument, options);
      }
export function useAllBrandsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllBrandsQuery, AllBrandsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllBrandsQuery, AllBrandsQueryVariables>(AllBrandsDocument, options);
        }
export type AllBrandsQueryHookResult = ReturnType<typeof useAllBrandsQuery>;
export type AllBrandsLazyQueryHookResult = ReturnType<typeof useAllBrandsLazyQuery>;
export type AllBrandsQueryResult = Apollo.QueryResult<AllBrandsQuery, AllBrandsQueryVariables>;
export const AllModelsDocument = gql`
    query allModels($page: Int, $perPage: Int, $sortField: String, $sortOrder: String, $filter: ModelFilter) {
  allModels(
    page: $page
    perPage: $perPage
    sortField: $sortField
    sortOrder: $sortOrder
    filter: $filter
  ) {
    id
    name
    brand {
      id
      name
    }
    type {
      id
      name
    }
  }
  allModelsMeta(sortField: "id", sortOrder: "asc", filter: $filter) {
    count
  }
}
    `;

/**
 * __useAllModelsQuery__
 *
 * To run a query within a React component, call `useAllModelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllModelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllModelsQuery({
 *   variables: {
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *      sortField: // value for 'sortField'
 *      sortOrder: // value for 'sortOrder'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useAllModelsQuery(baseOptions?: Apollo.QueryHookOptions<AllModelsQuery, AllModelsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllModelsQuery, AllModelsQueryVariables>(AllModelsDocument, options);
      }
export function useAllModelsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllModelsQuery, AllModelsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllModelsQuery, AllModelsQueryVariables>(AllModelsDocument, options);
        }
export type AllModelsQueryHookResult = ReturnType<typeof useAllModelsQuery>;
export type AllModelsLazyQueryHookResult = ReturnType<typeof useAllModelsLazyQuery>;
export type AllModelsQueryResult = Apollo.QueryResult<AllModelsQuery, AllModelsQueryVariables>;
export const AllUsersDocument = gql`
    query allUsers($page: Int, $perPage: Int, $sortField: String, $sortOrder: String, $filter: UserFilter) {
  allUsers(
    page: $page
    perPage: $perPage
    sortField: $sortField
    sortOrder: $sortOrder
    filter: $filter
  ) {
    id
    orders {
      id
    }
    comment
    createdAt
    email
    firstName
    lastName
    phoneNotification
    phoneNumber
    telegramNotification
    viberNotification
  }
  allUsersMeta(sortField: "id", sortOrder: "asc", filter: $filter) {
    count
  }
}
    `;

/**
 * __useAllUsersQuery__
 *
 * To run a query within a React component, call `useAllUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllUsersQuery({
 *   variables: {
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *      sortField: // value for 'sortField'
 *      sortOrder: // value for 'sortOrder'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useAllUsersQuery(baseOptions?: Apollo.QueryHookOptions<AllUsersQuery, AllUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllUsersQuery, AllUsersQueryVariables>(AllUsersDocument, options);
      }
export function useAllUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllUsersQuery, AllUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllUsersQuery, AllUsersQueryVariables>(AllUsersDocument, options);
        }
export type AllUsersQueryHookResult = ReturnType<typeof useAllUsersQuery>;
export type AllUsersLazyQueryHookResult = ReturnType<typeof useAllUsersLazyQuery>;
export type AllUsersQueryResult = Apollo.QueryResult<AllUsersQuery, AllUsersQueryVariables>;
export const LoginDocument = gql`
    query login($variables: AdminInput) {
  login(variables: $variables) {
    token
  }
}
    `;

/**
 * __useLoginQuery__
 *
 * To run a query within a React component, call `useLoginQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginQuery({
 *   variables: {
 *      variables: // value for 'variables'
 *   },
 * });
 */
export function useLoginQuery(baseOptions?: Apollo.QueryHookOptions<LoginQuery, LoginQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LoginQuery, LoginQueryVariables>(LoginDocument, options);
      }
export function useLoginLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LoginQuery, LoginQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LoginQuery, LoginQueryVariables>(LoginDocument, options);
        }
export type LoginQueryHookResult = ReturnType<typeof useLoginQuery>;
export type LoginLazyQueryHookResult = ReturnType<typeof useLoginLazyQuery>;
export type LoginQueryResult = Apollo.QueryResult<LoginQuery, LoginQueryVariables>;