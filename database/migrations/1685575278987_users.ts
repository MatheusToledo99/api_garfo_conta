import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "users";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("user_id").primary();
      table.string("user_cpf_cnpj", 18).notNullable().unique();
      table.string("user_name", 100).notNullable();
      table.boolean("user_blocked").notNullable().defaultTo(false);
      table.string("user_email", 255).notNullable().unique();
      table.string("user_password", 180).notNullable();
      table.string("user_type", 20).notNullable().defaultTo("FUNCIONARIO");
      table.string("remember_me_token").nullable();
      table.timestamp("user_created_at", { useTz: true }).notNullable();
      table.timestamp("user_updated_at", { useTz: true }).notNullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
