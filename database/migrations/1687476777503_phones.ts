import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "phones";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("phone_id").primary();
      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.string("phone_number", 20).notNullable();
      table.string("phone_observation", 180).nullable();
      table.timestamp("phone_created_at", { useTz: true });
      table.timestamp("phone_updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
