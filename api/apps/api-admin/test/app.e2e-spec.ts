import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ApiAdminModule } from '../src/api-admin.module';
import { PrismaClient } from '@app/prisma';
//TODO warn(prisma-client) There are already 10 instances of Prisma Client actively running.
//TODO Necessary to 1 instance

describe('ApiAdminController (e2e)', () => {
  let app: INestApplication;

  let authToken;
  let carTypes;
  let brands;
  let models;
  let statuses;
  let typesOfParts;
  let typesOfBody;
  let typesOfDrive;
  let typesOfFuels;
  let typesOfTransmissions;
  let userId;

  afterAll(async () => {
    const prisma = new PrismaClient();

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiAdminModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const query = `{ login(variables: { phoneNumber: "2534053049539804", password : "123" }) {token} }`;

    const loginResponse = await request(app.getHttpServer())
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ query })
      .expect(200);
    // store the jwt token for the next request
    const {
      data: {
        login: { token },
      },
    } = loginResponse.body;
    authToken = `Bearer ${token}`;
  });

  it('/ (GET)', () => {
    console.log(authToken);
    return request(app.getHttpServer()).get('/').expect(400);
  });

  it('/ (GET) with Authorization header', () => {
    return request(app.getHttpServer())
      .get('/')
      .set('Authorization', `${authToken}`)
      .expect(400);
  });

  it('orderStatuses', async () => {
    const query = `{ orderStatuses { id name } }`;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `${authToken}`)
      .send({ query })
      .expect(200);
    const {
      data: { orderStatuses },
    } = response.body;

    statuses = orderStatuses;
  });

  it('partTypes', async () => {
    const query = `{ partTypes { id name } }`;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `${authToken}`)
      .send({ query })
      .expect(200);
    const {
      data: { partTypes },
    } = response.body;

    typesOfParts = partTypes;
  });

  it('bodyTypes', async () => {
    const query = `{ bodyTypes { id name } }`;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `${authToken}`)
      .send({ query })
      .expect(200);
    const {
      data: { bodyTypes },
    } = response.body;

    typesOfBody = bodyTypes;
  });

  it('driveTypes', async () => {
    const query = `{ driveTypes { id name } }`;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `${authToken}`)
      .send({ query })
      .expect(200);
    const {
      data: { driveTypes },
    } = response.body;

    typesOfDrive = driveTypes;
  });

  it('fuelTypes', async () => {
    const query = `{ fuelTypes { id name } }`;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `${authToken}`)
      .send({ query })
      .expect(200);
    const {
      data: { fuelTypes },
    } = response.body;

    typesOfFuels = fuelTypes;
  });

  it('transmissions', async () => {
    const query = `{ transmissions { id name } }`;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `${authToken}`)
      .send({ query })
      .expect(200);
    const {
      data: { transmissions },
    } = response.body;

    typesOfTransmissions = transmissions;
  });

  it('AllOrders. Should return empty', () => {
    const query = `{ allOrders(filter: {}, page: 0, perPage: 10, sortField: "id", sortOrder: "desc")  { id } }`;

    return request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `${authToken}`)
      .send({ query })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.allOrders.length === 0);
        // orderStatuses = res.body.data.allOrders.orderStatuses;
        // partTypes = res.body.data.allOrders.partTypes;
        // bodyTypes = res.body.data.allOrders.bodyTypes;
        // driveTypes = res.body.data.allOrders.driveTypes;
        // fuelTypes = res.body.data.allOrders.fuelTypes;
        // transmissions = res.body.data.allOrders.transmissions;
      });
  });

  it('allTypes. Should return all types of cars', async () => {
    const query = `{ allTypes(page: 0, perPage: 10, sortField: "id", sortOrder: "desc") { id, name } }`;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `${authToken}`)
      .send({ query })
      .expect(200);

    const {
      data: { allTypes },
    } = response.body;

    carTypes = allTypes;
  });

  it('allBrands. Should return all brands of cars', async () => {
    const query = `{ allBrands(page: 0, perPage: 10, sortField: "id", sortOrder: "desc", filter: {}) { id, name } }`;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `${authToken}`)
      .send({ query })
      .expect(200);

    const {
      data: { allBrands },
    } = response.body;

    brands = allBrands;
  });

  it('allModels. Should return all models of cars', async () => {
    const query = `{ allModels(page: 0, perPage: 10, sortField: "id", sortOrder: "desc", filter: {}) { id name brand { id name } type { id name } } }`;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `${authToken}`)
      .send({ query })
      .expect(200);

    const {
      data: { allModels },
    } = response.body;

    models = allModels;
  });

  it('AllUsers. Should return empty', () => {
    const query = `{ allUsers(filter: {}, page: 0, perPage: 10, sortField: "id", sortOrder: "desc") { id } }`;

    return request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `${authToken}`)
      .send({ query })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.allUsers.length === 0);
      });
  });

  it('allUsers Should return empty', () => {
    const query = `{ allUsers(filter: {}, page: 0, perPage: 10, sortField: "id", sortOrder: "desc") { id } }`;

    return request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `${authToken}`)
      .send({ query })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.allUsers.length === 0);
      });
  });

  it('Create User. Should create user and return userID', async () => {
    const query = `mutation {createUser(createUserInput: { email: "test@mail.com" firebaseUid: "firebaseUid" firstName: "firstName" lastName: "lastName" phoneNumber: "123123123" phoneNotification: false telegramNotification: true viberNotification: false }) { id }}`;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `${authToken}`)
      .send({ query })
      .expect(200);

    const {
      data: {
        createUser: { id },
      },
    } = response.body;

    userId = id;
    console.log(userId);
  });

  it('allUsers Should return not empty', () => {
    const query = `{ allUsers(filter: {}, page: 0, perPage: 10, sortField: "id", sortOrder: "desc") { id } }`;

    return request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `${authToken}`)
      .send({ query })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.allUsers.length === 1);
      });
  });

  // it('AllOrders. Should return not empty', () => {
  //   const query = `{ allOrders(filter: {}, page: 0, perPage: 10, sortField: "id", sortOrder: "desc") { id } }`;
  //
  //   return request(app.getHttpServer())
  //     .post('/graphql')
  //     .set('Authorization', `${authToken}`)
  //     .send({ query })
  //     .expect(200)
  //     .expect((res) => {
  //       console.log(res.body.data.allOrders.length === 1);
  //     });
  // });
  //if empty
  //
});
