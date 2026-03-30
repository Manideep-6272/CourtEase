import React, { useState, useEffect } from "react";
import api from "../../../../api";

function RazorpayGateway({ bookingData, onPaymentSuccess, onPaymentCancel }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    // Initialize and load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Create Razorpay Order
  const handleCreateOrder = async () => {
    setPaymentError("");
    setIsProcessing(true);

    try {
      console.log("[Razorpay] Creating order with data:", bookingData);

      const response = await api.post("/create-razorpay-order", {
        amount: bookingData.totalAmount,
        bookingDetails: {
          court: bookingData.courtName,
          sport: bookingData.sport,
          date: bookingData.date,
          timeRange: bookingData.timeRange,
          duration: bookingData.duration,
        },
      });

      console.log("[Razorpay] Order created:", response.data);
      setOrderId(response.data.orderId);
      handlePaymentGateway(response.data);
    } catch (err) {
      console.error("[Razorpay] Error creating order:", err);
      setPaymentError(
        err.response?.data?.message || "Failed to create payment order"
      );
      setIsProcessing(false);
    }
  };

  // Handle Razorpay Payment Gateway
  const handlePaymentGateway = (order) => {
    if (!window.Razorpay) {
      setPaymentError("Razorpay gateway not loaded. Please refresh and try again.");
      setIsProcessing(false);
      return;
    }

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_key",
      amount: Math.round(order.amount * 100), // in paise
      currency: order.currency || "INR",
      name: "CourtEase",
      description: `Booking for ${bookingData.courtName}`,
      order_id: order.orderId,
      prefill: {
        email: localStorage.getItem("userEmail") || "",
        contact: localStorage.getItem("userPhone") || "",
      },
      theme: {
        color: "#6366f1",
      },
      handler: async (response) => {
        await verifyPayment(response);
      },
      modal: {
        ondismiss: () => {
          setIsProcessing(false);
          console.log("[Razorpay] Payment modal closed by user");
        },
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Verify Payment
  const verifyPayment = async (response) => {
    try {
      console.log("[Razorpay] Verifying payment with response:", response);

      const verifyResponse = await api.post("/verify-razorpay-payment", {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        signature: response.razorpay_signature,
        bookingData: {
          courtId: bookingData.courtId,
          slotIds: bookingData.slotIds,
          bookingDate: bookingData.date,
          amount: bookingData.totalAmount,
        },
      });

      console.log("[Razorpay] Payment verified successfully:", verifyResponse.data);
      setIsProcessing(false);
      onPaymentSuccess(verifyResponse.data.bookings);
    } catch (err) {
      console.error("[Razorpay] Payment verification failed:", err);
      setPaymentError(
        err.response?.data?.message || "Payment verification failed. Please contact support."
      );
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="modal d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
      role="dialog"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content p-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="modal-title">Payment via Razorpay</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onPaymentCancel}
              disabled={isProcessing}
            ></button>
          </div>

          {/* Order Summary */}
          <div className="card bg-light mb-4">
            <div className="card-body">
              <h6 className="fw-bold mb-3">Booking Details</h6>
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-2">
                    <strong>Court:</strong> {bookingData.courtName}
                  </p>
                  <p className="mb-2">
                    <strong>Sport:</strong> {bookingData.sport}
                  </p>
                  <p className="mb-2">
                    <strong>Date:</strong> {bookingData.date}
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="mb-2">
                    <strong>Time:</strong> {bookingData.timeRange}
                  </p>
                  <p className="mb-2">
                    <strong>Duration:</strong> {bookingData.duration} hour(s)
                  </p>
                  <p className="mb-0">
                    <strong>Rate:</strong> ₹{bookingData.pricePerHour}/hr
                  </p>
                </div>
              </div>
              <hr />
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Total Amount</h5>
                <h4 className="text-success mb-0">
                  ₹{bookingData.totalAmount.toLocaleString("en-IN")}
                </h4>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {paymentError && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <strong>Payment Error:</strong> {paymentError}
              <button
                type="button"
                className="btn-close"
                onClick={() => setPaymentError("")}
              ></button>
            </div>
          )}

          {/* Razorpay Info */}
          <div className="alert alert-info mb-4">
            <strong>Secure Payment:</strong> Your payment is processed securely through Razorpay. 
            We accept all credit/debit cards, UPI, and net banking.
          </div>

          {/* Buttons */}
          <div className="d-grid gap-2">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={handleCreateOrder}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Processing Payment...
                </>
              ) : (
                <>
                  <i className="bi bi-lock-fill me-2"></i>
                  Pay Now ₹{bookingData.totalAmount.toLocaleString("en-IN")}
                </>
              )}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onPaymentCancel}
              disabled={isProcessing}
            >
              Cancel
            </button>
          </div>

          {/* Security Info */}
          <div className="text-center text-muted mt-4 small">
            <p>
              <i className="bi bi-shield-check me-1"></i>
              Your payment information is secure and encrypted
            </p>
            <p>PCI DSS Compliant • 256-bit SSL Encrypted</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RazorpayGateway;
