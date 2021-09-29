
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

export class CreateOrderInput {
    userId?: Nullable<string>;
    modelId?: Nullable<string>;
    transmission?: Nullable<Transmission>;
    bodyType?: Nullable<BodyType>;
    drive?: Nullable<DriveType>;
    year?: Nullable<string>;
    engineVolume?: Nullable<string>;
    vin?: Nullable<string>;
    carPart?: Nullable<string>;
    fuel?: Nullable<FuelType>;
    part?: Nullable<PartType>;
}

export abstract class IQuery {
    abstract orders(): Nullable<Nullable<Order>[]> | Promise<Nullable<Nullable<Order>[]>>;

    abstract order(id: string): Nullable<Order> | Promise<Nullable<Order>>;
}

export abstract class IMutation {
    abstract createOrder(createOrderInput?: Nullable<CreateOrderInput>): Nullable<Order> | Promise<Nullable<Order>>;
}

export abstract class ISubscription {
    abstract orderCreated(): Nullable<Order> | Promise<Nullable<Order>>;
}

export class Order {
    id?: Nullable<string>;
    userId?: Nullable<string>;
    modelId?: Nullable<string>;
    transmission?: Nullable<Transmission>;
    bodyType?: Nullable<BodyType>;
    drive?: Nullable<DriveType>;
    year?: Nullable<string>;
    engineVolume?: Nullable<string>;
    vin?: Nullable<string>;
    carPart?: Nullable<string>;
    fuel?: Nullable<FuelType>;
    part?: Nullable<PartType>;
    createdAt?: Nullable<string>;
    updatedAt?: Nullable<string>;
    user?: Nullable<string>;
    model?: Nullable<string>;
}

type Nullable<T> = T | null;
