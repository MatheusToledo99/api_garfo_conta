import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Establishment from "App/Models/Establishment";
// import Manager from "App/Models/Manager";
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

    await bouncerUser
      .with("AuthPolicy")
      .authorize("createEstablishmentOrManager");

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
        Result: "Sucesso",
        Message: "Estabelecimento cadastrado com sucesso",
      });
    } catch (error) {
      trx.rollback();
      console.log(error);
      response.badRequest({
        Result: "Erro",
        Message: "Ocorreu um erro inesperado, verifique as informações",
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
        Result: "Sucesso",
        Message: establishment,
      });
    } catch (error) {
      response.internalServerError({
        Result: "Erro",
        Message: "Não foi possível encontrar este estabelecimento",
      });
    }
  }
}
