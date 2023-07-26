import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "categories";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("category_id").primary();
      table
        .integer("establishment_id")
        .unique()
        .unsigned()
        .notNullable()
        .references("establishment_id")
        .inTable("establishments")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.string("category_name", 255).notNullable();
      table.string("category_description", 500).nullable();
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
