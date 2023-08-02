import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "establishments";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("establishment_id").primary();
      table
        .integer("user_id")
        .unique()
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.string("establishment_fantasy", 100);
      table.timestamp("establishment_created_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
