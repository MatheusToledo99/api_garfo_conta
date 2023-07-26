import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Payment from "App/Models/Payment";

export default class extends BaseSeeder {
  public async run() {
    await Payment.createMany([
      {
        paymentDescription: "Dinheiro",
      },
      {
        paymentDescription: "Cartão de Crédito",
      },
      {
        paymentDescription: "Cartão de Débito",
      },
      {
        paymentDescription: "Pix",
      },
      {
        paymentDescription: "Nota Provisória",
      },
      {
        paymentDescription: "Cheque",
      },
      {
        paymentDescription: "Cortesia",
      },
    ]);
  }
}
