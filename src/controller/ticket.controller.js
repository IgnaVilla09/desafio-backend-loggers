import { config } from "../config/config.js";
import { transporter } from "../config/mailing.config.js";
import { modeloCarrito } from "../dao/models/cart.modelo.js";
import { modeloTicket } from "../dao/models/ticket.modelo.js";

export default class ticketController {
  static createTicket = async (req, res) => {
    try {
      const cartId = req.params.cartId;
      const cart = await modeloCarrito.findById(cartId);
      if (!cart) {
        return res.status(404).send("El carrito no fue encontrado.");
      }

      const buyerEmail = req.user.email;

      const newTicket = new modeloTicket({
        amount: cart.subtotal,
        buyer: buyerEmail,
      });

      await newTicket.save();

      cart.products = [];
      cart.subtotal = 0;

      await cart.save();

      await ticketController.sendMail(req, res, newTicket); //Crea el ticket y lo envia para ser enviado y visualizado en un mail de confirmacion de compra.
    } catch (error) {
      req.logger.fatal("Error al crear ticket");
      res
        .status(500)
        .json({ message: "Error al crear el ticket", error: error.message });
    }
  };

  static sendMail = async (req, res, ticket) => {
    try {
      const ticketJson = ticket.toJSON();

      const ticketFormat = JSON.stringify(ticketJson, null, 2);

      const mailOptions = {
        from: `${config.EMAIL}`,
        to: req.user.email, // Reemplazar con la direccion de correo electronico del destinatario de prueba
        subject: "Prueba de correo",
        html: ticketFormat,
        attachments: [],
      };

      await transporter.sendMail(mailOptions);
      res.status(200).render("purchaseconfirm");
    } catch (error) {
      req.logger.fatal("Error al enviar correo");
      res.status(500).json({ message: "Error al enviar el correo" });
    }
  };
}
