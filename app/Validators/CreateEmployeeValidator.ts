import { schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateEmployeeValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    establishmentId: schema.number(),
  });

  public messages: CustomMessages = {
    required: "Campos obrigatórios não preenchidos",
  };
}
