import express from 'express';
import VendorMaterial from '../models/VendorMaterial.js';
import Order from '../models/Order.js';
import OrderLine from '../models/OrderLine.js';
import Vendor from '../models/Vendor.js';
import Notification from '../models/Notifications.js';


const router = express.Router();


router.post('/newOrder', async (req, res) => {
  const { VendorID, items } = req.body; // items adalah array yang berisi { VendorMaterialID, Quantity }

  try {
    // Buat entry di tabel Order
    const newOrder = await Order.create({
      VendorID,
      OrderDate: new Date(),
      Status: 'Pending',
      TotalAmount: 0 // Placeholder, akan dihitung nanti
    });

    let totalAmount = 0;

    // Buat entry di tabel OrderLine dan notifikasi untuk setiap item
    for (const item of items) {
      const vendorMaterial = await VendorMaterial.findByPk(item.VendorMaterialID);

      if (!vendorMaterial) {
        return res.status(400).json({ success: false, message: `VendorMaterial dengan ID ${item.VendorMaterialID} tidak ditemukan.` });
      }

      await OrderLine.create({
        OrderID: newOrder.OrderID,
        VendorMaterialID: item.VendorMaterialID,
        Quantity: item.Quantity
      });

      // Tambahkan ke total amount
      totalAmount += vendorMaterial.Price * item.Quantity;

      // Buat notifikasi untuk vendor
      await Notification.create({
        VendorID: vendorMaterial.VendorId,
        OrderID: newOrder.OrderID,
        Status: 'Pending',
        Message: `Pesanan baru untuk material ${vendorMaterial.MaterialName}`
      });
    }

    // Update total amount di Order
    await newOrder.update({ TotalAmount: totalAmount });

    res.status(201).json({ success: true, message: 'Order berhasil dibuat.', orderId: newOrder.OrderID });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal membuat order.', error: error.message });
  }
});


// Endpoint untuk mendapatkan detail order berdasarkan OrderID
router.get('/getOrder/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    // Temukan Order berdasarkan OrderID
    const order = await Order.findByPk(orderId, {
      include: [{
        model: OrderLine,
        include: [VendorMaterial]
      }]
    });

    if (!order) {
      return res.status(404).json({ success: false, message: `Order dengan ID ${orderId} tidak ditemukan.` });
    }

    // Format data untuk respon
    const orderDetails = {
      OrderID: order.OrderID,
      VendorID: order.VendorID,
      OrderDate: order.OrderDate,
      Status: order.Status,
      TotalAmount: order.TotalAmount,
      items: order.OrderLines.map(orderLine => ({
        VendorMaterialID: orderLine.VendorMaterialID,
        Quantity: orderLine.Quantity,
        Price: orderLine.VendorMaterial.Price,
        MaterialName: orderLine.VendorMaterial.MaterialName
      }))
    };

    res.status(200).json({ success: true, order: orderDetails });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil detail order.', error: error.message });
  }
});

// Endpoint untuk mendapatkan daftar vendor
router.get('/vendors', async (req, res) => {
  try {
    const vendors = await Vendor.findAll();
    res.status(200).json({ success: true, vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil daftar vendor.', error: error.message });
  }
});

// Endpoint untuk mendapatkan daftar material
router.get('/materials', async (req, res) => {
  try {
    const materials = await VendorMaterial.findAll({
      include: [{
        model: Vendor,
        attributes: ['VendorName']
      }]
    });
    res.status(200).json({ success: true, materials });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil daftar material.', error: error.message });
  }
});

//notifikasi untuk vendor
router.get('/notifications/:vendorId', async (req, res) => {
  const { vendorId } = req.params;

  if (!vendorId) {
    return res.status(400).json({ success: false, message: 'Vendor ID is required.' });
  }

  try {
    const notifications = await Notification.findAll({
      where: { VendorID: vendorId },
      include: [Order]
    });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil notifikasi.', error: error.message });
  }
});


//notifikasi acc vendor
router.post('/notifications/:notificationId/approve', async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findByPk(notificationId);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notifikasi tidak ditemukan.' });
    }

    // Update status notifikasi
    await notification.update({ Status: 'Approved' });

    // Update status order jika semua notifikasi sudah di-approve
    const allApproved = await Notification.findAll({
      where: { OrderID: notification.OrderID, Status: 'Pending' }
    });

    if (allApproved.length === 0) {
      const order = await Order.findByPk(notification.OrderID);
      await order.update({ Status: 'Approved' });
    }

    res.status(200).json({ success: true, message: 'Order berhasil di-approve.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal approve order.', error: error.message });
  }
});

export default router;
