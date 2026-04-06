import React, { useState } from "react";
import "./Contact.css";


const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch("https://e-commerce-backend-3-ot7q.onrender.com/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert("Message Sent Successfully ✅");
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert(data.message || "Something went wrong ❌");
      }

    } catch (error) {
      console.error(error);
      alert("Server Error ❌");
    }

    setLoading(false);
  };

  return (
    <section id="contact" className="contact">
      <div className="contact-container">

        {/* Left Info */}
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>
            Have a question or need support?  
            We’re here to help you.
          </p>

          <div className="contact-details">
            <div className="detail">
              <span>📍</span>
              <p>123 Market Street, New York, USA</p>
            </div>
            <div className="detail">
              <span>📞</span>
              <p>+1 234 567 890</p>
            </div>
            <div className="detail">
              <span>✉️</span>
              <p>support@shopease.com</p>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="contact-form">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit">
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};

export default Contact;