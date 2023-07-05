import Route from "@ioc:Adonis/Core/Route";

Route.post("login", "AuthController.login");

Route.group(() => {
  Route.resource("establishment", "EstablishmentsController").apiOnly();
  Route.resource("employee", "EmployeesController").apiOnly();
  Route.resource("manager", "ManagersController").apiOnly();
  Route.get("auth/me", "AuthController.me");
  Route.resource("address", "AddressesController").apiOnly();
  Route.resource("phone", "PhonesController").apiOnly();
  Route.post("logout", "AuthController.logout");
}).middleware("auth");
