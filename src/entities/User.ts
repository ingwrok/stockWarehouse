import { Entity, Column, OneToMany } from "typeorm";
import { BaseAuditEntity, BaseAuditProperties } from "./@Base.Audit.Entity";

export enum RoleUser {
	ADMIN = "ADMIN",
	CASHIER = "CASHIER",
	STOCK_REPLENISHER = "STOCK REPLENISHER"
}

interface UserProperties extends BaseAuditProperties {
	username: string;
	password_hash: string;
	role?: string;
}

@Entity("users")
export class User extends BaseAuditEntity implements UserProperties {
	constructor(data: UserProperties) {
		super(data);
	}
	@Column({ type: "varchar", unique: true })
	declare username: string;

	@Column({ type: "varchar" })
	declare password_hash: string;

	@Column({type: "enum", enum: RoleUser, default: "CASHIER",})
	declare role?: RoleUser;
}
