import {
  FuelType,
  OrderStatus,
  Transmission,
  PartType,
  BodyType,
  DriveType,
} from '.prisma/client';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export abstract class ITransmission implements Transmission {
  @Field((type) => ID)
  id: string;

  @Field((type) => String)
  name: string;
}

@ObjectType({ isAbstract: true })
export abstract class IPartType implements PartType {
  @Field((type) => ID)
  id: string;

  @Field((type) => String)
  name: string;
}

@ObjectType({ isAbstract: true })
export abstract class IBodyType implements BodyType {
  @Field((type) => ID)
  id: string;

  @Field((type) => String)
  name: string;
}

@ObjectType({ isAbstract: true })
export abstract class IDriveType implements DriveType {
  @Field((type) => ID)
  id: string;

  @Field((type) => String)
  name: string;
}

@ObjectType()
export class IFuelType implements FuelType {
  @Field((type) => ID)
  id: string;

  @Field((type) => String)
  name: string;
}

@ObjectType()
export abstract class IOrderStatus implements OrderStatus {
  default: boolean;

  @Field((type) => ID)
  id: string;

  @Field((type) => String)
  name: string;
}
