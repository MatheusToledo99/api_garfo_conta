import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "product_orders";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("product_order_id").primary();
      table
        .integer("product_id")
        .unsigned()
        .notNullable()
        .references("product_id")
        .inTable("products")
        .onDelete("RESTRICT")
        .onUpdate("CASCADE");
      table
        .integer("order_id")
        .unsigned()
        .notNullable()
        .references("order_id")
        .inTable("orders")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.string("product_order_status").notNullable().defaultTo("ABERTO");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
