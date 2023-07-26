import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Category from "App/Models/Category";
import CreateCategoryValidator from "App/Validators/CreateCategoryValidator";

export default class CategoriesController {
  public async store({
    request,
    response,
    auth,
    bouncer,
  }: HttpContextContract) {
    const userAuth = await auth.use("api").authenticate();

    const bouncerUser = bouncer.forUser(userAuth);
    await bouncerUser.with("AuthPolicy").authorize("onlyManagerOrMaster");

    const categoryPayload = await request.validate(CreateCategoryValidator);

    try {
      //Criar endereço validado
      await Category.create({
        establishmentId: categoryPayload.establishmentId,
        categoryName: categoryPayload.categoryName,
        categoryDescription: categoryPayload.categoryDescription,
      });
      response.ok({
        message: "Categoria cadastrada com sucesso",
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

    const bouncerUser = bouncer.forUser(userAuth);

    await bouncerUser.with("AuthPolicy").authorize("onlyManagerOrMaster");

    try {
      const category = await Category.findByOrFail("category_id", params.id);

      category.merge(request.body());

      await category.save();

      response.ok({
        message: "Categoria atualizada com sucesso",
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

    const category = await Category.findByOrFail("category_id", params.id);

    const bouncerUser = bouncer.forUser(userAuth);

    await bouncerUser.with("AuthPolicy").authorize("onlyManagerOrMaster");

    try {
      await category.delete();

      response.ok({
        message: "Categoria deletada com sucesso",
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

  public async allCategoriesProducts({ response, params }) {
    try {
      const categoriesProducts: Category[] = await Category.query()
        .preload("products")
        .where("establishment_id", params.id);

      response.ok({
        message: categoriesProducts,
      });
    } catch (error) {
      response.internalServerError({
        errors: [
          {
            message:
              "Não foi possível retornar todas as categorias com os produtos",
          },
        ],
      });
    }
  }
}
