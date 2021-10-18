import { User as UserEntity, } from '.prisma/client'
import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql'
import { Order } from 'src/order/gql/order.model'

@ObjectType()
export class User implements UserEntity {
    token: string

    firebaseUid: string

    @Field(type => String)
    id: string

    @Field(type => String)
    firstName: string

    @Field(type => String)
    lastName: string

    @Field(type => String)
    email: string

    @Field(type => String)
    phoneNumber: string

    @Field(type => Boolean)
    telegramNotification: boolean

    @Field(type => Boolean)
    viberNotification: boolean

    @Field(type => Boolean)
    phoneNotification: boolean

    @Field(type => Date)
    createdAt: Date

    @Field(type => Date)
    updatedAt: Date

    @Field(type => [Order])
    orders: Order[]
}

@InputType()
export class UserFilter {
    @Field(() => ID, { nullable: true })
    id?: string
}

@InputType()
export class UpdateUserInput {
    @Field(() => ID)
    id!: string

    @Field(type => String)
    firstName?: string

    @Field(type => String)
    lastName?: string

    @Field(type => String)
    email?: string

    @Field(type => String)
    phoneNumber?: string

    @Field(type => Boolean)
    telegramNotification?: boolean

    @Field(type => Boolean)
    viberNotification: boolean

    @Field(type => Boolean)
    phoneNotification: boolean
}