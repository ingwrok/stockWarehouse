import { Entity, Column, Index } from "typeorm";
import ErrorHandler from "../utils/responseHandler/errorHanlder";
import { BaseAuditEntity, BaseAuditProperties } from "./@Base.Audit.Entity";

export interface ProductProperties extends BaseAuditProperties {
	name: string;
	warehouse_qty: number;
	shelf_qty: number;
	warehouse_location: string;
	shelf_location: string;
	price: number;
}

@Entity("product")
@Index(["name"], { unique: true, where: `"deleted_at" IS NULL` })
export class Product extends BaseAuditEntity implements ProductProperties {

	constructor(data: ProductProperties) {
		super(data);
	}

	@Column({ type: "varchar"})
	declare name: string;

	@Column({ type: "int" })
	declare warehouse_qty: number;

	@Column({ type: "int" })
	declare shelf_qty: number;

	@Column({ type: "varchar", length: 255 })
	declare warehouse_location: string;

	@Column({ type: "varchar", length: 255 })
	declare shelf_location: string;

	@Column({ type: "decimal", precision: 12, scale: 2 })
	declare price: number;

	upShelf(quantity: number) {
		if (this.warehouse_qty < quantity) {
			throw ErrorHandler.badRequest(
				`สินค้าในคลังมีไม่พอ (มีอยู่ ${this.warehouse_qty})`,
			);
		}
		this.warehouse_qty -= quantity;
		this.shelf_qty += quantity;
	}

	addStock(quantity: number) {
		if (quantity < 0) {
			throw ErrorHandler.badRequest("quantity must more 0!");
		}
		this.warehouse_qty += quantity;
	}
}
