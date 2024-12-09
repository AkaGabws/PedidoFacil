const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
    const {client, quantized, prazo} = req.body;
    try{
        const newOrder = await Order.create({client, quantized, prazo});
        res.status(201).json(newOrder);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    };