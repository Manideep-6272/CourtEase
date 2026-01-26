import React from "react";

function Contact() {
  return (
    <div className="container my-5">

      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="fw-bold">Contact Us</h1>
        <p className="text-muted mt-2">
          We’d love to hear from you. Get in touch with us!
        </p>
      </div>

      <div className="row g-5">

        {/* Contact Info */}
        <div className="col-md-5">
          <h5 className="fw-semibold mb-3">Get in Touch</h5>

          <p className="text-muted">
            Have questions about bookings, venues, or partnerships?
            Reach out to us and our team will respond as soon as possible.
          </p>

          <div className="mt-4">
            <p className="mb-2">
              <strong>📍 Address:</strong> Hyderabad, India
            </p>
            <p className="mb-2">
              <strong>📧 Email:</strong> support@courtease.com
            </p>
            <p className="mb-2">
              <strong>📞 Phone:</strong> +91 91829 32925
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="col-md-7">
          <div className="card shadow-sm p-4">
            <h5 className="fw-semibold mb-3">Send Us a Message</h5>

            <form>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Write your message here"
                ></textarea>
              </div>

              <button className="btn btn-primary px-4 fw-semibold">
                Send Message
              </button>
            </form>

          </div>
        </div>

      </div>

    </div>
  );
}

export default Contact;
