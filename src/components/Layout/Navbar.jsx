import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, Sun, Moon, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="glass sticky top-4 z-50 mx-4 my-4 px-6 py-4 flex items-center justify-between transition-all duration-300">
            <Link to="/" className="text-2xl font-bold gradient-text hover:opacity-80 transition-opacity">
                KivuRent
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Marketplace</Link>
                <Link to="/how-it-works" className="text-sm font-medium hover:text-primary transition-colors">Comment ça marche</Link>
                <Link to="/offerer/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Louer mes biens</Link>
            </div>

            <div className="flex items-center space-x-3">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-white/5 text-text-muted hover:text-primary transition-colors"
                    title={theme === 'dark' ? 'Mode Clair' : 'Mode Sombre'}
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <div className="h-6 w-px bg-border-color mx-1 hidden md:block"></div>

                <button className="p-2 hover:bg-white/5 rounded-full text-text-muted hover:text-primary transition-colors hidden sm:block">
                    <Search size={20} />
                </button>

                <Link to="/login" className="hidden md:flex items-center space-x-2 btn-primary hover:scale-[1.02] active:scale-[0.98]">
                    <User size={18} />
                    <span>Connexion</span>
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 hover:bg-white/5 rounded-full transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 glass mx-4 p-4 flex flex-col space-y-4 md:hidden animate-fade-in z-50">
                    <Link to="/" className="p-2 hover:bg-white/5 rounded-lg" onClick={() => setIsMenuOpen(false)}>Marketplace</Link>
                    <Link to="/how-it-works" className="p-2 hover:bg-white/5 rounded-lg" onClick={() => setIsMenuOpen(false)}>Comment ça marche</Link>
                    <Link to="/offerer/dashboard" className="p-2 hover:bg-white/5 rounded-lg" onClick={() => setIsMenuOpen(false)}>Louer mes biens</Link>
                    <div className="h-px bg-white/10 my-2"></div>
                    <Link to="/login" className="btn-primary justify-center w-full" onClick={() => setIsMenuOpen(false)}>
                        <User size={18} />
                        <span>Connexion</span>
                    </Link>
                </div>
            )}

            {/* Styles are now handled by index.css utility classes */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .bg-border-color { background-color: var(--border-color); }
                .space-x-3 > * + * { margin-left: 0.75rem; }
            `}} />
        </nav>
    );
};

export default Navbar;
