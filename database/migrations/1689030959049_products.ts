import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "products";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("product_id").primary();
      table
        .integer("category_id")
        .unsigned()
        .notNullable()
        .references("category_id")
        .inTable("categories")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table
        .integer("unit_id")
        .unsigned()
        .notNullable()
        .references("unit_id")
        .inTable("units")
        .onDelete("RESTRICT")
        .onUpdate("CASCADE");
      table.string("product_name", 255).notNullable();
      table
        .decimal("product_price", 10, 2)
        .unsigned()
        .notNullable()
        .defaultTo(0.0);
      table.string("product_image", 500).nullable();
      table.string("product_description", 500).nullable();
      table.boolean("product_blocked").notNullable().defaultTo(false);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
