// CustomerSupportPage.js
import React, { useState } from 'react';
import '../css/CustomerSupportPage.css'; 

const CustomerSupportPage = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const questions = [
    { id: 'q1', text: 'How do I reset my password?' },
    { id: 'q2', text: 'Where can I update my email address?' },
    { id: 'q3', text: 'How do I track my order?' },
    { id: 'q4', text: '' },
    { id: 'q5', text: 'How can I contact customer support?' },
    { id: 'q6', text: 'How do I change my shipping address?' },
    { id: 'q7', text: 'Where can I find my order history?' },
    { id: 'q8', text: 'What payment methods are accepted?' },
  ];

  const answers = {
    q1: "To reset your password, go to the login page and click on 'Forgot Password'.",
    q2: "Update your email address in the 'Profile' section of your account settings.",
    q3: "Track your order via the 'Order History' page.",
    q4: "Our return policy allows returns within 30 days. See our 'Returns' page.",
    q5: "Contact support via email in the 'Customer Support' page.",
    q6: "Change your shipping address in the 'Orders' page by clicking on the 'Change Address' button.",
    q7: "Order history is found in the 'Order History' page under your account.",
    q8: "We accept cards from all major networks like MasterCard, VISA, American Express and others.",
  };

  const handleQuestionClick = (id) => {
    setSelectedQuestion(id);
    setFeedbackVisible(false);
  };

  const handleFeedback = (isSolved) => {
    if (isSolved) {
      alert('Great! Please let us know if you need any further help.');
    } else {
      setSelectedQuestion(null);
    }
    setFeedbackVisible(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Your message has been submitted. We will contact you shortly.');
  };

  return (
    <div className="support-page">
      <header>
        <h1>Customer Support</h1>
      </header>
      <main>
        <div className="faq-buttons">
          {questions.map((q) => (
            <button key={q.id} onClick={() => handleQuestionClick(q.id)}>
              {q.text}
            </button>
          ))}
        </div>
        {selectedQuestion && (
          <div className="answer-section">
            <p>{answers[selectedQuestion]}</p>
            {!feedbackVisible && (
              <div className="feedback">
                <p>Did this solve your issue?</p>
                <button onClick={() => handleFeedback(true)}>Yes</button>
                <button onClick={() => handleFeedback(false)}>No</button>
              </div>
            )}
          </div>
        )}

        {/* Contact Form */}
        <div className="contact-form">
          <h2>Need more help? Reach out to us directly</h2>
          <form onSubmit={handleFormSubmit}>
            <div>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label htmlFor="message">Message:</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                required
              ></textarea>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </main>
      <footer>&copy; 2024 ShopSphere. All Rights Reserved.</footer>
    </div>
  );
};

export default CustomerSupportPage;
