import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../assets/logo.png";
import "../../styles/AOrderDetail.css";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/orders/order/${orderId}`);
        setOrder(data);
        setNewStatus(data.status);
      } catch (err) {
        setError("Failed to fetch order details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const updateStatus = async () => {
    if (!newStatus || newStatus === order.status) return;
    setIsUpdating(true);
    try {
      const payload = {
        status: newStatus,
        paymentStatus: order.paymentStatus,
      };
  
      // If status is being set to delivered, set paymentStatus to 'paid'
      if (newStatus === "delivered" && order.paymentStatus !== "paid") {
        payload.paymentStatus = "paid";
      }
  
      const { data } = await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, payload);
  
      setOrder(data);
      alert("Order status updated!");
    } catch (err) {
      alert("Status update failed.");
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };
  

  const handlePDFDownload = async () => {
    const element = document.getElementById("printable-content");
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`Invoice_${order._id}.pdf`);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("printable-content").innerHTML;
    const win = window.open("", "PRINT", "height=600,width=800");
    win.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: 'Segoe UI', sans-serif; padding: 20px; }
            img { max-width: 120px; }
            h2 { color: #d63384; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  if (loading) return <div className="loading-container">Loading order...</div>;
  if (error) return <div className="error-container">{error}</div>;
  if (!order) return <div className="not-found">Order not found.</div>;

  const gstAmount = (order.totalAmount * 0.1525).toFixed(2);
  const subTotal = (order.totalAmount * 0.8475).toFixed(2);

  return (

    <>
       <header className="order-header">
        <h2>Order #{order._id.slice(-6).toUpperCase()}</h2>
        <div className="order-meta">
          <MetaItem label="Placed On" value={new Date(order.createdAt).toLocaleDateString()} />
          <MetaItem label="Status" value={<span className={`status-badge status-${order.status}`}>{order.status}</span>} />
          <MetaItem label="Total" value={`₹${order.totalAmount.toFixed(2)}`} />
        </div>
      </header>

    <div className="order-detail-container">
      {/* Header */}
     

      {/* Main Content */}
      <div id="printable-content" className="">
        {/* Logo and branding */}
        <div className="invoice-branding">
          <img src={logo} alt="Brand" className="invoice-logo" />
          <h2 className="invoice-brand">Bride Boutique</h2>
        </div>

        {/* Shipping */}
        <section className="order-section">
          <h3>📍 Shipping Info</h3>
          <p><strong>{order.shippingAddress.fullName}</strong></p>
          <p>{order.shippingAddress.address}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
          <p>📞 {order.shippingAddress.phone}</p>
        </section>

        {/* Items */}
        <section className="order-section">
          <h3>🛒 Items ({order.products.length})</h3>
          {order.products.map((item, i) => {
            const thumbnail = item.thumbnail?.startsWith("http") ? item.thumbnail : `http://localhost:5000${item.thumbnail}`;
            const total = (item.priceAtTime || 0) * item.quantity;
            return (
              <div className="item-card" key={i}>
                <img src={thumbnail} alt="product" className="item-thumbnail" />
                <div>
                  <h4>{item.product?.title || "Product"}</h4>
                  <p>Qty: {item.quantity} {item.selectedSize && `| Size: ${item.selectedSize}`}</p>
                  <p>Price: ₹{(item.priceAtTime || 0).toFixed(2)}</p>
                  <p>Total: ₹{total.toFixed(2)}</p>
                </div>
              </div>
            );
          })}
        </section>

        {/* Invoice Summary */}
        <div className="order-section">
          <h3>🧾 Invoice Summary</h3>
          <p><strong>Invoice #:</strong> INV-{order._id.slice(-6).toUpperCase()}</p>
          <p><strong>Subtotal:</strong> ₹{subTotal}</p>
          <p><strong>GST (18%):</strong> ₹{gstAmount}</p>
          <p><strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}</p>
          <p className="thank-you-note">🙏 Thank you for shopping with us!</p>
          <div >
        <button className="invoice-buttons" onClick={handlePrint}>🖨️ Print</button>
        <button className="invoice-buttons" onClick={handlePDFDownload}>📥 Download PDF</button>
      </div>
        </div>
        
      </div>

      {/* Status Update */}
      <section className="order-section">
        <h3>📦 Update Status</h3>
        <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} disabled={isUpdating}>
          {["pending", "confirmed", "shipped", "delivered", "cancelled"].map(status => (
            <option key={status} value={status}>{status.toUpperCase()}</option>
          ))}
        </select>
        <button onClick={updateStatus} disabled={isUpdating || newStatus === order.status}>
          {isUpdating ? "Updating..." : "Update Status"}
        </button>
      </section>

      {/* Actions */}
      
    </div>
    </>
  );
};

const MetaItem = ({ label, value }) => (
  <div className="meta-item">
    <strong>{label}:</strong> <span>{value}</span>
  </div>
);

export default OrderDetails;
