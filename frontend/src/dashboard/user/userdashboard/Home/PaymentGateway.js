import React, { useState } from "react";

function PaymentGateway({ bookingData, onPaymentSuccess, onPaymentCancel }) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // Validate card number (simple validation)
  const isValidCardNumber = (number) => {
    return number.replace(/\s/g, "").length === 16;
  };

  // Validate expiry date (MM/YY format)
  const isValidExpiryDate = (date) => {
    return /^\d{2}\/\d{2}$/.test(date);
  };

  // Validate CVV
  const isValidCVV = (cvv) => {
    return cvv.length === 3;
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, "");
    if (value.length <= 16) {
      // Add spaces every 4 digits
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

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentError("");

    // Validation
    if (!cardHolder.trim()) {
      setPaymentError("Cardholder name is required");
      return;
    }

    if (!isValidCardNumber(cardNumber)) {
      setPaymentError("Invalid card number (16 digits required)");
      return;
    }

    if (!isValidExpiryDate(expiryDate)) {
      setPaymentError("Invalid expiry date (MM/YY format required)");
      return;
    }

    if (!isValidCVV(cvv)) {
      setPaymentError("Invalid CVV (3 digits required)");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing delay
    setTimeout(() => {
      // Simulate success (in real scenario, this would call a payment API)
      setIsProcessing(false);
      onPaymentSuccess();
    }, 2000);
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
            <h5 className="modal-title">Payment Details</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onPaymentCancel}
              disabled={isProcessing}
            ></button>
          </div>

          <div className="row">
            {/* Booking Summary - Left Side */}
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

            {/* Payment Form - Right Side */}
            <div className="col-md-7">
              <form onSubmit={handlePaymentSubmit}>
                {/* Error Message */}
                {paymentError && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {paymentError}
                  </div>
                )}

                {/* Cardholder Name */}
                <div className="mb-3">
                  <label htmlFor="cardHolder" className="form-label">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="cardHolder"
                    placeholder="John Doe"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    disabled={isProcessing}
                  />
                </div>

                {/* Card Number */}
                <div className="mb-3">
                  <label htmlFor="cardNumber" className="form-label">
                    Card Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength="19"
                    disabled={isProcessing}
                  />
                  <small className="text-muted">16 digits</small>
                </div>

                {/* Expiry Date and CVV */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="expiryDate" className="form-label">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={handleExpiryChange}
                      maxLength="5"
                      disabled={isProcessing}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="cvv" className="form-label">
                      CVV
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cvv"
                      placeholder="123"
                      value={cvv}
                      onChange={handleCVVChange}
                      maxLength="3"
                      disabled={isProcessing}
                    />
                  </div>
                </div>

                {/* Info Box */}
                <div className="alert alert-info mb-3" role="alert">
                  <small>
                    💡 <strong>Demo Mode:</strong> This is a dummy payment
                    gateway for testing. Use any valid 16-digit number.
                  </small>
                </div>

                {/* Buttons */}
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-success"
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
                      `Pay ₹${bookingData.totalAmount}`
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentGateway;
