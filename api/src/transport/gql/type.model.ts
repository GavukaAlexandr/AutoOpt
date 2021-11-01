import { Type as TypeEntity, } from '.prisma/client'
import { Field, ID, InputType, ObjectType  } from '@nestjs/graphql'
import { Mode } from 'fs'
import { Brand } from './brand.model'
import { Model } from './model.model'

@ObjectType()
export class Type implements TypeEntity {
    @Field(() => ID)
    id: string

    @Field(() => String)
    name: string

    @Field(() => [Brand])
    brands?: Brand[]

    @Field(() => [Model])
    models?: Model[]
    
}

@InputType()
export class TypeFilter {
    @Field(() => [ID], { nullable: true })
    ids?: string[]
}

@InputType()
export class UpdateType {
    @Field(type => ID!)
    id!: String

    @Field(type => String)
    name?: String
}
