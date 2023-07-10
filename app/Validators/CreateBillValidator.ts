import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateBillValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    establishmentId: schema.number([
      rules.exists({ table: "establishments", column: "establishment_id" }),
    ]),
    billName: schema.string({ trim: true }, [rules.maxLength(180)]),
    billBusy: schema.boolean.optional(),
  });

  public messages: CustomMessages = {
    required: "Campos obrigatórios não preenchidos",
    "establishmentId.exists":
      "A comanda deve ser cadastrada em um estabelecimento válido",
    "billName.maxLength": "Nome inválido, máximo de 180 caracteres",
  };
}
