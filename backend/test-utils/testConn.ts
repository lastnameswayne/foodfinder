import { createConnection } from "typeorm";

export const testConn = (drop: boolean = false) => {
  return createConnection({
    name: "default",
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "",
    database: "foodfinder-test",
    synchronize: drop,
    dropSchema: drop,
    entities: [
      "/Users/tiarnanswayne/Documents/projects/foodfinder/backend/src/entities/*.*",
    ],
  });
};
