import { PrismaClient } from '@prisma/client';
import axios from 'axios';
const prisma = new PrismaClient();
const transportTypes = ['auto', 'moto', 'bus', 'truck'];
const transmissionArray = ['automatic', 'mechanical', 'variable', 'robot']
const fuelArray = ['gasoline', 'diesel', 'electro', 'hybrid'];
const partArray = ['original', 'analogue'];
const bodyArray = ['sedan', 'hatchback', 'coupe', 'universal', 'minivan', 'suv', 'pickup', 'cabriolet', 'van', 'limousine'];
const driveArray = ['full', 'front', 'rear'];
const orderStatusArray = ['processing', 'sent', 'done'];

let allBrands = [];
let typeQueries = [];
let brandQueries = [];
const modelQueries = [];

async function main() {
  for (const type of transportTypes) {
    let { data: brands } = await axios.get<Record<string, any>[]>(
      `http://avtoopt.com.ua/apps/get_data.php?type=brands&name=${type === 'auto' ? 'avto' : type
      }`,
    );

    brands = brands || [];
    if (type === 'auto') brands = Object.values(brands);

    brands = brands.map((brand) => ({ ...brand, type }));

    allBrands = [...allBrands, ...brands];

    for (const brand of brands) {
      const { data: models } = await axios.get<Record<string, any>[]>(
        `http://avtoopt.com.ua/apps/get_data.php?type=models&name=${type === 'auto' ? 'avto' : type
        }&brand=${encodeURIComponent(brand.title)}`,
      );

      models.forEach((model) => {
        const modelQuery = prisma.model.upsert({
          where: { name: model.title },
          create: {
            name: model.title,
            type: { connect: { name: type } },
            brand: { connect: { name: brand.title } },
          },
          update: {},
        });
        modelQueries.push(modelQuery);
      });
    }
  }

  typeQueries = transportTypes.map((transportType) => {
    transportType = transportType === 'avto' ? 'auto' : transportType;

    return prisma.type.upsert({
      where: { name: transportType },
      create: { name: transportType },
      update: {},
    });
  });

  brandQueries = allBrands.filter(Boolean).map((brand) => {
    return prisma.brand.upsert({
      where: { name: brand.title },
      create: {
        name: brand.title,
      },
      update: {}
    });
  });

  const transmission = transmissionArray.map((data: string) => {
    return prisma.transmission.upsert({
      where: {
        name: data
      },
      create: {
        name: data
      },
      update: {}
    })
  })

  const fuelType = fuelArray.map((data: string) => {
    return prisma.fuelType.upsert({
      where: {
        name: data
      },
      create: {
        name: data
      },
      update: {}
    })
  })

  const partType = partArray.map((data: string) => {
    return prisma.partType.upsert({
      where: {
        name: data
      },
      create: {
        name: data
      },
      update: {}
    })
  })

  const bodyType = bodyArray.map((data: string) => {
    return prisma.bodyType.upsert({
      where: {
        name: data
      },
      create: {
        name: data
      },
      update: {}
    })
  })

  const driveType = driveArray.map((data: string) => {
    return prisma.driveType.upsert({
      where: {
        name: data
      },
      create: {
        name: data
      },
      update: {}
    })
  })

  const orderStatus = orderStatusArray.map((data: string) => {
    return prisma.orderStatus.upsert({
      where: {
        name: data,
      },
      create: {
        name: data
      },
      update: {}
    })
  })

  await prisma.$transaction([...typeQueries, ...brandQueries, ...modelQueries, ...transmission, ...fuelType, ...partType, ...bodyType, ...driveType, ...orderStatus]);
}

main()
  .then(() => {
    console.log('success');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
