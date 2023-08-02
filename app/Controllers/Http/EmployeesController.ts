import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Employee from "App/Models/Employee";
import User from "App/Models/User";
import CreateEmployeeValidator from "App/Validators/CreateEmployeeValidator";
import CreateUserValidator from "App/Validators/CreateUserValidator";

export default class EmployeesController {
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

    const trx = await Database.transaction();

    const userPayload = await request.validate(CreateUserValidator);
    const employeePayload = await request.validate(CreateEmployeeValidator);

    try {
      //Construir primeiramente o usuário do sistema

      const user = await User.create(
        {
          userCpfCnpj: userPayload.userCpfCnpj,
          userName: userPayload.userName,
          userBlocked: userPayload.userBlocked,
          userEmail: userPayload.userEmail,
          password: userPayload.userPassword,
          userType: "FUNCIONARIO",
        },
        { client: trx }
      );

      await Employee.create(
        {
          userId: user.userId,
          establishmentId: employeePayload.establishmentId,
        },
        { client: trx }
      );

      trx.commit();
      response.ok({
        message: "Usuário cadastrado com sucesso",
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

  public async show({ response, params }: HttpContextContract) {
    try {
      const employee = await Employee.query()
        .where("employee_id", params.id)
        .preload("userEmployee", (infoUser) => {
          infoUser.preload("userPhone");
          infoUser.preload("userAddress");
        })
        .preload("establishment", (userEstablishment) => {
          userEstablishment.preload("userEstablishment");
        })
        .firstOrFail();

      response.ok({
        message: {
          employee,
        },
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
