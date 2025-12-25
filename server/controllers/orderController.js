const Order = require('../models/orderModel');
const asyncHandler = require('express-async-handler');

// @desc    Créer une nouvelle commande
// @route   POST /api/orders
// @access  Public (via optionalProtect)
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('Aucun article commandé');
  } else {
    const order = new Order({
      orderItems,
      // GESTION INVITÉ : Si connecté on met l'ID, sinon null
      user: req.user ? req.user._id : null,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc    Récupérer une commande par son ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Commande non trouvée');
  }
});

// @desc    Mettre à jour le statut "Payé"
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Commande non trouvée');
  }
});

// @desc    Mettre à jour le statut "Livré"
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Commande non trouvée');
  }
});

// @desc    Récupérer les commandes de l'utilisateur connecté
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Récupérer toutes les commandes (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// @desc    Récupérer les statistiques (Admin Dashboard)
// @route   GET /api/orders/stats
// @access  Private/Admin
const getOrderStats = asyncHandler(async (req, res) => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: { month: { $month: "$createdAt" } },
        totalSales: { $sum: "$totalPrice" },
        totalProfit: { $sum: { $multiply: ["$totalPrice", 0.2] } }, // Marge estimée 20%
        
        // --- CORRECTION : COMPTE UNIQUEMENT LES COMMANDES LIVRÉES ---
        count: { 
          $sum: { 
            $cond: ["$isDelivered", 1, 0] 
          } 
        },
        // -----------------------------------------------------------
      },
    },
    { $sort: { "_id.month": 1 } },
  ]);
  
  res.json(stats || []);
});

// --- FONCTIONS ADMIN SUPPLÉMENTAIRES ---

// @desc    Supprimer une commande
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    await order.deleteOne();
    res.json({ message: 'Commande supprimée' });
  } else {
    res.status(404);
    throw new Error('Commande non trouvée');
  }
});

// @desc    Confirmer une commande
// @route   PUT /api/orders/:id/confirm
// @access  Private/Admin
const updateOrderToConfirmed = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isConfirmed = true;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Commande non trouvée');
  }
});

// @desc    Mettre une note sur une commande
// @route   PUT /api/orders/:id/note
// @access  Private/Admin
const updateOrderNote = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.note = req.body.note;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Commande non trouvée');
  }
});

// --- EXPORTATIONS ---
module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  getOrderStats,
  deleteOrder,
  updateOrderToConfirmed,
  updateOrderNote,
};