const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        // --- CORRECTION : AJOUT DU CHAMP USER OPTIONNEL ---
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: false, // <--- FALSE permet aux invités de commander
            ref: 'User',
        },
        // --------------------------------------------------

        shippingAddress: {
            fullName: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            phone: { type: String, required: true },
        },
        orderItems: [
            {
                title: { type: String, required: true },
                qty: { type: Number, required: true },
                price: { type: Number, required: true },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Book',
                    required: true,
                },
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        isConfirmed: {
            type: Boolean,
            required: true,
            default: false,
        },
        isDelivered: {
            type: Boolean,
            required: true,
            default: false,
        },
        deliveredAt: {
            type: Date,
        },
        note: { type: String, default: '' },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Order', orderSchema);