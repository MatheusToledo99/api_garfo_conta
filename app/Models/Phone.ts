import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Phone extends BaseModel {
  @column({ isPrimary: true, serializeAs: "phoneId" })
  public phoneId: number;

  @column({ serializeAs: "userId" })
  public userId: number;

  @column({ serializeAs: "phoneNumber" })
  public phoneNumber: string;

  @column({ serializeAs: "phoneObservation" })
  public phoneObservation: string | null;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public phoneCreatedAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public phoneUpdatedAt: DateTime;
}
