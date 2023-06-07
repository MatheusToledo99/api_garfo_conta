import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Employee from "App/Models/Employee";
import Establishment from "App/Models/Establishment";
import User from "App/Models/User";

export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    const userCpfCnpj = request.input("userCpfCnpj");
    const userPassword = request.input("userPassword");
    const user = await User.findByOrFail("user_cpf_cnpj", userCpfCnpj);
    const establishment = await Establishment.findBy("user_id", user.userId);

    try {
      if (establishment) throw "Estabelecimentos não podem ser autenticados";

      const token = await auth.use("api").attempt(userCpfCnpj, userPassword, {
        expiresIn: "30days",
        name: user.userCpfCnpj,
      });

      response.ok({ Result: "Sucesso", Message: token });
    } catch (error) {
      response.badRequest({
        Result: "Erro",
        Message: establishment ? error : "Credenciais inválidas",
      });
    }
  }

  public async me({ auth, response, bouncer }: HttpContextContract) {
    const userAuth = await auth.use("api").authenticate();
    try {
      const employee = await Employee.query()
        .where("user_id", userAuth.userId)
        .preload("userEmployee")
        .preload("establishment", (userEstablishment) => {
          userEstablishment.preload("userEstablishment");
        })
        .firstOrFail();

      const userEstablishment = employee.establishment.userEstablishment;

      if (
        await bouncer
          .forUser(userAuth)
          .with("AuthPolicy")
          .denies("readEmployee", userEstablishment)
      ) {
        return response.unauthorized({
          Result: "Erro",
          Message: "Autenticação não autorizada",
        });
      }

      response.ok({
        Result: "Sucesso",
        Message: employee,
      });
    } catch (error) {
      response.internalServerError({
        Result: "Erro",
        Message: "Erro na requisição, tente novamente",
      });
    }
  }
}
