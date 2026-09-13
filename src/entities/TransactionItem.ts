import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity, BaseProperties } from "./@Base.Entity";
import { Product } from "./Product";
import { Transaction } from "./Transaction";

interface TransactionItemProperties extends BaseProperties {
	quantity: number;
	priceAtSale: number;
	transaction_id: number;
	product_id: number;
}

@Entity("transaction_items")
export class TransactionItem extends BaseEntity implements TransactionItemProperties {
	constructor(data: TransactionItemProperties) {
		super(data)
	}

	@Column({ type: "int" })
	declare quantity: number;

	@Column({ type: "decimal", precision: 12, scale: 2 })
	declare priceAtSale: number;

	@Column({ type: "int" })
	declare transaction_id: number;

	@Column({ type: "int" })
	declare product_id: number;

	@ManyToOne(() => Transaction, { onDelete: "CASCADE" })
  @JoinColumn({ name: "transaction_id" })
  declare transaction: Transaction;

  @ManyToOne(() => Product, {  onDelete: "RESTRICT" })
  @JoinColumn({ name: "product_id" })
  declare product: Product;

	calculateSubtotal(): number {
    return Number(this.quantity) * Number(this.priceAtSale);
  }
}
