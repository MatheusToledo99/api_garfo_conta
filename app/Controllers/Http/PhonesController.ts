import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Phone from "App/Models/Phone";
import CreatePhoneValidator from "App/Validators/CreatePhoneValidator";

export default class PhonesController {
  public async store({ request, response, auth }: HttpContextContract) {
    const userAuth = await auth.use("api").authenticate();

    const phoneValidator = await request.validate(CreatePhoneValidator);

    try {
      //Criar endereço validado
      await Phone.create({
        userId: userAuth.userId,
        phoneNumber: phoneValidator.phoneNumber,
        phoneObservation: phoneValidator.phoneObservation,
      });
      response.ok({
        message: "Telefone cadastrado com sucesso",
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

  public async update({
    auth,
    response,
    request,
    params,
  }: HttpContextContract) {
    const userAuth = await auth.use("api").authenticate();

    try {
      const phone = await Phone.query()
        .where("phone_id", params.id)
        .andWhere("user_id", userAuth.userId)
        .firstOrFail();

      phone.merge(request.body());

      await phone.save();

      response.ok({
        message: "Telefone atualizado com sucesso",
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

  public async destroy({ params, auth, response }: HttpContextContract) {
    const userAuth = await auth.use("api").authenticate();

    try {
      const phone = await Phone.query()
        .where("phone_id", params.id)
        .andWhere("user_id", userAuth.userId)
        .firstOrFail();

      await phone.delete();

      response.ok({
        message: "Telefone deletado com sucesso",
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

  public async show({ params, response }: HttpContextContract) {
    try {
      const phone = await Phone.findByOrFail("phone_id", params.id);

      response.ok({
        message: phone,
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
