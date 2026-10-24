function Footer() {
  return (
    <footer className="bg-[#19452c] mt-8">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Logo */}
        <a href="#" className="flex items-center gap-1 text-xl font-extrabold text-white tracking-tight">
          <span className="text-2xl">✳</span>
          Organic<span className="text-[#8daa83] -ml-1">Harvest</span>
        </a>

        {/* Tagline */}
        <p className="text-sm text-[#eaf0e5]/80">
          Fresh choices. Naturally better.
        </p>

        {/* Copyright */}
        <p className="text-sm text-[#eaf0e5]/60">
          © 2026 OrganicHarvest. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;