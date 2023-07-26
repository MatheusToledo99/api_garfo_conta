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

    const bouncerUser = bouncer.forUser(userAuth);

    await bouncerUser.with("AuthPolicy").authorize("onlyManagerOrMaster");

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
        billBusy: billPayload.billBusy,
      });

      response.ok({
        message: "Comanda cadastrada com sucesso",
      });
    } catch (error) {
      console.log(error);
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

    const bouncerUser = bouncer.forUser(userAuth);

    await bouncerUser.with("AuthPolicy").authorize("onlyManagerOrMaster");

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
            message:
              "Ocorreu um erro, verifique as informações e tente novamente",
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

    const bouncerUser = bouncer.forUser(userAuth);

    await bouncerUser.with("AuthPolicy").authorize("onlyManagerOrMaster");

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
            message:
              "Ocorreu um erro, verifique as informações e tente novamente",
          },
        ],
      });
    }
  }

  public async show({ params, auth, response }: HttpContextContract) {
    await auth.use("api").authenticate();

    try {
      const bill = await Bill.findByOrFail("bill_id", params.id);
      response.ok({
        message: bill,
      });
    } catch (error) {
      response.internalServerError({
        errors: [
          {
            message: "Ocorreu um erro, comanda não encontrada",
          },
        ],
      });
    }
  }

  public async allBillsByEstablishment({
    params,
    auth,
    response,
  }: HttpContextContract) {
    await auth.use("api").authenticate();

    try {
      const bill = await Bill.query().where("establishment_id", params.id);
      response.ok({
        message: bill,
      });
    } catch (error) {
      response.internalServerError({
        errors: [
          {
            message: "Ocorreu um erro, comanda não encontrada",
          },
        ],
      });
    }
  }

  public async checkBusy({ params, auth, response }: HttpContextContract) {
    await auth.use("api").authenticate();
    try {
      const bill = await Bill.findByOrFail("bill_id", params.id);

      if (bill.billBusy) {
        return response.ok({
          message: {
            busy: true,
          },
        });
      }

      return response.ok({
        message: { busy: false },
      });
    } catch (error) {
      response.internalServerError({
        errors: [
          {
            message: "Ocorreu um erro, comanda não encontrada",
          },
        ],
      });
    }
  }
}
