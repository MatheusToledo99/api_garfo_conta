import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "employees";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("employee_id");
      table
        .integer("user_id")
        .unique()
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table
        .integer("establishment_id")
        .unsigned()
        .notNullable()
        .references("establishment_id")
        .inTable("establishments")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.string("employee_type", 20).notNullable().defaultTo("APOIO");
      table.timestamp("employee_created_at", { useTz: true });
      table.timestamp("employee_updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
