import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Address from "App/Models/Address";
import Establishment from "App/Models/Establishment";
import CreateAddressValidator from "App/Validators/CreateAddressValidator";

export default class AddressesController {
  public async store({
    request,
    response,
    auth,
    bouncer,
  }: HttpContextContract) {
    const userAuth = await auth.use("api").authenticate();

    const addressPayload = await request.validate(CreateAddressValidator);

    const establishment = await Establishment.findBy(
      "user_id",
      request.input("userId")
    );

    if (establishment) {
      const bouncerUser = bouncer.forUser(userAuth);

      await bouncerUser.with("AuthPolicy").authorize("onlyManagerOrMaster");
    }

    try {
      //Criar endereço validado
      await Address.create({
        userId: addressPayload.userId,
        addressCep: addressPayload.addressCep,
        addressStreet: addressPayload.addressStreet,
        addressNumber: addressPayload.addressNumber,
        addressComplement: addressPayload.addressComplement,
        addressCity: addressPayload.addressCity,
        addressDistrict: addressPayload.addressDistrict,
        addressUf: addressPayload.addressUf,
      });
      response.ok({
        message: "Endereço cadastrado com sucesso",
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

    const body = request.body();

    const address = await Address.findByOrFail("address_id", params.id);

    const establishment = await Establishment.findBy("user_id", address.userId);

    if (establishment) {
      const bouncerUser = bouncer.forUser(userAuth);

      await bouncerUser.with("AuthPolicy").authorize("onlyManagerOrMaster");
    }

    try {
      address.merge(body);

      await address.save();

      response.ok({
        message: "Endereço atualizado com sucesso",
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

    const address = await Address.findByOrFail("address_id", params.id);

    const establishment = await Establishment.findBy("user_id", address.userId);

    if (establishment) {
      const bouncerUser = bouncer.forUser(userAuth);

      await bouncerUser.with("AuthPolicy").authorize("onlyManagerOrMaster");
    }

    try {
      await address.delete();

      response.ok({
        message: "Endereço deletado com sucesso",
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
      const address = await Address.findByOrFail("address_id", params.id);

      response.ok({
        message: address,
      });
    } catch (error) {
      response.internalServerError({
        errors: [
          {
            message: "Ocorreu um erro, endereço não encontrado",
          },
        ],
      });
    }
  }
}
