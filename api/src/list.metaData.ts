import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ListMetadata {
    @Field(() => Int!, { nullable: true })
    count!: number
}