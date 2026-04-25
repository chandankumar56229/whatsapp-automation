import { useState } from 'react';
import { sendContact } from '../api/contact.js';

const FAQS = [
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, UPI, and bank transfer. All payments are processed over secure SSL.' },
  { q: 'Do I get the source code?', a: 'Yes — every purchase includes the complete source code with no obfuscation or limitations.' },
  { q: 'How long is support included?', a: 'Each license includes 6 months of priority support. You can extend support at any time.' },
  { q: 'Can I use this for client projects?', a: 'The Regular License covers a single non-charging end product. For paid client SaaS, the Extended License is required.' },
  { q: 'Do you offer refunds?', a: 'Due to the nature of digital products we generally do not offer refunds, but we work hard to make sure you are happy with your purchase.' },
  { q: 'Will I get future updates?', a: 'Yes — all license holders get free lifetime updates with new features and security patches.' },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item${open ? ' active' : ''}`}>
      <button type="button" className="faq-question" onClick={() => setOpen((v) => !v)}>
        <span>{q}</span>
        <i className="fa-solid fa-chevron-down" />
      </button>
      <div className="faq-answer"><p>{a}</p></div>
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'General', message: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setStatus('sending');
    try {
      await sendContact(form);
      setStatus('sent');
      setForm({ name: '', email: '', subject: 'General', message: '' });
      setTimeout(() => setStatus('idle'), 4000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send. Please try again.');
      setStatus('idle');
    }
  };

  return (
    <>
      <section className="about-hero">
        <div className="container text-center">
          <span className="section-badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.15)' }}>
            <i className="fa-solid fa-envelope" /> Contact
          </span>
          <h1 className="section-title white">Get in Touch</h1>
          <p className="section-desc centered" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Have a question or need help? Send us a message — we usually respond within 24 hours.
          </p>
        </div>
      </section>

      <section className="contact-section">
        <div className="container">
          <div className="row g-4 mb-5">
            <div className="col-md-4">
              <div className="contact-card">
                <div className="contact-icon"><i className="fa-solid fa-envelope" /></div>
                <h4>Email</h4>
                <p style={{ color: 'var(--gray-500)' }}>hello@multi4you.store</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="contact-card">
                <div className="contact-icon"><i className="fa-brands fa-whatsapp" /></div>
                <h4>WhatsApp</h4>
                <p style={{ color: 'var(--gray-500)' }}>+91 XXXXXXXXXX</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="contact-card">
                <div className="contact-icon"><i className="fa-solid fa-clock" /></div>
                <h4>Hours</h4>
                <p style={{ color: 'var(--gray-500)' }}>24/7 Support</p>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-7">
              <div className="contact-form-wrapper">
                <h3 className="mb-4">Send us a message</h3>
                <form onSubmit={onSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Your name</label>
                        <input type="text" name="name" required value={form.name} onChange={onChange} className="form-control-custom" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" required value={form.email} onChange={onChange} className="form-control-custom" />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Subject</label>
                    <select name="subject" value={form.subject} onChange={onChange} className="form-control-custom">
                      <option>General</option>
                      <option>Sales / Pricing</option>
                      <option>Technical Support</option>
                      <option>Partnership</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Message</label>
                    <textarea name="message" required rows="5" value={form.message} onChange={onChange} className="form-control-custom" />
                  </div>
                  {error && <p style={{ color: 'var(--error)' }}>{error}</p>}
                  <button
                    type="submit"
                    className="btn-primary-custom"
                    disabled={status === 'sending'}
                    style={status === 'sent' ? { background: 'var(--success)' } : {}}
                  >
                    {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Message Sent ✓' : <>Send Message <i className="fa-solid fa-paper-plane" /></>}
                  </button>
                </form>
              </div>
            </div>
            <div className="col-lg-5">
              <h3 className="mb-4">Frequently Asked Questions</h3>
              {FAQS.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
