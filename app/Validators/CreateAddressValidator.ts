import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateAddressValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    userId: schema.number([
      rules.unique({ table: "addresses", column: "user_id" }),
      rules.exists({ table: "users", column: "user_id" }),
    ]),
    addressCep: schema.string({ trim: true }, [
      rules.minLength(9),
      rules.maxLength(9),
    ]),
    addressStreet: schema.string({ trim: true }),
    addressNumber: schema.string({ trim: true }),
    addressComplement: schema.string.nullableAndOptional({ trim: true }),
    addressCity: schema.string({ trim: true }),
    addressDistrict: schema.string({ trim: true }),
    addressUf: schema.string({ trim: true }, [
      rules.minLength(2),
      rules.maxLength(2),
    ]),
  });

  public messages: CustomMessages = {
    required: "Campos obrigatórios não preenchidos",
    "userId.unique": "Já existe um endereço cadastrado para este cliente",
    "userId.exists": "Este usuário não existe no sistema",
    "addressCep.minLength": "CEP inválido - mínimo de 9 dígitos",
    "addressCep.maxLength": "CEP inválido - máximo de 9 dígitos",
    "addressUf.minLength": "UF inválida",
    "addressUf.maxLength": "UF inválida",
  };
}
