// import { BodyType, DriveType, OrderStatus, PartType, Transmission, FuelType } from '.prisma/client';
import { BodyType, DriveType, FuelType, OrderStatus, PartType, Transmission, Order as OrderEntity, } from '.prisma/client'
import { Field, ID, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql'

@ObjectType()
export class Order implements OrderEntity {
    isDeleted: boolean

    @Field(type => String)
    id!: string

    @Field(type => String)
    userId!: string

    @Field(type => String)
    modelId!: string

    @Field(type => BodyType)
    bodyType!: BodyType

    @Field(type => String)
    carPart!: string

    @Field(type => DriveType)
    drive!: DriveType

    @Field(type => String)
    engineVolume!: string

    @Field(type => [FuelType!])
    fuel!: FuelType[]

    @Field(type => [PartType!])
    part!: PartType[]

    @Field(type => OrderStatus!)
    status!: OrderStatus

    @Field(type => Transmission)
    transmission!: Transmission

    @Field(type => String)
    vin!: string

    @Field(type => String)
    year!: string

    @Field(type => Date)
    createdAt!: Date

    @Field(type => Date)
    updatedAt!: Date
}

@InputType()
export class OrderFilter {
    @Field(() => [ID], { nullable: true })
    ids?: string[]
}

@ObjectType()
export class ListMetadata {
    @Field(() => Int!, { nullable: true })
    count!: number
}

@InputType()
export class UpdateOrderInput {
    @Field(type => ID!)
    id!: String

    @Field(type => String)
    modelId?: String

    @Field(type => Transmission)
    transmission?: Transmission

    @Field(type => BodyType)
    bodyType?: BodyType

    @Field(type => DriveType)
    drive?: DriveType

    @Field(type => String)
    year?: String

    @Field(type => String)
    engineVolume?: String

    @Field(type => String)
    vin?: String

    @Field(type => String)
    carPart?: String

    @Field(type => [FuelType])
    fuel?: FuelType[]

    @Field(type => [PartType])
    part?: PartType[]
}

@InputType()
export class CreateOrderInput {
    @Field(type => String!)
    userId!: String

    @Field(type => String!)
    modelId!: String

    @Field(type => Transmission!)
    transmission!: Transmission

    @Field(type => BodyType!)
    bodyType!: BodyType

    @Field(type => DriveType!)
    drive!: DriveType

    @Field(type => String!)
    year!: String

    @Field(type => String!)
    engineVolume!: String

    @Field(type => String!)
    vin!: String

    @Field(type => String!)
    carPart!: String

    @Field(type => [FuelType!])
    fuel!: FuelType[]

    @Field(type => [PartType!])
    part!: PartType[]
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