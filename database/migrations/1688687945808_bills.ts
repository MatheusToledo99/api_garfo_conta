import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "bills";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("bill_id").primary();
      table
        .integer("establishment_id")
        .unsigned()
        .notNullable()
        .references("establishment_id")
        .inTable("establishments")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.string("bill_name", 180).notNullable();
      table.boolean("bill_busy").notNullable().defaultTo(false);
      table.timestamp("bill_created_at", { useTz: true });
      table.timestamp("bill_updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
