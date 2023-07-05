import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Establishment from "App/Models/Establishment";
import User from "App/Models/User";
import CreateEstablishmentValidator from "App/Validators/CreateEstablishmentValidator";
import CreateUserValidator from "App/Validators/CreateUserValidator";

export default class EstablishmentsController {
  public async store({
    request,
    response,
    auth,
    bouncer,
  }: HttpContextContract) {
    const userAuth = await auth.use("api").authenticate();

    const bouncerUser = bouncer.forUser(userAuth);

    await bouncerUser.with("AuthPolicy").authorize("onlyManager");

    const trx = await Database.transaction();

    const userPayload = await request.validate(CreateUserValidator);
    const establishmentPayload = await request.validate(
      CreateEstablishmentValidator
    );

    try {
      //Construir primeiramente o usuário do sistema

      const user = await User.create(
        {
          userCpfCnpj: userPayload.userCpfCnpj,
          userName: userPayload.userName,
          userBlocked: userPayload.userBlocked,
          userEmail: userPayload.userEmail,
          password: userPayload.userPassword,
          userType: "ESTABELECIMENTO",
        },
        { client: trx }
      );

      await Establishment.create(
        {
          userId: user.userId,
          establishmentFantasy: establishmentPayload.establishmentFantasy,
        },
        { client: trx }
      );

      trx.commit();
      response.ok({
        message: "Estabelecimento cadastrado com sucesso",
      });
    } catch (error) {
      trx.rollback();
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

  public async show({ response, params }: HttpContextContract) {
    try {
      const establishment = await Establishment.query()
        .where("establishment_id", params.id)
        .preload("userEstablishment")
        .firstOrFail();

      response.ok({
        message: establishment,
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
}
