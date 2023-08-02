import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Product from "App/Models/Product";
import CreateProductValidator from "App/Validators/CreateProductValidator";

export default class ProductsController {
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

    const productPayload = await request.validate(CreateProductValidator);

    try {
      //Criar endereço validado
      await Product.create({
        categoryId: productPayload.categoryId,
        unitId: productPayload.unitId,
        productName: productPayload.productName,
        productId: productPayload.categoryId,
        productImage: productPayload.productImage,
        productPrice: productPayload.productPrice,
        productDescription: productPayload.productDescription,
        productBlocked: productPayload.productBlocked,
      });
      response.ok({
        message: "Produto cadastrado com sucesso",
      });
    } catch (error) {
      console.log(error);
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

    await bouncer
      .forUser(userAuth)
      .with("AuthPolicy")
      .authorize("manager_establishment");

    try {
      const product = await Product.findByOrFail("product_id", params.id);

      product.merge(request.body());

      await product.save();

      response.ok({
        message: "Produto atualizado com sucesso",
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

    await bouncer
      .forUser(userAuth)
      .with("AuthPolicy")
      .authorize("manager_establishment");

    try {
      const product = await Product.findByOrFail("product_id", params.id);

      await product.delete();

      response.ok({
        message: "Produto deletado com sucesso",
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
