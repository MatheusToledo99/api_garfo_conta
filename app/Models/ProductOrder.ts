import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class ProductOrder extends BaseModel {
  @column({ isPrimary: true, serializeAs: "productOrderId" })
  public productOrderId: number;

  @column({ serializeAs: "productId" })
  public productId: number;

  @column({ serializeAs: "orderId" })
  public orderId: number;
}
