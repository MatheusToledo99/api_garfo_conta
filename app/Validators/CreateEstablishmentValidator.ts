import { schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateEstablishmentValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    establishmentFantasy: schema.string({ trim: true }),
  });

  public messages: CustomMessages = {
    required: "Campos obrigatórios não preenchidos",
  };
}
