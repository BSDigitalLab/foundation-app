import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../../stores/useAppStore';
import { useCustomerAuthStore } from '../../stores/useCustomerAuthStore';
import { Menu, X, Sparkles, HeartHandshake, GraduationCap, ChevronRight, User, LogOut } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useAppStore();
  const { isAuthenticated, customer, openModal, logout } = useCustomerAuthStore();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    closeMobileMenu();
  }, [location, closeMobileMenu]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Programs', path: '/programs' },
    { name: 'Impact 2035', path: '/impact' },
    { name: 'Leadership', path: '/leadership' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-emerald-900/10 py-3.5 shadow-md shadow-emerald-900/5'
          : 'bg-transparent border-b border-transparent py-5 sm:py-6 shadow-none'
      )}
    >
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between gap-4 w-full">
          
          {/* Official Brand Logo (Far Left) */}
          <Link to="/" className="flex items-center group focus:outline-none focus:ring-2 focus:ring-emerald-700 rounded-lg py-0.5 shrink-0">
            <img
              src="/brands/bs_logo.png"
              alt="Yuvaparipalan Foundation - A Transformative Movement for Youth Empowerment"
              className="h-11 sm:h-14 w-auto object-contain group-hover:scale-[1.02] transition-transform duration-200"
            />
          </Link>

          {/* Strictly Right-Aligned Navigation Bar + CTAs (Far Right) */}
          <div className="hidden lg:flex items-center gap-2 ml-auto justify-end bg-white/95 backdrop-blur-xl border border-emerald-900/20 px-3 py-2 rounded-full shadow-xl shadow-emerald-950/5">
            
            {/* Right-aligned Nav Links */}
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    cn(
                      'px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 whitespace-nowrap',
                      isActive
                        ? 'bg-emerald-800 text-white font-bold shadow-sm'
                        : 'text-slate-700 hover:text-emerald-900 hover:bg-emerald-50'
                    )
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Vertical Divider */}
            <span className="h-5 w-px bg-slate-200 mx-1 inline-block" />

            {/* Integrated Action CTA Buttons */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 rounded-full px-3 py-1 text-xs">
                  <User className="w-3.5 h-3.5 text-emerald-800" />
                  <span className="font-bold text-emerald-950 max-w-[100px] truncate">
                    {customer?.first_name || customer?.phone_number || 'My Account'}
                  </span>
                  <button
                    onClick={() => logout()}
                    title="Sign Out"
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => openModal()}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm px-3.5 py-2 rounded-full flex items-center gap-1.5 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 whitespace-nowrap"
                >
                  <User className="w-4 h-4 text-emerald-800" />
                  <span>Sign In</span>
                </button>
              )}

              <Link to="/volunteer">
                <button className="bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-full flex items-center gap-1.5 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 whitespace-nowrap">
                  <HeartHandshake className="w-4 h-4 text-emerald-100" />
                  <span>Be a Volunteer</span>
                </button>
              </Link>

              <a
                href="https://www.yuvaparipalan.com/"
                target="_blank"
                rel="noopener noreferrer"
                id="partner-csr-cta"
                className="inline-block"
              >
                <button className="bg-[#facc15] hover:bg-[#eab308] text-slate-950 border border-yellow-300/80 font-bold text-xs sm:text-sm px-4.5 py-2 rounded-full flex items-center gap-1.5 transition-all shadow-md hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-500 whitespace-nowrap">
                  <GraduationCap className="w-4 h-4 text-slate-950" />
                  <span>Join Program</span>
                </button>
              </a>
            </div>

          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-900 hover:bg-emerald-50 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[75px] z-40 bg-white/98 backdrop-blur-2xl border-t border-slate-200 overflow-y-auto animate-fadeIn">
          <div className="px-5 py-6 space-y-4 max-w-lg mx-auto">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between font-medium">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                Target 2035: 10 Million Empowered
              </span>
              <span className="font-mono text-emerald-800 font-bold">Section 8 NGO</span>
            </div>

            <nav className="space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-4 py-3 text-base font-semibold rounded-xl transition-all',
                      isActive
                        ? 'bg-emerald-800 text-white font-bold'
                        : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'
                    )
                  }
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </NavLink>
              ))}
            </nav>

            <div className="pt-4 border-t border-slate-200 space-y-2.5">
              {isAuthenticated ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-800" />
                    <span className="font-bold text-sm text-emerald-950">
                      {customer?.first_name || customer?.phone_number || 'My Account'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="text-xs text-rose-600 font-bold hover:underline"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    openModal();
                    closeMobileMenu();
                  }}
                  className="w-full justify-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm py-3 px-4 rounded-xl flex items-center gap-2 transition-all shadow-sm"
                >
                  <User className="w-4 h-4 text-emerald-800" />
                  <span>Customer Sign In / Register</span>
                </button>
              )}

              <Link to="/volunteer" className="block w-full">
                <button className="w-full justify-center bg-[#15803d] hover:bg-[#166534] text-white font-bold text-sm py-3 px-4 rounded-xl flex items-center gap-2 transition-all shadow-sm">
                  <HeartHandshake className="w-4 h-4 text-emerald-100" />
                  <span>Be a Volunteer</span>
                </button>
              </Link>
              <a
                href="https://www.yuvaparipalan.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <button className="w-full justify-center bg-[#facc15] hover:bg-[#eab308] text-slate-950 border border-yellow-300/80 font-bold text-sm py-3 px-4 rounded-xl flex items-center gap-2 transition-all shadow-md">
                  <GraduationCap className="w-4 h-4 text-slate-950" />
                  <span>Join Program</span>
                </button>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
