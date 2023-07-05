import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "addresses";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("address_id").primary();
      table
        .integer("user_id")
        .unique()
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.string("address_cep", 9).notNullable();
      table.string("address_street", 180).notNullable();
      table.string("address_number", 10).notNullable().defaultTo("SN");
      table.string("address_complement", 180).nullable();
      table.string("address_city", 180).notNullable();
      table.string("address_district", 180).notNullable();
      table.string("address_uf", 2).notNullable();
      table.timestamp("address_created_at", { useTz: true });
      table.timestamp("address_updated_at", { useTz: true });
    });
  }
  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
