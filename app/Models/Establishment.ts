import { DateTime } from "luxon";
import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import User from "./User";

export default class Establishment extends BaseModel {
  @column({ isPrimary: true, serializeAs: "establishmentId" })
  public establishmentId: number;

  @column({ serializeAs: "userId" })
  public userId: number;

  @column({ serializeAs: "establishmentFantasy" })
  public establishmentFantasy: string;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public establishmentCreatedAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public establishmentUpdatedAt: DateTime;

  @belongsTo(() => User, {
    localKey: "userId",
    foreignKey: "userId",
  })
  public userEstablishment: BelongsTo<typeof User>;
}
