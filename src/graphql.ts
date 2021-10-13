
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum FuelType {
    GASOLINE = "GASOLINE",
    DIESEL = "DIESEL",
    ELECTRO = "ELECTRO",
    HYBRID = "HYBRID"
}

export enum Transmission {
    AUTOMATIC = "AUTOMATIC",
    MECHANICAL = "MECHANICAL",
    VARIABLE = "VARIABLE",
    ROBOT = "ROBOT"
}

export enum BodyType {
    SEDAN = "SEDAN",
    HATCHBACK = "HATCHBACK",
    COUPE = "COUPE",
    UNIVERSAL = "UNIVERSAL",
    MINIVAN = "MINIVAN",
    SUV = "SUV",
    PICKUP = "PICKUP",
    CABRIOLET = "CABRIOLET",
    VAN = "VAN",
    LIMOUSINE = "LIMOUSINE"
}

export enum DriveType {
    FULL = "FULL",
    FRONT = "FRONT",
    REAR = "REAR"
}

export enum PartType {
    ORIGINAL = "ORIGINAL",
    ANALOGUE = "ANALOGUE"
}

export class UpdateOrderInput {
    id: string;
    modelId?: Nullable<string>;
    transmission?: Nullable<Transmission>;
    bodyType?: Nullable<BodyType>;
    drive?: Nullable<DriveType>;
    year?: Nullable<string>;
    engineVolume?: Nullable<string>;
    vin?: Nullable<string>;
    carPart?: Nullable<string>;
    fuel?: Nullable<Nullable<FuelType>[]>;
    part?: Nullable<Nullable<PartType>[]>;
}

export class OrderInput {
    userId?: Nullable<string>;
    modelId?: Nullable<string>;
    transmission?: Nullable<Transmission>;
    bodyType?: Nullable<BodyType>;
    drive?: Nullable<DriveType>;
    year?: Nullable<string>;
    engineVolume?: Nullable<string>;
    vin?: Nullable<string>;
    carPart?: Nullable<string>;
    fuel?: Nullable<Nullable<FuelType>[]>;
    part?: Nullable<Nullable<PartType>[]>;
}

export abstract class IQuery {
    abstract order(id: string): Nullable<Order> | Promise<Nullable<Order>>;

    abstract orders(page?: Nullable<number>, perPage?: Nullable<number>, sortOrder?: Nullable<string>): Nullable<Order[]> | Promise<Nullable<Order[]>>;
}

export abstract class IMutation {
    abstract createOrder(createOrder?: Nullable<OrderInput>): Nullable<Order> | Promise<Nullable<Order>>;

    abstract updateOrder(updateOrderInput?: Nullable<UpdateOrderInput>): Nullable<Order> | Promise<Nullable<Order>>;

    abstract removeOrder(id?: Nullable<string>): Nullable<Order> | Promise<Nullable<Order>>;
}

export class Order {
    id: string;
    userId?: Nullable<string>;
    modelId?: Nullable<Model>;
    transmission?: Nullable<Transmission>;
    bodyType?: Nullable<BodyType>;
    drive?: Nullable<DriveType>;
    year?: Nullable<string>;
    engineVolume?: Nullable<string>;
    vin?: Nullable<string>;
    carPart?: Nullable<string>;
    fuel?: Nullable<Nullable<FuelType>[]>;
    part?: Nullable<Nullable<PartType>[]>;
    createdAt?: Nullable<string>;
    updatedAt?: Nullable<string>;
    user?: Nullable<User>;
    model?: Nullable<Model>;
}

export class User {
    id?: Nullable<string>;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    token?: Nullable<string>;
    firebaseUid?: Nullable<string>;
    email?: Nullable<string>;
    phoneNumber?: Nullable<string>;
    telegramNotification?: Nullable<boolean>;
    viberNotification?: Nullable<boolean>;
    phoneNotification?: Nullable<boolean>;
    createdAt?: Nullable<string>;
    updatedAt?: Nullable<string>;
    orders?: Nullable<Nullable<Order>[]>;
}

export class Model {
    id: string;
    user?: Nullable<Nullable<User>[]>;
    name: string;
    typeId: Type;
    brandId: Brand;
    order?: Nullable<Nullable<Order>[]>;
    type?: Nullable<Type>;
    brand?: Nullable<Brand>;
}

export class Brand {
    id: string;
    name: string;
    types?: Nullable<Nullable<Type>[]>;
    Model?: Nullable<Nullable<Model>[]>;
}

export class Type {
    id: string;
    name: string;
    brands?: Nullable<Nullable<Brand>[]>;
    models?: Nullable<Nullable<Model>[]>;
}

type Nullable<T> = T | null;