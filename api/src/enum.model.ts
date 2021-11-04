import { OrderStatus } from ".prisma/client";
import { Field, ObjectType, registerEnumType,  } from "@nestjs/graphql";

@ObjectType()
export class Enums {

    @Field(type => [String])
    orderStatus: String[]

}
