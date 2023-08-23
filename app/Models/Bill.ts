import { BaseModel, HasMany, column, hasMany } from "@ioc:Adonis/Lucid/Orm";
import Order from "./Order";

export default class Bill extends BaseModel {
  @column({ isPrimary: true, serializeAs: "billId" })
  public billId: number;

  @column({ serializeAs: "establishmentId" })
  public establishmentId: number;

  @column({ serializeAs: "billName" })
  public billName: string;

  @column({ serializeAs: "billBusy" })
  public billBusy: boolean;

  @hasMany(() => Order, {
    foreignKey: "billId",
    localKey: "billId",
    onQuery(query) {
      query.where("order_open", true);
    },
    serializeAs: "order",
  })
  public ordersOpen: HasMany<typeof Order>;
}
