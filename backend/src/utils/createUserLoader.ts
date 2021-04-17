import DataLoader from "dataloader";
import { User } from "../entities/User";
//takes id's and maps them to each user
//so hash table where you input a user id and get a user
//then we returns the right user id's for each user.
export const createUserLoader = () =>
  new DataLoader<number, User>(async (userIds) => {
    const users = await User.findByIds(userIds as number[]);

    const userIdToUser: Record<number, User> = {};
    users.forEach((u) => {
      userIdToUser[u.id] = u;
    });

    return userIds.map((userId) => userIdToUser[userId]);
  });
