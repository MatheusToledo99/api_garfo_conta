import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Establishment from "App/Models/Establishment";
import Manager from "App/Models/Manager";
import User from "App/Models/User";

export default class EstablishmentsController {
  public async store({ request, response, auth }: HttpContextContract) {
    const body = request.body();

    const userAuth = await auth.use("api").authenticate();

    const manager = await Manager.findByOrFail("user_id", userAuth.userId);

    const trx = await Database.transaction();

    try {
      //Construir primeiramente o usuário do sistema

      if (!manager) throw "Você não está autorizado a realizar esta operação";

      const user = await User.create(
        {
          userCpfCnpj: body.userCpfCnpj,
          userName: body.userName,
          userBlocked: body.userBlocked,
          userEmail: body.userEmail,
          password: body.userPassword,
        },
        { client: trx }
      );

      await Establishment.create(
        {
          establishmentFantasy: body.establishmentFantasy,
          userId: user.userId,
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
      response.badRequest({
        Result: "Erro",
        Message: !manager
          ? error
          : "Ocorreu um erro inesperado, verifique as informações",
      });
    }
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      const establishment = await Establishment.findByOrFail(
        "establishment_id",
        params.id
      );

      const user = await User.findByOrFail("user_id", establishment.userId);

      response.ok({
        Result: "Sucesso",
        Message: { user, establishment },
      });
    } catch (error) {
      response.internalServerError({
        Result: "Erro",
        Message: "Não foi possível encontrar este estabelecimento",
      });
    }
  }
}
