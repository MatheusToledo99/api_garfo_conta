import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Employee from "App/Models/Employee";
import Establishment from "App/Models/Establishment";
import User from "App/Models/User";

export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    const userCpfCnpj = request.input("userCpfCnpj");
    const userPassword = request.input("userPassword");

    try {
      const user = await User.findByOrFail("user_cpf_cnpj", userCpfCnpj);
      const token = await auth.use("api").attempt(userCpfCnpj, userPassword, {
        expiresIn: "30days",
        name: user.userCpfCnpj,
      });

      // await Database.rawQuery(
      //   "delete from api_tokens where user_id = ? and token != ?",
      //   [user.userId, token.tokenHash]
      // );

      response.ok({ message: token });
    } catch (error) {
      response.internalServerError({
        errors: [
          {
            message: "Credenciais inválidas",
          },
        ],
      });
    }
  }

  public async me({ auth, response }: HttpContextContract) {
    const userAuth = await auth.use("api").authenticate();
    try {
      let user;
      if (userAuth.userType == "FUNCIONARIO") {
        user = await Employee.query()
          .where("user_id", userAuth.userId)
          .preload("userEmployee", (user) => {
            user.preload("userAddress"), user.preload("userPhone");
          })
          .preload("establishment", (establishment) => {
            establishment.preload("userEstablishment");
          })
          .firstOrFail();
      } else {
        user = await Establishment.query()
          .where("user_id", userAuth.userId)
          .preload("userEstablishment", (user) => {
            user.preload("userAddress"), user.preload("userPhone");
          })
          .firstOrFail();
      }

      response.ok({
        message: user,
      });
    } catch (error) {
      response.internalServerError({
        errors: [
          {
            message: "Erro ao autenticar",
          },
        ],
      });
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    try {
      await auth.use("api").revoke();
      response.ok({
        message: "Sucesso ao realizar o logout",
      });
    } catch (error) {
      response.internalServerError({
        errors: [
          {
            message: "Erro ao realizar o logout",
          },
        ],
      });
    }
  }
}
