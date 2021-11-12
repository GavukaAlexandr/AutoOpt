import { Brand as BrandEntity, } from '.prisma/client'
import { Field, ID, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Model } from './model.model'
import { Type } from './type.model'

@ObjectType()
export class Brand implements BrandEntity {
    @Field(() => ID)
    id: string

    @Field(() => String)
    name: string

    @Field(() => [Type])
    type: Type[]

    @Field(() => [Model])
    models: Model[]
}

@InputType()
export class BrandFilter {
    @Field(() => String, {nullable: true})
    q?: string
    @Field(() => String, {nullable: true})
    typeId
}