import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Unit extends BaseModel {
  @column({ isPrimary: true })
  public unitId: number;

  @column()
  public unitDescription: string;

  @column.dateTime({ autoCreate: true })
  public unitCreatedAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public unitUpdatedAt: DateTime;
}
