import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Bill from "App/Models/Bill";
import CreateBillValidator from "App/Validators/CreateBillValidator";

export default class BillsController {
  public async store({
    request,
    response,
    auth,
    bouncer,
  }: HttpContextContract) {
    const userAuth = await auth.use("api").authenticate();

    await bouncer
      .forUser(userAuth)
      .with("AuthPolicy")
      .authorize("manager_establishment");

    const existsBill = await Bill.query()
      .where("bill_name", request.input("billName"))
      .andWhere("establishment_id", request.input("establishmentId"))
      .first();

    if (existsBill) {
      return response.badRequest({
        errors: [
          {
            message: "Esta comanda já existe",
          },
        ],
      });
    }

    const billPayload = await request.validate(CreateBillValidator);

    try {
      //Criar comanda validada
      await Bill.create({
        establishmentId: billPayload.establishmentId,
        billName: billPayload.billName,
        billBusy: false,
      });

      response.ok({
        message: "Comanda cadastrada com sucesso",
      });
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

  public async update({
    auth,
    response,
    request,
    params,
    bouncer,
  }: HttpContextContract) {
    const userAuth = await auth.use("api").authenticate();

    const body = request.body();

    const bill = await Bill.findByOrFail("bill_id", params.id);

    await bouncer
      .forUser(userAuth)
      .with("AuthPolicy")
      .authorize("manager_establishment");

    try {
      bill.merge(body);

      await bill.save();

      response.ok({
        message: "Comanda atualizada com sucesso",
      });
    } catch (error) {
      response.internalServerError({
        errors: [
          {
            message: "Erro ao atualizar os dados",
          },
        ],
      });
    }
  }

  public async destroy({
    params,
    auth,
    response,
    bouncer,
  }: HttpContextContract) {
    const userAuth = await auth.use("api").authenticate();

    await bouncer
      .forUser(userAuth)
      .with("AuthPolicy")
      .authorize("manager_establishment");

    try {
      const bill = await Bill.findByOrFail("address_id", params.id);

      await bill.delete();

      response.ok({
        message: "Comanda deletada com sucesso",
      });
    } catch (error) {
      response.internalServerError({
        errors: [
          {
            message: "Erro ao deletar esta comanda",
          },
        ],
      });
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const bill = await Bill.findByOrFail("bill_id", params.id);
      response.ok({
        message: bill,
      });
    } catch (error) {
      response.internalServerError({
        errors: [
          {
            message: "Erro ao recuperar a comanda",
          },
        ],
      });
    }
  }

  public async allBillsByEstablishment({
    params,
    response,
  }: HttpContextContract) {
    try {
      const bill = await Bill.query()
        .where("establishment_id", params.id)
        .orderBy("bill_name");
      response.ok({
        message: bill,
      });
    } catch (error) {
      response.internalServerError({
        errors: [
          {
            message: "Erro ao recuperar as comandas",
          },
        ],
      });
    }
  }

  public async openOrderBill({ params, response }: HttpContextContract) {
    try {
      const bill = await Bill.query()
        .preload("ordersOpen", (products) => {
          products.preload("products");
        })
        .where("bill_id", params.id)
        .firstOrFail();

      response.ok(bill);
    } catch (error) {
      response.internalServerError({
        errors: [
          {
            message: "Erro ao recuperar os itens",
          },
        ],
      });
    }
  }
}
