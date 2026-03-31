import React, { useState } from "react";
import axios from "axios";

function PaymentGateway({ bookingData, onPaymentSuccess, onPaymentCancel }) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const isValidCardNumber = (number) => {
    return number.replace(/\s/g, "").length === 16;
  };

  const isValidExpiryDate = (date) => {
    return /^\d{2}\/\d{2}$/.test(date);
  };

  const isValidCVV = (cvv) => {
    return cvv.length === 3;
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, "");
    if (value.length <= 16) {
      value = value.replace(/(\d{4})/g, "$1 ").trim();
      setCardNumber(value);
      setPaymentError("");
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      if (value.length >= 2) {
        value = value.slice(0, 2) + "/" + value.slice(2);
      }
      setExpiryDate(value);
      setPaymentError("");
    }
  };

  const handleCVVChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    setCvv(value.slice(0, 3));
    setPaymentError("");
  };

  // 🔥 UPDATED FUNCTION
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentError("");

    if (!cardHolder.trim()) {
      setPaymentError("Cardholder name is required");
      return;
    }

    if (!isValidCardNumber(cardNumber)) {
      setPaymentError("Invalid card number");
      return;
    }

    if (!isValidExpiryDate(expiryDate)) {
      setPaymentError("Invalid expiry date");
      return;
    }

    if (!isValidCVV(cvv)) {
      setPaymentError("Invalid CVV");
      return;
    }

    setIsProcessing(true);

    try {
      // 🔥 CALL BOOKINGS API
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/bookings",
        {
          courtId: bookingData.courtId,
          slotIds: bookingData.slotIds,
          bookingDate: bookingData.date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsProcessing(false);

      alert("Payment Successful & Court Booked ✅");

      onPaymentSuccess(); // redirect back

    } catch (error) {
      setIsProcessing(false);

      if (error.response) {
        setPaymentError(error.response.data.message);
      } else {
        setPaymentError("Booking failed");
      }
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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="modal-title">Payment Details</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onPaymentCancel}
              disabled={isProcessing}
            ></button>
          </div>

          <div className="row">
            <div className="col-md-5">
              <div className="card bg-light p-3">
                <h6 className="fw-bold mb-3">Order Summary</h6>

                <div className="mb-3">
                  <small className="text-muted">Court</small>
                  <p className="fw-bold mb-1">{bookingData.courtName}</p>
                </div>

                <div className="mb-3">
                  <small className="text-muted">Sport</small>
                  <p className="fw-bold mb-1">{bookingData.sport}</p>
                </div>

                <div className="mb-3">
                  <small className="text-muted">Date</small>
                  <p className="fw-bold mb-1">{bookingData.date}</p>
                </div>

                <div className="mb-3">
                  <small className="text-muted">Time Slot</small>
                  <p className="fw-bold mb-1">{bookingData.timeRange}</p>
                </div>

                <div className="mb-3">
                  <small className="text-muted">Duration</small>
                  <p className="fw-bold mb-1">{bookingData.duration} hour(s)</p>
                </div>

                <div className="mb-3">
                  <small className="text-muted">Price per Hour</small>
                  <p className="fw-bold mb-1">₹{bookingData.pricePerHour}</p>
                </div>

                <hr />

                <div className="mt-3 pt-3 border-top">
                  <small className="text-muted">Total Amount</small>
                  <h5 className="text-success fw-bold mt-1">
                    ₹{bookingData.totalAmount}
                  </h5>
                </div>
              </div>
            </div>

            <div className="col-md-7">
              <form onSubmit={handlePaymentSubmit}>
                {paymentError && (
                  <div className="alert alert-danger">
                    {paymentError}
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={cardHolder}
                    onChange={(e) =>
                      setCardHolder(e.target.value)
                    }
                    disabled={isProcessing}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Card Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    disabled={isProcessing}
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">
                      Expiry
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={expiryDate}
                      onChange={handleExpiryChange}
                      disabled={isProcessing}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      CVV
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={cvv}
                      onChange={handleCVVChange}
                      disabled={isProcessing}
                    />
                  </div>
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={isProcessing}
                  >
                    {isProcessing
                      ? "Processing..."
                      : `Pay ₹${bookingData.totalAmount}`}
                  </button>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary mt-2 w-100"
                  onClick={onPaymentCancel}
                  disabled={isProcessing}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentGateway;