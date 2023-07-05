import Logger from "@ioc:Adonis/Core/Logger";
import HttpExceptionHandler from "@ioc:Adonis/Core/HttpExceptionHandler";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger);
  }

  async handle(error: any, ctx: HttpContextContract): Promise<any> {
    if (error.code === "E_AUTHORIZATION_FAILURE") {
      return ctx.response.status(403).send({
        errors: [
          {
            message: "Você não tem privilégios para realizar essa operação",
          },
        ],
      });
    }

    await super.handle(error, ctx);
  }
}
