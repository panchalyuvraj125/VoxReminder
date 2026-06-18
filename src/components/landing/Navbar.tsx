import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="animate-fade-down relative z-20 flex items-center justify-between px-5 sm:px-8 lg:px-10 py-4 sm:py-5">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 text-gray-900">
        <Logo className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="font-semibold text-sm sm:text-base tracking-tight">VoxRemind</span>
      </Link>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center gap-8">
        <button className="flex items-center gap-1 text-[13px] text-gray-700 hover:text-gray-900 transition-colors">
          Features <ChevronDown className="w-3.5 h-3.5" />
        </button>
        <a href="#how-it-works" className="text-[13px] text-gray-700 hover:text-gray-900 transition-colors">
          How It Works
        </a>
        <a href="#about" className="text-[13px] text-gray-700 hover:text-gray-900 transition-colors">
          About
        </a>
      </div>

      {/* CTA + Hamburger */}
      <div className="flex items-center gap-3">
        <Link
          to="/app"
          className="bg-gray-900 text-white text-[13px] font-medium px-4 sm:px-5 py-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          Launch App
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-gray-900 hover:bg-gray-900/10 transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="absolute left-4 right-4 top-full rounded-2xl bg-white/80 backdrop-blur-xl ring-1 ring-gray-200 px-5 py-3 animate-fade-up md:hidden">
          <a href="#features" className="block py-3 text-[15px] text-gray-700 hover:text-gray-900 border-b border-gray-200">
            Features
          </a>
          <a href="#how-it-works" className="block py-3 text-[15px] text-gray-700 hover:text-gray-900 border-b border-gray-200">
            How It Works
          </a>
          <a href="#about" className="block py-3 text-[15px] text-gray-700 hover:text-gray-900">
            About
          </a>
        </div>
      )}
    </nav>
  );
}
