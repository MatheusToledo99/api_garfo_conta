import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    userCpfCnpj: schema.string({ trim: true }, [
      rules.unique({ table: "users", column: "user_cpf_cnpj" }),
    ]),

    userName: schema.string({ trim: true }),

    userBlocked: schema.boolean.optional(),

    userEmail: schema.string.nullable({ trim: true }, [
      rules.unique({ table: "users", column: "user_email" }),
      rules.email(),
    ]),

    userPassword: schema.string({ trim: true }, [
      rules.minLength(3),
      rules.maxLength(16),
    ]),
  });

  public messages: CustomMessages = {
    required: "Campos obrigatórios não preenchidos",
    "userCpfCnpj.unique": "Este CPF ou CNPJ já está cadastrado",
    "userEmail.unique": "Este email já está cadastrado",
    "userEmail.email": "Email inválido",
  };
}
