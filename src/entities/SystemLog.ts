import { Entity, Column } from "typeorm";
import { BaseAuditEntity } from "./@Base.Audit.Entity";

export enum LogAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  LOGIN  = "LOGIN",
  LOGOUT = "LOGOUT",
  ADDSTOCK = "ADDSTOCK",
  UPSHELF = "UPSHELF"
}

@Entity("system_log")
export class SystemLog extends BaseAuditEntity {
  @Column({ type: "enum", enum: LogAction })
  declare action: LogAction;

  @Column({ type: "text" })
  declare detail: string;
}