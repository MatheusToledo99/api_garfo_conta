import { DateTime } from "luxon";
import {
  BaseModel,
  ManyToMany,
  column,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import Product from "./Product";

export default class Order extends BaseModel {
  @column({ isPrimary: true, serializeAs: "orderId" })
  public orderId: number;

  @column({ serializeAs: "billId" })
  public billId: number;

  @column({ serializeAs: "paymentId" })
  public paymentId: number;

  @column({ serializeAs: "orderValue" })
  public orderValue: number;

  @column({ serializeAs: "orderDiscount" })
  public orderDiscount: number | null;

  @column({ serializeAs: "orderObservation" })
  public orderObservation: string | null;

  @column({ serializeAs: "orderResponsible" })
  public orderResponsible: string | null;

  @column({ serializeAs: "orderOpen" })
  public orderOpen: boolean;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public orderCreatedAt: DateTime;

  @manyToMany(() => Product, {
    localKey: "orderId",
    pivotForeignKey: "order_id",
    relatedKey: "productId",
    pivotRelatedForeignKey: "product_id",
    pivotTable: "product_orders",
  })
  public products: ManyToMany<typeof Product>;
}
