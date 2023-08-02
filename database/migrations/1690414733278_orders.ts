import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "orders";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("order_id").primary();
      table
        .integer("bill_id")
        .unsigned()
        .notNullable()
        .references("bill_id")
        .inTable("bills")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table
        .integer("payment_id")
        .unsigned()
        .notNullable()
        .references("payment_id")
        .inTable("payments")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.decimal("order_value").notNullable().defaultTo(0.0).unsigned();
      table.decimal("order_discount").notNullable().defaultTo(0.0).unsigned();
      table.string("order_observation", 500).nullable();
      table
        .string("order_responsible", 180)
        .notNullable()
        .defaultTo("INDEFINIDO");
      table.boolean("order_open").notNullable().defaultTo(false);
      table.timestamp("order_created_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
