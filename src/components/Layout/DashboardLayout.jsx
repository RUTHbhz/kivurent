import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Home, Shield, Truck } from 'lucide-react';
import { auth } from '../../services/firebase';
import toast from 'react-hot-toast';

const DashboardLayout = ({ children, role }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            toast.success("Déconnexion réussie");
            navigate(`/${role}/login`);
        } catch (error) {
            toast.error("Erreur");
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col font-sans">
            {/* Minimal Dashboard Header */}
            <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/" className="text-xl font-black gradient-text tracking-tighter">KIVURENT</Link>
                    <div className="h-6 w-px bg-slate-800 mx-2"></div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-bold uppercase tracking-widest text-slate-300">
                        {role === 'admin' ? <Shield size={12} className="text-indigo-400" /> : <Truck size={12} className="text-amber-400" />}
                        {role} Space
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                        <Home size={16} /> <span className="hidden sm:inline">Retour au site</span>
                    </Link>
                    <button onClick={handleLogout} className="text-sm font-bold text-red-400 hover:text-red-300 transition-colors flex items-center gap-2">
                        <LogOut size={16} /> <span className="hidden sm:inline">Quitter</span>
                    </button>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-6 py-10 max-w-7xl">
                {children}
            </main>

            <footer className="py-8 text-center border-t border-slate-900 mt-auto">
                <p className="text-xs text-slate-500 font-medium">&copy; {new Date().getFullYear()} KivuRent Management Systems • GH v1.2</p>
            </footer>
        </div>
    );
};

export default DashboardLayout;
