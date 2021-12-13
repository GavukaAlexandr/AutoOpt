import { Field, ID, InputType, ObjectType } from "@nestjs/graphql"
import { BodyType, DriveType, FuelType, OrderStatus, PartType, Transmission, UserCarParams as userCarParamEntity, FuelsOnOrders } from '.prisma/client'
import {  IBodyType, IDriveType, IFuelType, IPartType, ITransmission } from "src/order/gql/models"
import { Model } from 'src/transport/gql/model.model';
import { User } from 'src/user/gql/user.model';

@ObjectType()
export class UserCarParams implements userCarParamEntity {
    isDisabled: boolean
    driveTypeId: string
    transmissionId: string
    bodyTypeId: string
    partTypeId: string
    orderStatusId: string
    modelId: string
    isDeleted: boolean
    userId: string

    @Field(type => String)
    id: string

    @Field(type => User)
    user: User

    @Field(type => Model)
    model: Model

    @Field(type => IBodyType)
    bodyType: IBodyType

    @Field(type => String)
    carPart: string

    @Field(type => IDriveType)
    drive: IDriveType

    @Field(type => String)
    engineVolume: string

    @Field(type => [IFuelType])
    fuels: IFuelType[]

    @Field(type => IPartType)
    partOfType: IPartType

    @Field(type => ITransmission)
    transmission: Transmission

    @Field(type => String)
    vin: string

    @Field(type => String)
    year: string

    @Field(type => Date)
    createdAt: Date

    @Field(type => Date)
    updatedAt: Date
}

@InputType()
export class CreateCarParamsInput {
    @Field(type => String)
    userId!: String

    @Field(type => String)
    modelId!: String

    @Field(type => ID)
    transmissionId!: Transmission

    @Field(type => ID)
    bodyTypeId!: BodyType

    @Field(type => ID)
    driveTypeId!: DriveType

    @Field(type => String)
    year!: String

    @Field(type => String)
    engineVolume!: String

    @Field(type => String)
    vin!: String

    @Field(type => String)
    carPart!: String

    @Field(type => [ID])
    fuelId!: FuelType[]

    @Field(type => ID)
    partTypeId!: PartType
}

@InputType()
export class UpdateUserCarParamsInput {
    @Field(type => ID, { nullable: true })
    id: String

    @Field(type => String, { nullable: true })
    modelId?: String

    @Field(type => String, { nullable: true })
    transmission?: Transmission

    @Field(type => String, { nullable: true })
    bodyType?: BodyType

    @Field(type => String, { nullable: true })
    drive?: DriveType

    @Field(type => String, { nullable: true })
    year?: String

    @Field(type => String, { nullable: true })
    engineVolume?: String

    @Field(type => String, { nullable: true })
    vin?: String

    @Field(type => String, { nullable: true })
    carPart?: String

    @Field(type => [String], { nullable: true })
    fuel?: FuelType[]

    @Field(type => String, { nullable: true })
    partOfType?: PartType
}