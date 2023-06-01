import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "managers";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("manager_id");
      table
        .integer("user_id")
        .unique()
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.string("manager_code").notNullable().unique();
      table.timestamp("manager_created_at", { useTz: true });
      table.timestamp("manager_updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
