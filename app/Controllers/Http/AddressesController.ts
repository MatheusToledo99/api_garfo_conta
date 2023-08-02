import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Address from "App/Models/Address";
import CreateAddressValidator from "App/Validators/CreateAddressValidator";

export default class AddressesController {
  public async store({ request, response, auth }: HttpContextContract) {
    const userAuth = await auth.use("api").authenticate();

    const addressPayload = await request.validate(CreateAddressValidator);

    try {
      //Criar endereço validado
      await Address.create({
        userId: userAuth.userId,
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
  }: HttpContextContract) {
    const userAuth = await auth.use("api").authenticate();

    try {
      const address = await Address.query()
        .where("address_id", params.id)
        .andWhere("user_id", userAuth.userId)
        .firstOrFail();

      address.merge(request.body());

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

  public async destroy({ params, auth, response }: HttpContextContract) {
    const userAuth = await auth.use("api").authenticate();

    try {
      const address = await Address.query()
        .where("address_id", params.id)
        .andWhere("user_id", userAuth.userId)
        .firstOrFail();

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

  public async show({ params, response }: HttpContextContract) {
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
