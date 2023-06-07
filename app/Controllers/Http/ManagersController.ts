import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Manager from "App/Models/Manager";
import User from "App/Models/User";

export default class ManagersController {
  public async store({
    request,
    response,
    bouncer,
    auth,
  }: HttpContextContract) {
    const body = request.body();

    const userAuth = await auth.use("api").authenticate();

    const trx = await Database.transaction();

    try {
      const bouncerUser = bouncer.forUser(userAuth);

      if (
        await bouncerUser
          .with("AuthPolicy")
          .denies("createEstablishmentOrManager")
      ) {
        return response.unauthorized({
          Result: "Erro",
          Message: "Você não tem autorização para executar esta operação",
        });
      }

      //Construir primeiramente o usuário do sistema

      const user = await User.create(
        {
          userCpfCnpj: body.userCpfCnpj,
          userName: body.userName,
          userBlocked: body.userBlocked,
          userEmail: body.userEmail,
          password: body.userPassword,
          userType: "ADMINISTRADOR",
        },
        { client: trx }
      );

      await Manager.create(
        {
          managerCode: body.managerCode,
          userId: user.userId,
        },
        { client: trx }
      );

      trx.commit();
      response.ok({
        Result: "Sucesso",
        Message: "Administrador cadastrado com sucesso",
      });
    } catch (error) {
      trx.rollback();
      response.badRequest({
        Result: "Erro",
      });
    }
  }
}
