import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, Sun, Moon, X, LogOut } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../services/firebase';
import toast from 'react-hot-toast';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { currentUser, userData, isAdmin, isOfferer, isDelivery } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            toast.success("Déconnexion réussie");
        } catch (error) {
            toast.error("Erreur de déconnexion");
        }
    };

    return (
        <nav className="glass sticky top-4 z-50 mx-4 my-4 px-6 py-4 flex items-center justify-between transition-all duration-300">
            <Link to="/" className="text-2xl font-bold gradient-text hover:opacity-80 transition-opacity">
                KivuRent
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Marketplace</Link>
                {isOfferer && (
                    <Link to="/offerer/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Mes Biens</Link>
                )}
                {isDelivery && (
                    <Link to="/delivery/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Livraisons</Link>
                )}
                {isAdmin && (
                    <Link to="/admin/dashboard" className="text-sm font-medium hover:text-primary transition-colors text-indigo-400 font-bold">Administration</Link>
                )}
                {!isAdmin && !isDelivery && !isOfferer && (
                    <Link to="/how-it-works" className="text-sm font-medium hover:text-primary transition-colors">Comment ça marche</Link>
                )}
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

                {currentUser ? (
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end mr-1">
                            <span className="text-xs font-bold text-primary capitalize">{userData?.role || 'User'}</span>
                            <span className="text-[10px] text-text-muted truncate max-w-[100px]">{currentUser.email}</span>
                        </div>
                        <button onClick={handleLogout} className="p-2 hover:bg-red-500/10 rounded-full text-text-muted hover:text-red-400 transition-colors">
                            <LogOut size={20} />
                        </button>
                    </div>
                ) : (
                    <Link to="/login" className="hidden md:flex items-center space-x-2 btn-primary hover:scale-[1.02] active:scale-[0.98]">
                        <User size={18} />
                        <span>Connexion</span>
                    </Link>
                )}

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
                    {isOfferer && <Link to="/offerer/dashboard" className="p-2 hover:bg-white/5 rounded-lg" onClick={() => setIsMenuOpen(false)}>Mes Biens</Link>}
                    {isDelivery && <Link to="/delivery/dashboard" className="p-2 hover:bg-white/5 rounded-lg" onClick={() => setIsMenuOpen(false)}>Livraisons</Link>}
                    {isAdmin && <Link to="/admin/dashboard" className="p-2 hover:bg-indigo-500/10 rounded-lg text-indigo-400 font-bold" onClick={() => setIsMenuOpen(false)}>Administration</Link>}

                    <div className="h-px bg-white/10 my-2"></div>

                    {currentUser ? (
                        <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="btn-primary bg-red-500/20 text-red-400 border-red-500/30 justify-center w-full">
                            <LogOut size={18} />
                            <span>Déconnexion</span>
                        </button>
                    ) : (
                        <Link to="/login" className="btn-primary justify-center w-full" onClick={() => setIsMenuOpen(false)}>
                            <User size={18} />
                            <span>Connexion</span>
                        </Link>
                    )}
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
