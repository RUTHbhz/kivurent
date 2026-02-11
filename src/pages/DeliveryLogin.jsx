import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { Truck, Lock } from 'lucide-react';

const DeliveryLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Check role
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists() && userDoc.data().role === 'delivery') {
                toast.success("Connexion réussie. Bon courage !");
                navigate('/delivery/dashboard');
            } else {
                toast.error("Accès refusé. Ce portail est réservé aux livreurs.");
                await auth.signOut();
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Erreur de connexion: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-main animate-fade-in">
            <div className="glass p-10 max-w-md w-full border-t-4 border-amber-500">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-4 bg-amber-500/20 rounded-full mb-4 text-amber-400">
                        <Truck size={48} />
                    </div>
                    <h2 className="text-3xl font-bold text-center">Espace Livreur</h2>
                    <p className="text-text-muted text-center mt-2">Connectez-vous pour voir vos courses.</p>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email Livreur</label>
                        <input
                            type="email"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-amber-500 outline-none transition-colors"
                            placeholder="livreur@kivurent.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Mot de passe</label>
                        <input
                            type="password"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-amber-500 outline-none transition-colors"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-amber-500/30">
                        {loading ? 'Connexion en cours...' : 'Démarrer la tournée'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DeliveryLogin;
