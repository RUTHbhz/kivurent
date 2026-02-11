import React, { useState, useEffect } from 'react';
import { Users, LayoutDashboard, CheckSquare, BarChart3, TrendingUp, AlertCircle, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const AdminDashboard = () => {
    const [stats, setStats] = useState([
        { title: "Utilisateurs", value: "0", sub: "Total inscrits", icon: <Users className="text-blue-400" /> },
        { title: "Annonces", value: "0", sub: "En attente", icon: <LayoutDashboard className="text-purple-400" /> },
        { title: "Revenu Plateforme", value: "0$", sub: "Commission 10%", icon: <TrendingUp className="text-green-400" /> },
    ]);
    const [pendingListings, setPendingListings] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch pending listings
                const q = query(collection(db, "listings"), where("status", "==", "pending"));
                const querySnapshot = await getDocs(q);
                const listings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPendingListings(listings);

                // Fetch users
                const usersSnap = await getDocs(collection(db, "users"));
                const usersList = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsers(usersList);

                const totalListingsSnap = await getDocs(collection(db, "listings"));

                setStats([
                    { title: "Utilisateurs", value: usersSnap.size.toString(), sub: "Total inscrits", icon: <Users className="text-blue-400" /> },
                    { title: "Annonces", value: totalListingsSnap.size.toString(), sub: `${listings.length} en attente`, icon: <LayoutDashboard className="text-purple-400" /> },
                    { title: "Revenu Plateforme", value: "1,240$", sub: "Commission 10% (Simulé)", icon: <TrendingUp className="text-green-400" /> },
                ]);

            } catch (error) {
                console.error("Error fetching admin data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDeleteUser = async (userId) => {
        if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ? Cette action est irréversible.")) return;
        try {
            await deleteDoc(doc(db, "users", userId));
            setUsers(prev => prev.filter(u => u.id !== userId));
            // Update stats locally
            setStats(prev => prev.map(s => s.title === "Utilisateurs" ? { ...s, value: (parseInt(s.value) - 1).toString() } : s));
            alert("Utilisateur supprimé.");
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Erreur lors de la suppression.");
        }
    };

    const handleAction = async (listingId, action) => {
        if (!confirm(`Êtes-vous sûr de vouloir ${action === 'approved' ? 'approuver' : 'rejeter'} cette annonce ?`)) return;

        try {
            const listingRef = doc(db, "listings", listingId);
            await updateDoc(listingRef, {
                status: action
            });

            // Remove from local state
            setPendingListings(prev => prev.filter(l => l.id !== listingId));
            alert(`Annonce ${action === 'active' ? 'activée' : 'rejetée'} avec succès !`);
        } catch (error) {
            console.error("Error updating listing:", error);
            alert("Erreur lors de la mise à jour.");
        }
    };

    return (
        <div className="py-10 animate-fade-in mb-20">
            <div className="mb-10 flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold gradient-text">Console Administration</h2>
                    <p className="text-text-muted">Vue d'ensemble de l'écosystème KivuRent.</p>
                </div>
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle size={14} className="text-amber-400" /> Mode Admin Actif
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {stats.map((stat, i) => (
                    <div key={i} className="glass p-6">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-text-muted text-xs uppercase font-bold tracking-widest">{stat.title}</span>
                            <div className="p-2 bg-white/5 rounded-lg">{stat.icon}</div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stat.value}</div>
                        <div className="text-xs text-text-muted">{stat.sub}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Validation Queue */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass p-8">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <CheckSquare size={20} className="text-primary" /> Files de validation
                        </h3>
                        {loading ? (
                            <p className="text-text-muted text-center py-10">Chargement des données...</p>
                        ) : pendingListings.length === 0 ? (
                            <p className="text-text-muted text-center py-10">Aucune annonce en attente de validation.</p>
                        ) : (
                            <div className="space-y-4">
                                {pendingListings.map((listing) => (
                                    <div key={listing.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center group">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-16 h-16 bg-white/10 rounded-xl overflow-hidden">
                                                {listing.images && listing.images[0] ? (
                                                    <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-bold group-hover:text-primary transition-colors">{listing.title}</h4>
                                                <p className="text-xs text-text-muted">Prix: {listing.price}$/j • {listing.ownerId || 'Inconnu'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleAction(listing.id, 'active')}
                                                className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                                                title="Approuver"
                                            >
                                                <CheckCircle2 size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleAction(listing.id, 'rejected')}
                                                className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                title="Refuser"
                                            >
                                                <XCircle size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="glass p-8">
                        <h3 className="text-xl font-bold mb-6">Transactions Récentes</h3>
                        <div className="w-full h-48 flex items-center justify-center text-text-muted italic border border-dashed border-white/10 rounded-xl">
                            Graphique des revenus (Chart.js à intégrer)
                        </div>
                    </div>
                </div>

                {/* User Management Quick View */}
                <div className="space-y-6">
                    <div className="glass p-6">
                        <h3 className="text-lg font-bold mb-4">Gestion Utilisateurs</h3>
                        <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                            {users.map((u) => (
                                <div key={u.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-xs font-bold">
                                            {u.email ? u.email.substring(0, 2).toUpperCase() : 'dS'}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-medium truncate w-32">{u.displayName || u.email}</p>
                                            <p className="text-xs text-text-muted">{u.role}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteUser(u.id)}
                                        className="text-text-muted hover:text-red-400 p-1"
                                        title="Bannir / Supprimer"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                            {users.length === 0 && <p className="text-sm text-text-muted italic">Aucun utilisateur trouvé.</p>}
                        </div>
                        <button className="w-full mt-6 text-sm text-primary font-bold hover:underline">Voir tous les utilisateurs</button>
                    </div>

                    <div className="glass p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                        <h3 className="font-bold mb-2">Commission Totale</h3>
                        <div className="text-4xl font-black gradient-text">1,240.50$</div>
                        <p className="text-xs text-text-muted mt-2">Ce montant représente les 10% prélevés sur chaque location réussie.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
