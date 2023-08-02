import Route from "@ioc:Adonis/Core/Route";

Route.post("login", "AuthController.login");

Route.group(() => {
  // **************************** ROTAS CRUD ****************************
  Route.resource("establishment", "EstablishmentsController").apiOnly();
  Route.resource("employee", "EmployeesController").apiOnly();
  Route.resource("manager", "ManagersController").apiOnly();
  Route.resource("address", "AddressesController").apiOnly();
  Route.resource("phone", "PhonesController").apiOnly();
  Route.resource("bill", "BillsController").apiOnly();
  Route.resource("category", "CategoriesController").apiOnly().except(["show"]);
  Route.resource("product", "ProductsController").apiOnly().except(["show"]);
  Route.resource("order", "OrdersController").apiOnly();

  // ************************ ROTAS AUTENTICAÇÃO ************************
  Route.get("auth/me", "AuthController.me");
  Route.post("logout", "AuthController.logout");

  // *********************** ROTAS PERSONALIZADAS ***********************
  Route.get("bill/all/:id", "BillsController.allBillsByEstablishment");
  Route.get("category/all/:id", "CategoriesController.allCategoriesProducts");
  Route.get("bill/open/:id", "BillsController.openOrderBill");
  Route.post("order/:id/product", "OrdersController.addToOrder");
  Route.delete(
    "order/:orderId/product/:productId",
    "OrdersController.deleteToOrder"
  );

  //
}).middleware("auth");
