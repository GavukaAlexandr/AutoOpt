import { Model as ModelEntity, } from '.prisma/client'
import { Field, ID, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Brand } from './brand.model'
import { Type } from './type.model'

@ObjectType()
export class Model implements ModelEntity {
    typeId: string
    brandId: string

    @Field(() => ID)
    id: string
    
    @Field(() => String)
    name: string

    @Field(() => [Type])
    type: Type[]

    @Field(() => [Brand])
    brand: Brand[]
}

@InputType()
export class ModelFilter {
    @Field(() => [ID], { nullable: true })
    ids?: string[]

    @Field(() => String, {nullable: true})
    q?: string

    @Field(() => String, {nullable: true})
    brandIds?: string

    @Field(() => String, {nullable: true})
    typeIds?: string
}

@InputType()
export class UpdateModelInput {
    @Field(type => ID!)
    id!: String

    @Field(type => String)
    name?: String
}