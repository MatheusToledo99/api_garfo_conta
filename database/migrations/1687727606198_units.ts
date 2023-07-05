import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "units";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("unit_id").primary();
      table.string("unit_description", 4).notNullable().unique();
      table.timestamp("unit_created_at", { useTz: true });
      table.timestamp("unit_updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
