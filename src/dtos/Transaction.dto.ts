import { Transaction } from "../entities/Transaction";
import { PickRename } from "./@Base.dto";


export type TTransaction = Pick<Transaction, "id">
  & {
    username: string | null
  }
  & PickRename<Transaction, "discount_amount", "discountAmount">
  & PickRename<Transaction, "earned_point", "earnedPoint">
  & PickRename<Transaction, "final_price", "finalPrice">
  & PickRename<Transaction, "total_amount", "totalAmount">
  & {
    items: TProductItem[];
  };

export interface TProductItem {
  name: string;
  quantity: number;
}

export interface TTransactionSummary {
  totalRevenue: number;
  totalTransactions: number;
  totalItemsSold: number;
}

export interface TTransactionProduct {
  productId: number;
  productName: string;
  quantity: number;
  totalAmount: number;
}

export interface TTransactyionSummary {
  filter: {
    start: Date | string | null;
    end: Date | string | null;
  };
  summary: TTransactionSummary;
  products: TTransactionProduct[];
}