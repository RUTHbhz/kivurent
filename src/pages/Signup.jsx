import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, Phone, User } from 'lucide-react';

const SignupPage = () => {
    const [role, setRole] = useState('client');

    return (
        <div className="max-w-xl mx-auto mt-12 animate-fade-in mb-20">
            <div className="glass p-8">
                <h2 className="text-3xl font-bold mb-2 gradient-text text-center">Créer un compte</h2>
                <p className="text-center text-text-muted mb-8 italic">Rejoignez la communauté KivuRent</p>

                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                                <User size={16} /> Nom complet
                            </label>
                            <input
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors"
                                placeholder="Jean D'Amour"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                                <Phone size={16} /> Téléphone
                            </label>
                            <input
                                type="tel"
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors"
                                placeholder="+243 ..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                            <Mail size={16} /> Email
                        </label>
                        <input
                            type="email"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors"
                            placeholder="votre@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                            <Lock size={16} /> Mot de passe
                        </label>
                        <input
                            type="password"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-3">Quel est votre rôle ?</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {['client', 'offerer', 'delivery'].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRole(r)}
                                    className={`p-3 rounded-xl border transition-all text-sm capitalize ${role === r
                                            ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                                            : 'bg-white/5 border-white/10 text-text-muted hover:border-white/20'
                                        }`}
                                >
                                    {r === 'offerer' ? 'Loueur' : r === 'delivery' ? 'Livreur' : r}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="w-full btn-primary py-4 mt-6 text-lg font-bold">
                        S'inscrire maintenant
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-text-muted">
                    Déjà un compte ? <Link to="/login" className="text-primary hover:underline">Se connecter</Link>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .max-w-xl { max-width: 36rem; }
        .gap-4 { gap: 1rem; }
        .gap-3 { gap: 0.75rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-3 { margin-bottom: 0.75rem; }
        .mb-20 { margin-bottom: 5rem; }
        .space-y-6 > * + * { margin-top: 1.5rem; }
        .items-center { align-items: center; }
        .gap-2 { gap: 0.5rem; }
        .rounded-xl { border-radius: 0.75rem; }
      `}} />
        </div>
    );
};

export default SignupPage;
