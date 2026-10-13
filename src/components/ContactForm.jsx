import React from 'react';

export default function ContactForm() {
  return (
    <form
      className="contact-form"
      name="nala-demo"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      aria-label="Contact sales form"
    >
      <input type="hidden" name="form-name" value="nala-demo" />
      <input type="hidden" name="bot-field" />

      <label>
        <span className="sr-only">Name</span>
        <input name="name" placeholder="Your name" required />
      </label>
      <label>
        <span className="sr-only">Email</span>
        <input type="email" name="email" placeholder="you@company.com" required />
      </label>
      <label>
        <span className="sr-only">Message</span>
        <textarea name="message" placeholder="Tell us about your use case" required />
      </label>
      <div className="contact-actions">
        <button type="submit" className="primary-button">Request demo</button>
        <a href="mailto:hello@nala.watch" className="secondary-button inline-link">
          Email us
        </a>
      </div>
    </form>
  );
}
