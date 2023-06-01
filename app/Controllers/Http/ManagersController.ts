import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Manager from "App/Models/Manager";
import User from "App/Models/User";

export default class ManagersController {
  public async store({ request, response }: HttpContextContract) {
    const body = request.body();

    const trx = await Database.transaction();

    try {
      //Construir primeiramente o usuário do sistema

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
        Message: "Moderador cadastrado com sucesso",
      });
    } catch (error) {
      trx.rollback();
      response.badRequest({
        Result: "Erro",
      });
    }
  }
}
