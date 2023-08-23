import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Bill from "App/Models/Bill";
import Order from "App/Models/Order";
import Product from "App/Models/Product";
import ProductOrder from "App/Models/ProductOrder";
import CreateOrderValidator from "App/Validators/CreateOrderValidator";

export default class OrdersController {
  public async store({ request, response }: HttpContextContract) {
    const trx = await Database.transaction();
    const products = request.input("products");

    const orderPaylod = await request.validate(CreateOrderValidator);

    try {
      // Verificar se nesta comanda há um pedido em aberto
      const orderOpen: Order[] = await Order.query()
        .where("bill_id", orderPaylod.billId)
        .andWhere("order_open", true);

      if (orderOpen.length !== 0) {
        return response.badRequest({
          errors: [
            {
              message: "Nesta comanda, há um pedido em aberto",
            },
          ],
        });
      } else {
        const bill = await Bill.findByOrFail("bill_id", orderPaylod.billId, {
          client: trx,
        });
        bill.billBusy = true;
        await bill.useTransaction(trx).save();
      }

      //Atualizar o status da comanda para ocupada

      const order = await Order.create(
        {
          billId: orderPaylod.billId,
          paymentId: 1,
          orderObservation: orderPaylod.orderObservation,
          orderResponsible: orderPaylod.orderResponsible,
          orderValue: 0.0,
          orderDiscount: 0,
          orderOpen: true,
        },
        { client: trx }
      );

      for (const currentProduct of products) {
        const product: Product = await Product.findByOrFail(
          "product_id",
          currentProduct.productId
        );

        await ProductOrder.create(
          {
            productId: product.productId,
            orderId: order.orderId,
          },
          { client: trx }
        );
      }

      await trx.commit();

      await this.regenerateValue(order.orderId);
      response.ok({
        message: "Pedido criado com sucesso",
      });
    } catch (error) {
      trx.rollback();
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

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const order = await Order.findByOrFail("order_id", params.id);

      await order.delete();

      response.ok({ message: "Pedido deletado com sucesso" });
    } catch (error) {
      response.internalServerError({
        errors: [
          {
            message: "Pedido não deletado",
          },
        ],
      });
    }
  }

  public async update({ response, request, params }: HttpContextContract) {
    try {
      const order = await Order.findByOrFail("order_id", params.id);

      order.merge(request.body());

      await order.save();

      await this.regenerateValue(order.orderId);

      response.ok({
        message: "Produto atualizado com sucesso",
      });
    } catch (error) {
      response.internalServerError({
        errors: [
          {
            message: "Operação não concluída",
          },
        ],
      });
    }
  }

  public async addToOrder({ params, request, response }: HttpContextContract) {
    const products = request.input("products");

    try {
      const order = await Order.query()
        .where("order_id", params.id)
        .andWhere("order_open", true)
        .firstOrFail();
      for (const currentProduct of products) {
        const product: Product = await Product.findByOrFail(
          "product_id",
          currentProduct.productId
        );

        await ProductOrder.create({
          productId: product.productId,
          orderId: order.orderId,
        });
      }

      await this.regenerateValue(order.orderId);

      response.ok({
        message: "Itens acrescidos com sucesso",
      });
    } catch (error) {
      response.internalServerError({
        errors: [
          {
            message: "Não foi possível acrescentar estes itens.",
          },
        ],
      });
    }
  }

  public async deleteToOrder({ params, response }: HttpContextContract) {
    try {
      const productOrder = await ProductOrder.query()
        .where("order_id", params.orderId)
        .andWhere("product_id", params.productId)
        .firstOrFail();

      const orderId: number = productOrder.orderId;

      await productOrder.delete();

      await this.regenerateValue(orderId);

      response.ok({
        message: "Item deletado do pedido",
      });
    } catch (error) {
      response.internalServerError({
        errors: [
          {
            message: "Item não deletado",
          },
        ],
      });
    }
  }

  public async invoiceOrder({ params, response }: HttpContextContract) {
    const trx = await Database.transaction();

    try {
      const order = await Order.findByOrFail("order_id", params.id, {
        client: trx,
      });
      if (!(await this.regenerateValue(order.orderId))) {
        return response.badRequest({
          errors: [
            {
              message: "Pedido não faturado",
            },
          ],
        });
      }

      const bill = await Bill.findByOrFail("bill_id", order.billId, {
        client: trx,
      });

      order.orderOpen = false;
      bill.billBusy = false;

      await order.useTransaction(trx).save();
      await bill.useTransaction(trx).save();

      trx.commit();
      response.ok({
        message: "Pedido faturado",
      });
    } catch (error) {
      trx.rollback();
      response.internalServerError({
        errors: [
          {
            message: "Pedido não faturado",
          },
        ],
      });
    }
  }

  private async regenerateValue(orderId: number): Promise<boolean> {
    const result = await Database.rawQuery(`
        select 
	        COALESCE(sum(products.product_price), 0) AS total
        from orders
        inner join product_orders on
	        (orders.order_id = product_orders.order_id)
        inner join products on
	        (products.product_id = product_orders.product_id)
        where orders.order_id = ${orderId}
    `);

    const total: number = parseFloat(result.rows[0].total);

    const order = await Order.findBy("order_id", orderId);

    if (order != null) {
      order.merge({
        orderValue: total,
      });
      await order.save();
      return true;
    } else {
      return false;
    }
  }

  public async orderByBill({ params, response }: HttpContextContract) {
    try {
      const bill = await Bill.findByOrFail("bill_id", params.id);

      const order = await Order.query()
        .where("bill_id", bill.billId)
        .andWhere("order_open", true)
        .preload("products")
        .first();

      if (order == null) return response.noContent();

      response.ok(order);
    } catch (error) {
      response.internalServerError({
        errors: [
          {
            message: "Erro ao recuperar os itens dessa comanda",
          },
        ],
      });
    }
  }
}
