import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Employee from "App/Models/Employee";
import Manager from "App/Models/Manager";
import User from "App/Models/User";

export default class EmployeesController {
  public async store({ request, response, auth }: HttpContextContract) {
    const body = request.body();

    const userAuth = await auth.use("api").authenticate();

    const trx = await Database.transaction();

    //Checar se o usuário tem autorização para cadastrar um novo usuário.
    const isManager = await Manager.findBy("user_id", userAuth.userId);

    const isEmployeeAdm = await Employee.query()
      .where("user_id", userAuth.userId)
      .andWhere("employee_type", "adm")
      .first();

    try {
      if (isManager || isEmployeeAdm) {
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
          Message: "Funcionário cadastrado com sucesso",
        });
      } else {
        throw "Você não tem autorização para realizar esta operação";
      }
    } catch (error) {
      trx.rollback();
      response.badRequest({
        Result: "Erro",
        Message:
          isManager || isEmployeeAdm
            ? "Ocorreu um erro inesperado, verifique as informações"
            : error,
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