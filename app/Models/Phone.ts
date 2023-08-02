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
}
