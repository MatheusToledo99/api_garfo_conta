import { BasePolicy } from "@ioc:Adonis/Addons/Bouncer";
import Employee from "App/Models/Employee";
import User from "App/Models/User";

export default class AuthPolicy extends BasePolicy {
  public async onlyManager(user: User) {
    return user.userType == "ADMINISTRADOR";
  }

  public async onlyManagerOrMaster(user: User) {
    const employeeMaster = await Employee.query()
      .where("user_id", user.userId)
      .andWhere("employee_type", "MASTER")
      .first();

    if (
      (user.userType == "ADMINISTRADOR" || employeeMaster) &&
      user.userBlocked == false
    )
      return true;

    return false;
  }
  public async onlyEmployee(user: User, userEstablishment: User) {
    if (
      user.userType == "FUNCIONARIO" &&
      user.userBlocked == false &&
      userEstablishment.userBlocked == false
    ) {
      return true;
    }
    return false;
  }
}
