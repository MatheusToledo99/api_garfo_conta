import Route from "@ioc:Adonis/Core/Route";
import Manager from "App/Models/Manager";
import User from "App/Models/User";

Route.post("login", "AuthController.login");
Route.post("/", async () => {
  const user = await User.create({
    userCpfCnpj: "11780366698",
    userName: "Matheus José Ferreira Toledo",
    userBlocked: false,
    userEmail: "matheusjftoledo@gmail.com",
    password: "moderador",
    userType: "ADMINISTRADOR",
  });
  await Manager.create({
    managerCode: "f3047",
    userId: user.userId,
  });
});

Route.group(() => {
  Route.resource("establishment", "EstablishmentsController").apiOnly;
  Route.resource("employee", "EmployeesController").apiOnly;
  Route.resource("manager", "ManagersController").apiOnly;
  Route.get("auth/me", "AuthController.me");
}).middleware("auth");
