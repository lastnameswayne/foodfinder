import { gCall } from "../test-utils/gCall";
import { testConn } from "../test-utils/testConn";
import "regenerator-runtime/runtime.js";
var faker = require("faker");
import { User } from "../src/entities/User";

let conn;
beforeAll(async () => {
  conn = await testConn();
});
afterAll(async () => {
  await conn.close();
});

const registerMutation = `
mutation Register($options: UsernamePasswordInput!) {
  register(
    options: $options
  ) {
    user {
      id
      createdAt
      updatedAt
      username
      email
  }
  }
}
`;

describe("Register", () => {
  it("create user", async () => {
    const user = {
      username: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const response = await gCall({
      source: registerMutation,
      variableValues: {
        options: user,
      },
      userId: faker.datatype.uuid(),
    });
    expect(response).toMatchObject({
      data: {
        register: {
          user: {
            username: user.username,
            email: user.email,
          },
        },
      },
    });
    const dbUser = await User.findOne({ where: { email: user.email } });
    expect(dbUser).toBeDefined();
    expect(dbUser.id).toBeDefined();
  });
});
