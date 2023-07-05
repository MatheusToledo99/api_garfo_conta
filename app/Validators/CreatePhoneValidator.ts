import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreatePhoneValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    userId: schema.number([
      rules.exists({ table: "users", column: "user_id" }),
    ]),
    phoneNumber: schema.string({ trim: true }, [
      rules.minLength(9),
      rules.maxLength(20),
    ]),
    phoneObservation: schema.string.nullableAndOptional({ trim: true }),
  });

  public messages: CustomMessages = {
    required: "Campos obrigatórios não preenchidos",
    "userId.exists": "Este usuário não existe no sistema",
    "phoneNumber.minLength": "Telefone inválido",
    "phoneNumber.maxLength": "Telefone inválido",
  };
}
