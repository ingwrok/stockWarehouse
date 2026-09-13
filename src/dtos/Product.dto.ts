import { Product } from "../entities/Product";
import { PickRename } from "./@Base.dto";

export type TProduct = Pick<Product, 'id'>
  & Pick<Product, 'name'>
  & PickRename<Product, 'warehouse_qty', 'warehouseQty'>
  & PickRename<Product, 'shelf_qty', 'shelfQty'>
  & PickRename<Product, 'warehouse_location', 'warehouseLocation'>
  & PickRename<Product, 'shelf_location', 'shelfLocation'>
  & Pick<Product, 'price'>;

export interface IProducts {
  items: TProduct[],
  total: number
}