import { Member } from "../entities/Member";
import { PickRename } from "./@Base.dto";

export type TMember = Pick<Member, "id">
  & Pick<Member, "username">
  & Pick<Member, "phone">
  & Pick<Member, "points">
  & PickRename<Member, "created_at", "createdAt">;