import { Member } from "../entities/Member";
import { PickRename } from "./@Base.dto";
import { TTransaction } from "./Transaction.dto";

export type TMember = Pick<Member, "id">
  & Pick<Member, "username">
  & Pick<Member, "phone">
  & Pick<Member, "points">
  & PickRename<Member, "created_at", "createdAt">;

export type TTransactionWithoutUsername = Omit<TTransaction , "username">;

export type TMemberHistory = Pick<Member, "username">
  & PickRename<Member, "points", "totalPoints">
  & {
    transactions: TTransactionWithoutUsername[]
  };

