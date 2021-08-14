import { PrismaClient } from '@prisma/client';
import axios from 'axios';
const prisma = new PrismaClient();
const transportTypes = ['auto', 'moto', 'bus', 'truck'];

let allBrands = [];

let typeQueries = [];
let brandQueries = [];
const modelQueries = [];

async function main() {
  for (const type of transportTypes) {
    let { data: brands } = await axios.get(
      `http://avtoopt.com.ua/apps/get_data.php?type=brands&name=${
        type === 'auto' ? 'avto' : type
      }`,
    );

    brands = brands || [];
    if (type === 'auto') brands = Object.values(brands);

    brands = brands.map((brand) => ({ ...brand, type }));

    allBrands = [...allBrands, ...brands];

    for (const brand of brands) {
      const { data: models } = await axios.get(
        `http://avtoopt.com.ua/apps/get_data.php?type=models&name=${
          type === 'auto' ? 'avto' : type
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
        types: {
          create: [
            {
              type: {
                connect: {
                  name: brand.type,
                },
              },
            },
          ],
        },
      },
      update: {
        types: {
          create: [
            {
              type: {
                connect: {
                  name: brand.type,
                },
              },
            },
          ],
        },
      },
    });
  });

  await prisma.$transaction([...typeQueries, ...brandQueries, ...modelQueries]);
}

main()
  .then(() => {
    console.log('SUCKsess');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
