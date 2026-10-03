import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Heart, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0f2d1e] border-t border-emerald-900/40 text-emerald-100 relative overflow-hidden pt-12 sm:pt-14 pb-6 sm:pb-8">
      {/* Background Accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 bg-emerald-500/5 blur-[120px] pointer-events-none" />

      {/* Main 5-Column Container spanning viewport width */}
      <div className="w-full max-w-full px-6 sm:px-12 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10 mb-6 sm:mb-8">
          
          {/* Column 1: Movement Identity */}
          <div className="space-y-5">
            <Link to="/" className="inline-block bg-white/95 p-3 rounded-2xl border border-emerald-500/20 shadow-md">
              <img
                src="/brands/bs_logo.png"
                alt="Yuvaparipalan Foundation"
                className="h-12 w-auto object-contain"
              />
            </Link>

            <p className="text-xs text-emerald-200/90 leading-relaxed italic border-l-2 border-emerald-500/40 pl-3">
              "Every Youth is a Possibility. Every Possibility Creates Change. Every Change Builds a Better India."
            </p>
          </div>

          {/* Column 2: Flagship Missions */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-white text-base">Flagship Missions</h3>
            <ul className="space-y-2 text-xs text-emerald-200/90">
              <li>
                <Link to="/programs#scholarship-mission" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-emerald-400" /> Scholarship Mission
                </Link>
              </li>
              <li>
                <Link to="/programs/changepreneur-circle" className="hover:text-white transition-colors flex items-center gap-1.5 font-medium text-emerald-300">
                  <ArrowRight className="w-3 h-3 text-emerald-400" /> Changepreneur Circle
                </Link>
              </li>
              <li>
                <Link to="/programs#shepreneurs-initiative" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-emerald-400" /> Shepreneurs Initiative
                </Link>
              </li>
              <li>
                <Link to="/programs#ai-literacy-mission" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-emerald-400" /> AI Literacy Mission
                </Link>
              </li>
              <li>
                <Link to="/programs#digital-skills-mission" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-emerald-400" /> Digital Skills Mission
                </Link>
              </li>
              <li>
                <Link to="/programs#preventive-healthcare" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-emerald-400" /> Preventive Healthcare
                </Link>
              </li>
              <li>
                <Link to="/programs#leadership-academy" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-emerald-400" /> Leadership Academy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-white text-base">Quick Links</h3>
            <ul className="space-y-2 text-xs text-emerald-200/90">
              <li><Link to="/about" className="hover:text-white transition-colors">About Our Movement</Link></li>
              <li><Link to="/impact" className="hover:text-white transition-colors">2035 Impact Goals</Link></li>
              <li><Link to="/leadership" className="hover:text-white transition-colors">Leadership & Patrons</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Photo & Event Gallery</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Headquarters</Link></li>
              <li><Link to="/volunteer" className="hover:text-white transition-colors">Volunteer Registration</Link></li>
              <li><Link to="/partner" className="hover:text-white transition-colors">CSR Partner Application</Link></li>
            </ul>
          </div>

          {/* Column 4: Official Headquarters & Locations */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-white text-base">Headquarters</h3>
            <div className="space-y-3 text-xs text-emerald-200/90">
              <div className="flex gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Kannur Office (Kerala):</strong>
                  Door no 5/430 D, Madappurachal, Manathana PO, Kannur Dist, Kerala 670674
                </div>
              </div>

              <div className="flex gap-2 pt-1 border-t border-emerald-900/60">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Coimbatore Office (Tamil Nadu):</strong>
                  #3, Sri Mahalakshmi Garden, Saravanampatti, Coimbatore, Tamil Nadu 641035
                </div>
              </div>
            </div>
          </div>

          {/* Column 5: Direct Channels (Far Right) */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-white text-base">Connect</h3>
            <ul className="space-y-3.5 text-xs text-emerald-200/90">
              <li>
                <a 
                  href="tel:+919562858868" 
                  className="flex items-center gap-2.5 hover:text-white transition-colors group"
                >
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>+91 95628 58868</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:hello@yuvaparipalan.org" 
                  className="flex items-center gap-2.5 hover:text-white transition-colors group"
                >
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="truncate">hello@yuvaparipalan.org</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.yuvaparipalan.org" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2.5 hover:text-white transition-colors group"
                >
                  <Globe className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>www.yuvaparipalan.org</span>
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Positioned Extreme Left and Right of the Page */}
      <div className="pt-5 sm:pt-6 border-t border-emerald-900/60 w-full max-w-full px-6 sm:px-12 lg:px-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-emerald-300/70">
          <p>© {new Date().getFullYear()} Yuvaparipalan Foundation. All rights reserved. Non-profit Section 8 Organization.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1 text-emerald-200">
              Build with <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" /> by Branding Sparrow
            </span>
            <span className="text-emerald-800/80">|</span>
            <Link 
              to="/privacy-policy" 
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-emerald-800/80">|</span>
            <Link 
              to="/terms-and-conditions" 
              className="hover:text-white transition-colors"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
