-- CreateTable
CREATE TABLE "user_model" (
    "user_id" UUID NOT NULL,
    "model_id" UUID NOT NULL,

    PRIMARY KEY ("user_id","model_id")
);

-- AddForeignKey
ALTER TABLE "user_model" ADD FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_model" ADD FOREIGN KEY ("model_id") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;
