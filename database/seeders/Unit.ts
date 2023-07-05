import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Unit from "App/Models/Unit";

export default class extends BaseSeeder {
  public async run() {
    await Unit.createMany([
      {
        unitDescription: "UND",
      },
      {
        unitDescription: "KG",
      },
      {
        unitDescription: "ML",
      },
      {
        unitDescription: "G",
      },
      {
        unitDescription: "L",
      },
    ]);
  }
}
