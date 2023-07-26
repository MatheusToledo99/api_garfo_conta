import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Payment extends BaseModel {
  @column({ isPrimary: true, serializeAs: "paymentId" })
  public paymentId: number;

  @column({ serializeAs: "paymentDescription" })
  public paymentDescription: string;
}
