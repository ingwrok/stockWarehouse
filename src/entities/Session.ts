import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { BaseEntity, BaseProperties } from "./@Base.Entity";

export interface SessionProperties extends BaseProperties {
  user_id: number;
  expires_at: Date;
  device_info?: string | null;
}

@Entity("sessions")
export class Session extends BaseEntity implements SessionProperties {
  constructor(data: SessionProperties) {
    super(data);
  }

  @Column({ type: "int" })
  declare user_id: number;

  @Column({ type: "timestamp" })
  declare expires_at: Date;

  @Column({ type: "varchar", nullable: true })
  declare device_info: string | null;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;
}