import mongoose from "mongoose";

// Función para generar un código único
const generateUniqueCode = () => {
  return `TICKET-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};
const ticketColl = "tickets";
const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    default: generateUniqueCode,
  },
  purchase_Datetime: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  buyer: {
    type: String,
    required: true,
  },
});

export const modeloTicket = mongoose.model(ticketColl, ticketSchema);
