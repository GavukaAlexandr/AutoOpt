// import { BodyType, DriveType, OrderStatus, PartType, Transmission, FuelType } from '.prisma/client';
import { BodyType, DriveType, FuelType, OrderStatus, PartType, Transmission, Order as OrderEntity, } from '.prisma/client'
import { Field, ID, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Model } from 'src/transport/gql/model.model'
import { User } from 'src/user/gql/user.model'

@ObjectType()
export class Order implements OrderEntity {
    modelId: string
    isDeleted: boolean
    userId: string

    @Field(type => String)
    id: string

    @Field(type => User)
    user: User

    @Field(type => Model)
    model: Model

    @Field(type => BodyType)
    bodyType: BodyType

    @Field(type => String)
    carPart: string

    @Field(type => DriveType)
    drive: DriveType

    @Field(type => String)
    engineVolume: string

    @Field(type => [FuelType])
    fuel: FuelType[]

    @Field(type => PartType)
    partOfType: PartType

    @Field(type => OrderStatus)
    status: OrderStatus

    @Field(type => Transmission)
    transmission: Transmission

    @Field(type => String)
    vin: string

    @Field(type => String)
    year: string

    @Field(type => String, { nullable: true })
    comment: string

    @Field(type => Date)
    createdAt: Date

    @Field(type => Date)
    updatedAt: Date
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

    @Field(() => OrderStatus, { nullable: true })
    status?: OrderStatus
}

@InputType()
export class UpdateOrderInput {
    @Field(type => String, { nullable: true })
    modelId?: String

    @Field(type => Transmission, { nullable: true })
    transmission?: Transmission

    @Field(type => OrderStatus, { nullable: true })
    status?: OrderStatus

    @Field(type => BodyType, { nullable: true })
    bodyType?: BodyType

    @Field(type => DriveType, { nullable: true })
    drive?: DriveType

    @Field(type => String, { nullable: true })
    year?: String

    @Field(type => String, { nullable: true })
    engineVolume?: String

    @Field(type => String, { nullable: true })
    vin?: String

    @Field(type => String, { nullable: true })
    carPart?: String

    @Field(type => [FuelType], { nullable: true })
    fuel?: FuelType[]

    @Field(type => PartType, { nullable: true })
    partOfType?: PartType

    @Field(type => String, { nullable: true })
    comment?: string
}

@InputType()
export class CreateOrderInput {
    @Field(type => String)
    userId!: String

    @Field(type => String)
    modelId!: String

    @Field(type => Transmission)
    transmission!: Transmission

    @Field(type => BodyType)
    bodyType!: BodyType

    @Field(type => DriveType)
    drive!: DriveType

    @Field(type => String)
    year!: String

    @Field(type => String)
    engineVolume!: String

    @Field(type => String)
    vin!: String

    @Field(type => String)
    carPart!: String

    @Field(type => [FuelType])
    fuel!: FuelType[]

    @Field(type => PartType)
    partOfType!: PartType
}

@InputType()
export class DeleteOrderInput {
    @Field(type => String)
    id: String
}

///! ENUMS
registerEnumType(BodyType, {
    name: 'BodyType',
});

registerEnumType(DriveType, {
    name: 'DriveType',
});

registerEnumType(FuelType, {
    name: 'FuelType',
});

registerEnumType(PartType, {
    name: 'PartType',
});

registerEnumType(OrderStatus, {
    name: 'OrderStatus',
});

registerEnumType(Transmission, {
    name: 'Transmission',
});