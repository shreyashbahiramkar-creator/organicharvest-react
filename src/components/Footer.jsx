import { LeafIcon, PinIcon, ArrowIcon } from './icons';

function Footer() {
  const shopLinks = [
    { label: 'All Products', href: '/#products' },
    { label: 'Vegetables', href: '/#categories' },
    { label: 'Fruits', href: '/#categories' },
    { label: 'Dairy & Eggs', href: '/#categories' },
  ];

  const helpLinks = [
    { label: 'Track Order', href: '/track-order' },
    { label: 'Contact Us', href: '/#contact' },
    { label: 'About Us', href: '/#about' },
  ];

  return (
    <footer className="bg-[#19452c] mt-12 text-[#eaf0e5]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">

        {/* ═══ Main Columns ═══ */}
        <div className="py-10 md:py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">

          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-1.5 text-xl font-extrabold text-white tracking-tight">
              <span className="text-2xl leading-none">✳</span>
              <span>
                Organic<span className="text-[#8daa83]">Harvest</span>
              </span>
            </a>
            <p className="mt-3 text-sm text-[#eaf0e5]/70 leading-relaxed max-w-[260px]">
              Fresh choices, naturally better. Farm-fresh organic groceries delivered to your doorstep.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
              <LeafIcon className="w-4 h-4 text-[#8daa83]" />
              <span className="text-xs font-semibold text-[#eaf0e5]/80">100% Organic • Farm Fresh</span>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-[#eaf0e5]/70 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Help</h4>
            <ul className="space-y-2.5">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-[#eaf0e5]/70 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-[#eaf0e5]/70">
              <li className="flex items-start gap-2.5">
                <PinIcon className="w-4 h-4 mt-0.5 text-[#8daa83] flex-shrink-0" />
                <span className="leading-snug">123 Green Valley Road,<br />Mumbai 400001</span>
              </li>
              <li>
                <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 98765 43210</a>
              </li>
              <li>
                <a href="mailto:hello@organicharvest.com" className="hover:text-white transition-colors">hello@organicharvest.com</a>
              </li>
            </ul>
            <a
              href="/#contact"
              className="group inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-[#8daa83] hover:text-white transition-colors"
            >
              Send us a message
              <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* ═══ Bottom Bar ═══ */}
        <div className="border-t border-white/10 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#eaf0e5]/50">
            © 2026 OrganicHarvest. All rights reserved.
          </p>
          <p className="text-xs text-[#eaf0e5]/50 flex items-center gap-1.5">
            <LeafIcon className="w-3.5 h-3.5 text-[#8daa83]" />
            Pure Food • Healthy Life
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;