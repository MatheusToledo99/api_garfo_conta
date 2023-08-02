import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Unit extends BaseModel {
  @column({ isPrimary: true })
  public unitId: number;

  @column()
  public unitDescription: string;
}
