import { DateTime } from "luxon";
import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import User from "./User";

export default class Manager extends BaseModel {
  @column({ isPrimary: true, serializeAs: "managerId" })
  public managerId: number;

  @column({ serializeAs: "managerCode" })
  public managerCode: string;

  @column({ serializeAs: "userId" })
  public userId: number;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public managerCreatedAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public managerUpdatedAt: DateTime;

  @belongsTo(() => User, {
    localKey: "userId",
    foreignKey: "userId",
  })
  public userManager: BelongsTo<typeof User>;
}
