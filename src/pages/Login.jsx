import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

const LoginPage = () => {
    return (
        <div className="max-w-md mx-auto mt-12 animate-fade-in">
            <div className="glass p-8">
                <h2 className="text-3xl font-bold mb-6 gradient-text text-center">Connexion</h2>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors"
                            placeholder="votre@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Mot de passe</label>
                        <input
                            type="password"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors"
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="w-full btn-primary py-3 mt-4">
                        Se connecter
                    </button>
                </form>
                <div className="mt-6 text-center text-sm text-text-muted">
                    Pas encore de compte ? <Link to="/signup" className="text-primary hover:underline">S'inscrire</Link>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .max-w-md { max-width: 28rem; }
        .mt-12 { margin-top: 3rem; }
        .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
        .space-y-4 > * + * { margin-top: 1rem; }
        .block { display: block; }
        .w-full { width: 100%; }
        .mt-6 { margin-top: 1.5rem; }
        .mt-4 { margin-top: 1rem; }
      `}} />
        </div>
    );
};

export default LoginPage;
