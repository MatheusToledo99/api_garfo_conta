import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import User from "./User";

export default class Manager extends BaseModel {
  @column({ isPrimary: true, serializeAs: "managerId" })
  public managerId: number;

  @column({ serializeAs: "userId" })
  public userId: number;

  @belongsTo(() => User, {
    localKey: "userId",
    foreignKey: "userId",
  })
  public userManager: BelongsTo<typeof User>;
}
