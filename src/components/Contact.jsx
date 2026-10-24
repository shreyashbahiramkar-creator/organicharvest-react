import { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowToast(true);
    setFormData({ name: '', email: '', message: '' });
    
    // 3 second baad toast hatao
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <section id="about" className="max-w-[1200px] mx-auto px-4 md:px-6 py-16 scroll-mt-20">
  <div id="contact" className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
    
        {/* Left Info */}
        <div>
          <span className="block mb-2 text-[#245b3b] text-xs font-extrabold tracking-[1.7px]">
            GET IN TOUCH
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#245b3b] mb-4 leading-tight">
            We'd love to hear from you.
          </h2>
          <p className="text-[#737b72] text-sm leading-relaxed mb-8">
            Have a question about your order, our products, or delivery? 
            Drop us a message and our team will get back to you within 24 hours.
          </p>

          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-4">
              <span className="text-xl bg-[#eaf0e5] w-10 h-10 flex items-center justify-center rounded-[10px] flex-shrink-0">📍</span>
              <div>
                <h4 className="text-sm font-semibold text-[#26362b] mb-1">Our Store</h4>
                <p className="text-[13px] text-[#737b72] leading-snug">123 Green Valley Road,<br />Mumbai, Maharashtra 400001</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-xl bg-[#eaf0e5] w-10 h-10 flex items-center justify-center rounded-[10px] flex-shrink-0">📞</span>
              <div>
                <h4 className="text-sm font-semibold text-[#26362b] mb-1">Call Us</h4>
                <p className="text-[13px] text-[#737b72]">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-xl bg-[#eaf0e5] w-10 h-10 flex items-center justify-center rounded-[10px] flex-shrink-0">✉️</span>
              <div>
                <h4 className="text-sm font-semibold text-[#26362b] mb-1">Email Us</h4>
                <p className="text-[13px] text-[#737b72]">hello@organicharvest.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="bg-[#f6f6f0] border border-[#e6e8df] rounded-[18px] p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Your Name</label>
              <input 
                type="text" 
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-3 py-2.5 bg-white border border-[#e6e8df] rounded-lg outline-none focus:border-[#245b3b]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Email Address</label>
              <input 
                type="email" 
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-3 py-2.5 bg-white border border-[#e6e8df] rounded-lg outline-none focus:border-[#245b3b]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Message</label>
              <textarea 
                name="message"
                required
                rows="4"
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help you?"
                className="w-full px-3 py-2.5 bg-white border border-[#e6e8df] rounded-lg outline-none focus:border-[#245b3b] resize-none"
              ></textarea>
            </div>
            <button 
              type="submit"
              className="w-full bg-[#245b3b] text-white py-3 rounded-[10px] font-bold hover:bg-[#19452c] transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>

      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#245b3b] text-white px-6 py-3 rounded-full font-semibold shadow-lg z-[300] animate-[slideUp_0.3s_ease]">
          ✅ Thanks {formData.name || 'for reaching out'}! We'll get back to you soon.
        </div>
      )}
    </section>
  );
}

export default Contact;