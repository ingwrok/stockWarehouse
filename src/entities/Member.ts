import { Entity, Column } from "typeorm";
import { BaseAuditEntity, BaseAuditProperties } from "./@Base.Audit.Entity";

export interface MemberProperties extends BaseAuditProperties {
	username: string;
	phone: string;
	points?: number;
}

@Entity("members")
export class Member extends BaseAuditEntity implements MemberProperties {
	constructor(data: MemberProperties) {
		super(data);
	}

	@Column({ type: "varchar", length: 255 })
	declare username: string;

	@Column({ type: "varchar", length: 10, unique: true })
	declare phone: string;

	@Column({ type: "int", default: 0 })
	declare points: number;

	addPoint(totalPrice: number): number {
		const earnedPoint = Math.floor(totalPrice / 10);
		this.points += earnedPoint;
		return earnedPoint;
	}

	usePoint(): number {
		const POINT_RATE = 25;

		if (this.points < POINT_RATE) {
			return 0;
		}

		const exchangeableUnits = Math.floor(this.points / POINT_RATE);

		const remainingPoints = this.points % POINT_RATE;

		this.points = remainingPoints;

		return exchangeableUnits;
	}
}
