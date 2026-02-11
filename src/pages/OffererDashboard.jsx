import React, { useState, useEffect } from 'react';
import { LayoutDashboard, PlusCircle, Package, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

const OffererDashboard = () => {
    const { currentUser } = useAuth();
    const [stats, setStats] = useState([
        { title: "Biens actifs", value: "0", icon: <Package className="text-blue-400" /> },
        { title: "En attente", value: "0", icon: <Clock className="text-amber-400" /> },
        { title: "Revenu estimé", value: "0$", icon: <DollarSign className="text-green-400" /> },
    ]);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch user's listings
                const q = query(collection(db, "listings"), where("ownerId", "==", currentUser.uid));
                const querySnapshot = await getDocs(q);
                const userListings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                setListings(userListings);

                // Calculate stats
                const activeCount = userListings.filter(l => l.status === 'approved').length;
                const pendingCount = userListings.filter(l => l.status === 'pending').length;
                // Mock revenue calculation for now
                const estimatedRevenue = userListings.reduce((acc, curr) => acc + (parseFloat(curr.price) || 0), 0);

                setStats([
                    { title: "Biens actifs", value: activeCount.toString(), icon: <Package className="text-blue-400" /> },
                    { title: "En attente", value: pendingCount.toString(), icon: <Clock className="text-amber-400" /> },
                    { title: "Valeur Totale/Jour", value: `${estimatedRevenue}$`, icon: <DollarSign className="text-green-400" /> },
                ]);

            } catch (error) {
                console.error("Error fetching offerer data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUser]);

    const handleDelete = async (id) => {
        if (!confirm("Supprimer cette annonce ?")) return;
        try {
            await deleteDoc(doc(db, "listings", id));
            setListings(prev => prev.filter(l => l.id !== id));
            alert("Annonce supprimée");
        } catch (error) {
            console.error(error);
            alert("Erreur");
        }
    };

    return (
        <div className="py-10 animate-fade-in">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-bold gradient-text">Tableau de bord Loueur</h2>
                    <p className="text-text-muted">Gérez vos biens et vos revenus en un coup d'œil.</p>
                </div>
                <Link to="/offerer/create-listing" className="btn-primary flex items-center gap-2">
                    <PlusCircle size={20} />
                    <span>Publier un nouveau bien</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {stats.map((stat, i) => (
                    <div key={i} className="glass p-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-text-muted text-sm uppercase tracking-wider">{stat.title}</span>
                            {stat.icon}
                        </div>
                        <div className="text-4xl font-bold">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass p-8">
                    <h3 className="text-xl font-bold mb-6">Vos Annonces</h3>
                    {loading ? (
                        <p className="text-text-muted">Chargement...</p>
                    ) : listings.length === 0 ? (
                        <p className="text-text-muted italic">Vous n'avez publié aucune annonce.</p>
                    ) : (
                        <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                            {listings.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/10 rounded-lg overflow-hidden">
                                            {item.images && item.images[0] ? (
                                                <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">📦</div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{item.title}</h4>
                                            <p className="text-xs text-text-muted">{item.price}$ / jour</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                            item.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                'bg-amber-500/20 text-amber-400'
                                            }`}>
                                            {item.status === 'approved' ? 'Actif' : item.status === 'rejected' ? 'Rejeté' : 'En attente'}
                                        </span>
                                        <button onClick={() => handleDelete(item.id)} className="text-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <XCircle size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="glass p-8">
                    <h3 className="text-xl font-bold mb-6">État du compte</h3>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-2xl font-bold text-white">
                            {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">{currentUser?.email}</h4>
                            <p className="text-sm text-text-muted">Membre depuis Février 2026</p>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Niveau de confiance</span>
                            <span className="text-xs text-green-400 font-bold">Vérifié</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                            <div className="bg-green-400 h-2 rounded-full w-[85%]"></div>
                        </div>
                        <p className="text-xs text-text-muted mt-2">Votre profil est complet à 85%. Ajoutez une photo de profil pour atteindre 100%.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OffererDashboard;
