const mongoose = require('mongoose');
const { type } = require('os');

const orderSchema = new mongoose.Schema({
    client: { type: String, required: true },
    quantized: {type: Number, required: true },
    prazo: { type: Date, required: true },
    notalFiscal:{type: String},
});

module.exports = mongoose.model('Order', orderSchema);
