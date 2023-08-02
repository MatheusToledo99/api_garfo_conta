import { BasePolicy } from "@ioc:Adonis/Addons/Bouncer";
import User from "App/Models/User";

export default class AuthPolicy extends BasePolicy {
  public async manager(user: User): Promise<boolean> {
    return user.userType === "ADMINISTRADOR";
  }
  public async manager_establishment(user: User): Promise<boolean> {
    return ["ADMINISTRADOR", "ESTABELECIMENTO"].includes(user.userType)
      ? true
      : false;
  }
}
