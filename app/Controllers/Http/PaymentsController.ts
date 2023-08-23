import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Payment from "App/Models/Payment";

export default class PaymentsController {
  public async getPayments({ response }: HttpContextContract) {
    try {
      const payments = await Payment.all();

      response.ok({ message: payments });
    } catch (error) {
      response.internalServerError({
        errors: [
          {
            message:
              "Ocorreu um erro, verifique as informações e tente novamente",
          },
        ],
      });
    }
  }
}
