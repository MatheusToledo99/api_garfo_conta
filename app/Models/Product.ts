import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Product extends BaseModel {
  @column({ isPrimary: true, serializeAs: "productId" })
  public productId: number;

  @column({ serializeAs: "categoryId" })
  public categoryId: number;

  @column({ serializeAs: "unitId" })
  public unitId: number;

  @column({ serializeAs: "productName" })
  public productName: string;

  @column({ serializeAs: "productImage" })
  public productImage: string | null;

  @column({ serializeAs: "productPrice" })
  public productPrice: number;

  @column({ serializeAs: "productBlocked" })
  public productBlocked: boolean;

  @column({ serializeAs: "productDescription" })
  public productDescription: string | null;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public productCreatedAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public productUpdatedAt: DateTime;
}
