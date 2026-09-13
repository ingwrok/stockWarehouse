import { User } from "../entities/User";

export type TUser = Pick<User, "username">
  & Pick<User, "role">;