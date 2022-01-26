import { Field, ID, InputType, ObjectType,  } from "@nestjs/graphql"
import { Admin as AdminEntity } from "@prisma/client";

@ObjectType()
export class Admin implements AdminEntity {
    @Field(type => ID)
    id: string;

    @Field(type => String)
    firstName: string;

    @Field(type => String)
    lastName: string;

    @Field(type => String)
    password: string;

    @Field(type => String)
    email: string;

    @Field(type => String)
    phoneNumber: string;

    token: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    idSuperAdmin: boolean;
}
@ObjectType()
export abstract class Token {
    @Field(type => String)
    token
}

@InputType()
export class AdminInput {
    @Field(type => String!)
    phoneNumber!: string;
    @Field(type => String!)
    password!: string;
}

@InputType()
export class AdminCreateInput {
    @Field(type => String)
    firstName: string;
    @Field(type => String)
    lastName: string;
    @Field(type => String)
    email: string;
    @Field(type => String)
    phoneNumber: string;
    @Field(type => String)
    password: string;
}