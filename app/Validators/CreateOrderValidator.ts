import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateOrderValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    billId: schema.number([
      rules.exists({ table: "bills", column: "bill_id" }),
    ]),
    orderObservation: schema.string.optional([rules.maxLength(500)]),
    orderResponsible: schema.string.optional([rules.maxLength(180)]),
  });

  public messages: CustomMessages = {
    required: "Campos obrigatórios não preenchidos",
    "billId.exists": "Esta comanda não existe no sistema",
    "orderObservation.maxLength": "Observação pode ter até 500 caracteres",
    "orderResponsible.maxLength": "Responsável pode ter até 180 caracteres",
  };
}
