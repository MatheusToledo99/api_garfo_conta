import { BaseModel, HasMany, column, hasMany } from "@ioc:Adonis/Lucid/Orm";
import Product from "./Product";

export default class Category extends BaseModel {
  @column({ isPrimary: true, serializeAs: "categoryId" })
  public categoryId: number;

  @column({ serializeAs: "establishmentId" })
  public establishmentId: number;

  @column({ serializeAs: "categoryName" })
  public categoryName: string;

  @column({ serializeAs: "categoryDescription" })
  public categoryDescription: string | null;

  @hasMany(() => Product, {
    foreignKey: "categoryId",
    localKey: "categoryId",
  })
  public products: HasMany<typeof Product>;
}
