import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateCategoryValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    establishmentId: schema.number([
      rules.exists({ table: "establishments", column: "establishment_id" }),
    ]),
    categoryName: schema.string({ trim: true }, [
      rules.minLength(3),
      rules.maxLength(255),
    ]),
    categoryDescription: schema.string.nullableAndOptional({ trim: true }, [
      rules.maxLength(500),
    ]),
  });

  public messages: CustomMessages = {
    required: "Campos obrigatórios não preenchidos",
    "establishmentId.exists": "Este estabelecimento não existe no sistema",
    "categoryName.minLength": "Nome inválido",
    "categoryName.maxLength": "Nome pode ter até 255 caracteres",
    "categoryDescription.maxLength": "Descrição pode ter até 500 caracteres",
  };
}
