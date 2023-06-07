import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Employee from "App/Models/Employee";
import User from "App/Models/User";

export default class EmployeesController {
  public async store({
    request,
    response,
    auth,
    bouncer,
  }: HttpContextContract) {
    const body = request.body();

    const userAuth = await auth.use("api").authenticate();

    const bouncerUser = bouncer.forUser(userAuth);

    await bouncerUser.with("AuthPolicy").authorize("createEmployee");

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
          userType: "FUNCIONARIO",
        },
        { client: trx }
      );

      await Employee.create(
        {
          employeeType: body.employeeType,
          userId: user.userId,
          establishmentId: body.establishmentId,
        },
        { client: trx }
      );

      trx.commit();
      response.ok({
        Result: "Sucesso",
        Message: "Usuário cadastrado com sucesso",
      });
    } catch (error) {
      trx.rollback();
      response.badRequest({
        Result: "Erro",
        Message: "Ocorreu um erro inesperado, verifique as informações",
      });
    }
  }
  public async show({ response, params }: HttpContextContract) {
    try {
      const employee = await Employee.query()
        .where("employee_id", params.id)
        .preload("userEmployee")
        .preload("establishment", (userEstablishment) => {
          userEstablishment.preload("userEstablishment");
        })
        .firstOrFail();

      response.ok({
        Result: "Sucesso",
        Message: {
          employee,
        },
      });
    } catch (error) {
      response.internalServerError({
        Result: "Erro",
      });
    }
  }
}
