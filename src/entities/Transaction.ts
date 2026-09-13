import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Member } from "./Member";
import { User } from "./User";
import { BaseAuditEntity, BaseAuditProperties } from "./@Base.Audit.Entity";

export interface TransactionProperties extends BaseAuditProperties {
	member_id?: number | null;
	cashier_id: number;
	discount_amount: number;
	earned_point: number;
	final_price: number;
	total_amount: number;
}

export const tableFullName = "activity_translation";
export const tableShortName = "AT";

@Entity("transactions")
export class Transaction extends BaseAuditEntity implements TransactionProperties {
	static readonly table_full_name: string = tableFullName;
  static readonly table_short_name: string = tableShortName;

	constructor(data: TransactionProperties) {
		super(data);
	}

	@Column({ type: "int", nullable: true })
	declare member_id: number | null;

	@Column({ type: "int" })
	declare cashier_id: number;

	@Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
	declare discount_amount: number;

	@Column({ type: "int", default: 0 })
	declare earned_point: number;

	@Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
	declare final_price: number;

	@Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
	declare total_amount: number;

	@ManyToOne(() => User, { onDelete: "RESTRICT" })
	@JoinColumn({ name: "cashier_id" })
	declare cashier: User;

	@ManyToOne(() => Member, { onDelete: "RESTRICT" })
	@JoinColumn({ name: "member_id" })
	declare member: Member | null;
}
