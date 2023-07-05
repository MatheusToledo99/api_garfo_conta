import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Establishment from "App/Models/Establishment";
import Phone from "App/Models/Phone";
import CreatePhoneValidator from "App/Validators/CreatePhoneValidator";

export default class PhonesController {
  public async store({
    request,
    response,
    auth,
    bouncer,
  }: HttpContextContract) {
    const userAuth = await auth.use("api").authenticate();

    const phoneValidator = await request.validate(CreatePhoneValidator);

    const establishment = await Establishment.findBy(
      "user_id",
      request.input("userId")
    );

    if (establishment) {
      const bouncerUser = bouncer.forUser(userAuth);

      await bouncerUser.with("AuthPolicy").authorize("onlyManagerOrMaster");
    }

    const bouncerUser = bouncer.forUser(userAuth);

    await bouncerUser.with("AuthPolicy").authorize("onlyManagerOrMaster");

    try {
      //Criar endereço validado
      await Phone.create({
        userId: phoneValidator.userId,
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
    bouncer,
  }: HttpContextContract) {
    const userAuth = await auth.use("api").authenticate();

    const phone = await Phone.findByOrFail("phone_id", params.id);

    const establishment = await Establishment.findBy("user_id", phone.userId);

    if (establishment) {
      const bouncerUser = bouncer.forUser(userAuth);

      await bouncerUser.with("AuthPolicy").authorize("onlyManagerOrMaster");
    }

    try {
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

  public async destroy({
    params,
    auth,
    response,
    bouncer,
  }: HttpContextContract) {
    const userAuth = await auth.use("api").authenticate();

    const phone = await Phone.findByOrFail("phone_id", params.id);

    const establishment = await Establishment.findBy("user_id", phone.userId);

    if (establishment) {
      const bouncerUser = bouncer.forUser(userAuth);

      await bouncerUser.with("AuthPolicy").authorize("onlyManagerOrMaster");
    }

    try {
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

  public async show({ params, auth, response }: HttpContextContract) {
    await auth.use("api").authenticate();

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
