import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Bill extends BaseModel {
  @column({ isPrimary: true })
  public billId: number;

  @column({ serializeAs: "establishmentId" })
  public establishmentId: number;

  @column({ serializeAs: "billName" })
  public billName: string;

  @column({ serializeAs: "billBusy" })
  public billBusy: boolean;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public billCreatedAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public billUpdatedAt: DateTime;
}
