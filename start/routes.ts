import Route from "@ioc:Adonis/Core/Route";

Route.post("login", "AuthController.login");
Route.resource("manager", "ManagersController").apiOnly;

Route.group(() => {
  Route.resource("establishment", "EstablishmentsController").apiOnly;
  Route.resource("employee", "EmployeesController").apiOnly;
  Route.get("auth/me", "AuthController.me");
}).middleware("auth");
