import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Address extends BaseModel {
  @column({ isPrimary: true, serializeAs: "addressId" })
  public addressId: number;

  @column({ serializeAs: "userId" })
  public userId: number;

  @column({ serializeAs: "addressCep" })
  public addressCep: string;

  @column({ serializeAs: "addressStreet" })
  public addressStreet: string;

  @column({ serializeAs: "addressNumber" })
  public addressNumber: string;

  @column({ serializeAs: "addressComplement" })
  public addressComplement: string | null;

  @column({ serializeAs: "addressCity" })
  public addressCity: string;

  @column({ serializeAs: "addressDistrict" })
  public addressDistrict: string;

  @column({ serializeAs: "addressUf" })
  public addressUf: string;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public addressCreatedAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public addressUpdatedAt: DateTime;
}
