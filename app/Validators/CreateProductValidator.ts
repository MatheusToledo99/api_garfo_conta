import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateProductValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    categoryId: schema.number([
      rules.exists({ table: "categories", column: "category_id" }),
    ]),
    unitId: schema.number([
      rules.exists({ table: "units", column: "unit_id" }),
    ]),
    productName: schema.string([rules.minLength(3), rules.maxLength(255)]),
    productImage: schema.string.nullableAndOptional([rules.maxLength(500)]),
    productDescription: schema.string.nullableAndOptional([
      rules.maxLength(500),
    ]),
    productPrice: schema.number(),
    productBlocked: schema.boolean.optional(),
  });

  public messages: CustomMessages = {
    required: "Campos obrigatórios não preenchidos",
    "categoryId.exists": "Esta categoria não existe no sistema",
    "unitId.exists": "Esta unidade de medida não existe no sistema",
    "productName.minLength": "Nome do produto deve ter mínimo de 3 caracteres",
    "productName.maxLength": "Nome pode ter até 255 caracteres",
    "productImage.maxLength": "Imagem inválida (Máximo 500 caracteres)",
    "productDescription.maxLength": "Descrição pode ter até 500 caracteres",
  };
}
