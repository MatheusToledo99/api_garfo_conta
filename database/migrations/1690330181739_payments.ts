import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "payments";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("payment_id").primary();
      table.string("payment_description", 180).notNullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
