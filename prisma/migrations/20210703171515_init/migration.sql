-- CreateTable
CREATE TABLE "Type" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(255) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" SERIAL NOT NULL,
    "brand" VARCHAR(255) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandTypes" (
    "typeId" INTEGER NOT NULL,
    "brandId" INTEGER NOT NULL,

    PRIMARY KEY ("typeId","brandId")
);

-- CreateTable
CREATE TABLE "Model" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "brandID" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BrandTypes" ADD FOREIGN KEY ("typeId") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandTypes" ADD FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD FOREIGN KEY ("brandID") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
