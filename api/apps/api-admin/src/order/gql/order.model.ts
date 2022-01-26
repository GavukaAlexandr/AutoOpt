import { BodyType, DriveType, FuelType, OrderStatus, PartType, Transmission, Order as OrderEntity, FuelsOnOrders, } from '.prisma/client'
import { Field, ID, InputType, ObjectType, } from '@nestjs/graphql'
import { Model } from '../../transport/gql/model.model'
import { User } from '../../user/gql/user.model'
import { IBodyType, IDriveType, IFuelType, IOrderStatus, IPartType, ITransmission } from './models'

@ObjectType()
export class Order implements OrderEntity {
    isHistory: boolean;
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

    @Field(type => String)
    orderNumber: string

    @Field(type => User)
    user: User

    @Field(type => String)
    userCarParamId: string

    @Field(type => IOrderStatus)
    status: IOrderStatus

    @Field(type => String, { nullable: true })
    comment: string

    @Field(type => Date)
    createdAt: Date

    @Field(type => Date)
    updatedAt: Date

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
}

@InputType()
export class OrderFilter {
    @Field(() => ID, { nullable: true })
    user?: string;

    @Field(() => String, { nullable: true })
    firstName?: string

    @Field(() => String, { nullable: true })
    lastName?: string

    @Field(() => String, { nullable: true })
    phoneNumber?: string

    @Field(() => Date, { nullable: true })
    startDate?: Date

    @Field(() => Date, { nullable: true })
    endDate?: Date

    @Field(() => String, { nullable: true })
    carPart?: string

    @Field(() => String, { nullable: true })
    status?: string
}

@InputType()
export class UpdateOrderInput {
    @Field(type => ID, { nullable: true })
    id!: string

    @Field(type => String, { nullable: true })
    status?: OrderStatus

    @Field(type => String, { nullable: true })
    comment?: string
}

@InputType()
export class CreateOrderInput {
    @Field(type => String)
    userId!: String

    @Field(type => String, { nullable: true })
    orderNumber?: string

    @Field(type => String)
    userCarParamId!: String

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
    fuelId!: string[]

    @Field(type => ID)
    partTypeId!: PartType

    @Field(type => String, { nullable: true })
    status?: OrderStatus

    @Field(type => String, { nullable: true })
    comment?: string

}

@InputType()
export class DeleteOrderInput {
    @Field(type => String)
    id: String
}
