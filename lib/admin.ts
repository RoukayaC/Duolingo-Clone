import { auth } from "@clerk/nextjs/server";

const adminIds = ["user_2hU05D3MQazMpjqPTOCD6lQu9uD"];

export const isAdmin = () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  return adminIds.indexOf(userId) !== -1;
};
