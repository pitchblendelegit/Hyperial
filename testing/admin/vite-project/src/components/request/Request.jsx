import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Request.css';

const Request = () => {
  const [materials, setMaterials] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const materialResponse = await axios.get('http://localhost:5000/order/materials');
        setMaterials(materialResponse.data.materials);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, []);

  const handleAddToOrder = (material) => {
    const quantity = prompt(`Masukkan jumlah untuk material ${material.MaterialName}:`, 1);
    if (quantity && !isNaN(quantity)) {
      setOrderItems([...orderItems, { ...material, Quantity: parseInt(quantity) }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const items = orderItems.map(item => ({
      VendorMaterialID: item.VendorMaterialId,
      Quantity: item.Quantity,
      VendorID: item.VendorId,
    }));

    const groupedItems = items.reduce((acc, item) => {
      const { VendorID, ...rest } = item;
      if (!acc[VendorID]) {
        acc[VendorID] = [];
      }
      acc[VendorID].push(rest);
      return acc;
    }, {});

    try {
      for (const vendorID in groupedItems) {
        const orderData = {
          VendorID: vendorID,
          items: groupedItems[vendorID],
        };

        console.log("Order data being sent:", orderData);

        const response = await axios.post('http://localhost:5000/order/newOrder', orderData);
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error creating order:', error.response ? error.response.data : error.message);
      setMessage(error.response ? error.response.data.message : 'Gagal membuat order.');
    }
  };

  return (
    <div className="request-container">
      <h2>Request Order</h2>
      <table>
        <thead>
          <tr>
            <th>Material</th>
            <th>Vendor</th>
            <th>Deskripsi</th>
            <th>Unit</th>
            <th>Harga</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material) => (
            <tr key={material.VendorMaterialId}>
              <td>{material.MaterialName}</td>
              <td>{material.Vendor.VendorName}</td>
              <td>{material.Description}</td>
              <td>{material.Unit}</td>
              <td>{material.Price}</td>
              <td>
                <button onClick={() => handleAddToOrder(material)}>Buy</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Checkout</h3>
      {orderItems.length > 0 ? (
        <div>
          <ul>
            {orderItems.map((item, index) => (
              <li key={index}>
                {item.MaterialName} ({item.Quantity} {item.Unit}) - Rp {item.Price * item.Quantity}
              </li>
            ))}
          </ul>
          <button onClick={handleSubmit}>Submit Order</button>
        </div>
      ) : (
        <p>Belum ada item yang ditambahkan.</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

return Request;
