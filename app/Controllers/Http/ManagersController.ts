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
    const userAuth = await auth.use("api").authenticate();

    const bouncerUser = bouncer.forUser(userAuth);

    await bouncerUser.with("AuthPolicy").authorize("onlyManager");

    const trx = await Database.transaction();

    const body = request.body();

    try {
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
        message: "Administrador cadastrado com sucesso",
      });
    } catch (error) {
      trx.rollback();
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
