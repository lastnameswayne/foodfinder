import faker from "faker";
import { gCall } from "../test-utils/gCall";
import { testConn } from "../test-utils/testConn";
import "regenerator-runtime/runtime.js";
import { User } from "../src/entities/User";

let conn;
beforeAll(async () => {
  conn = await testConn();
});
afterAll(async () => {
  await conn.close();
});

const meQuery = `
 {
  me {
    id
    username 
    email
  }
}
`;

describe("Me", () => {
  it("get user", async () => {
    const user = await User.create({
      username: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }).save();

    const response = await gCall({
      source: meQuery,
      userId: user.id,
    });

    expect(response).toMatchObject({
      data: {
        me: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      },
    });
  });

  it("return null", async () => {
    const response = await gCall({
      source: meQuery,
    });

    expect(response).toMatchObject({
      data: {
        me: null,
      },
    });
  });
});
