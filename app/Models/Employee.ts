import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import Establishment from "./Establishment";
import User from "./User";

export default class Employee extends BaseModel {
  @column({ isPrimary: true, serializeAs: "employeeId" })
  public employeeId: number;

  @column({ serializeAs: "userId" })
  public userId: number;

  @column({ serializeAs: "establishmentId" })
  public establishmentId: number;

  @belongsTo(() => Establishment, {
    localKey: "establishmentId",
    foreignKey: "establishmentId",
  })
  public establishment: BelongsTo<typeof Establishment>;

  @belongsTo(() => User, {
    localKey: "userId",
    foreignKey: "userId",
  })
  public userEmployee: BelongsTo<typeof User>;
}
