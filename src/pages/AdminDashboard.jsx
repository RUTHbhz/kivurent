import React, { useState, useEffect } from 'react';
import { Users, LayoutDashboard, CheckSquare, BarChart3, TrendingUp, AlertCircle, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const AdminDashboard = () => {
    const [stats, setStats] = useState([
        { title: "Utilisateurs", value: "0", sub: "Total inscrits", icon: <Users className="text-blue-400" /> },
        { title: "Annonces", value: "0", sub: "En attente", icon: <LayoutDashboard className="text-purple-400" /> },
        { title: "Revenu Plateforme", value: "0$", sub: "Commission 10%", icon: <TrendingUp className="text-green-400" /> },
    ]);
    const [pendingListings, setPendingListings] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Chart Data Setup
    const chartData = {
        labels: ['Jan', 'Féb', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'],
        datasets: [
            {
                label: 'Revenus ($)',
                data: [450, 780, 1200, 1100, 1500, 2100, 1240], // Simulé
                fill: true,
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderColor: '#6366f1',
                borderWidth: 3,
                tension: 0.4,
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#fff',
                pointHoverRadius: 6,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e1e1e',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 12,
                displayColors: false
            }
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.5)' } },
            y: {
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: 'rgba(255,255,255,0.5)', callback: (v) => v + '$' }
            }
        }
    };

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
                setUsers(usersList.slice(0, 5)); // Just first 5 for preview

                const totalListingsSnap = await getDocs(collection(db, "listings"));

                setStats([
                    { title: "Utilisateurs", value: usersSnap.size.toString(), sub: "Total inscrits", icon: <Users className="text-blue-400" /> },
                    { title: "Annonces", value: totalListingsSnap.size.toString(), sub: `${listings.length} en attente`, icon: <LayoutDashboard className="text-purple-400" /> },
                    { title: "Revenu Plateforme", value: "1,240$", sub: "Commission 10% (Goma)", icon: <TrendingUp className="text-green-400" /> },
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
        if (!confirm(`Êtes-vous sûr de vouloir ${action === 'active' ? 'approuver' : 'rejeter'} cette annonce ?`)) return;

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
        <div className="py-10 animate-fade-in mb-20 px-4 md:px-0">
            <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-4xl font-black gradient-text tracking-tighter">Console Administration</h2>
                    <p className="text-text-muted mt-1">Vue d'ensemble de l'écosystème KivuRent à Goma.</p>
                </div>
                <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-xs font-black text-primary flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div> MODE ADMIN ACTIF
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {stats.map((stat, i) => (
                    <div key={i} className="glass p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 -mr-12 -mt-12 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <span className="text-text-muted text-[10px] uppercase font-black tracking-[0.2em]">{stat.title}</span>
                            <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">{stat.icon}</div>
                        </div>
                        <div className="text-4xl font-black mb-1 relative z-10">{stat.value}</div>
                        <div className="text-xs text-text-muted relative z-10">{stat.sub}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Validation Queue */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -mr-32 -mt-32"></div>
                        <h3 className="text-2xl font-black mb-8 flex items-center gap-3 relative z-10">
                            <CheckSquare size={24} className="text-primary" /> Files de validation
                        </h3>
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2].map(i => <div key={i} className="h-24 glass animate-pulse"></div>)}
                            </div>
                        ) : pendingListings.length === 0 ? (
                            <div className="p-16 text-center border-2 border-dashed border-white/5 rounded-3xl text-text-muted">
                                <CheckCircle2 size={48} className="mx-auto mb-4 opacity-10" />
                                <p className="italic text-lg">Tout est à jour ! Aucune annonce en attente.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {pendingListings.map((listing) => (
                                    <div key={listing.id} className="p-5 rounded-3xl bg-white/5 border border-white/10 flex justify-between items-center group hover:bg-white/[0.08] transition-all relative z-10">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-16 h-16 bg-white/10 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                                                {listing.images && listing.images[0] ? (
                                                    <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-lg group-hover:text-primary transition-colors">{listing.title}</h4>
                                                <p className="text-xs text-primary font-bold">{listing.price}$ / jour</p>
                                                <p className="text-[10px] text-text-muted mt-1 uppercase font-black tracking-widest">{listing.ownerId ? 'Propriétaire Vérifié' : 'Inconnu'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleAction(listing.id, 'active')}
                                                className="p-3 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white rounded-xl transition-all shadow-lg shadow-green-500/10"
                                                title="Approuver"
                                            >
                                                <CheckCircle2 size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleAction(listing.id, 'rejected')}
                                                className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-lg shadow-red-500/10"
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
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black flex items-center gap-3">
                                <BarChart3 className="text-primary" size={24} /> Évolution des Revenus
                            </h3>
                            <select className="bg-white/5 border border-white/10 text-xs font-bold py-2 px-4 rounded-xl outline-none">
                                <option>Derniers 7 jours</option>
                                <option>Dernier mois</option>
                            </select>
                        </div>
                        <div className="w-full h-72">
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="glass p-8 border-primary/20 bg-primary/5">
                        <h3 className="text-xl font-bold mb-6 flex justify-between items-center uppercase tracking-widest text-[12px]">
                            Utilisateurs Récents
                            <Users size={18} className="text-primary" />
                        </h3>
                        <div className="space-y-4">
                            {users.map((u) => (
                                <div key={u.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-xs font-black shadow-lg">
                                            {u.email ? u.email.substring(0, 2).toUpperCase() : 'U'}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-bold truncate w-32 group-hover:text-primary transition-colors">{u.displayName || u.email}</p>
                                            <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">{u.role}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteUser(u.id)}
                                        className="text-text-muted hover:text-red-400 p-2 rounded-lg hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                                        title="Bannir"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {users.length === 0 && <p className="text-sm text-text-muted italic text-center py-4">Aucun utilisateur.</p>}
                        </div>
                        <a href="/admin/users" className="block w-full mt-8 py-4 text-center text-[10px] uppercase font-black bg-white/5 hover:bg-primary hover:text-white rounded-2xl transition-all tracking-[0.2em]">
                            Gérer tous les utilisateurs
                        </a>
                    </div>

                    <div className="glass p-8 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border-primary/30 relative overflow-hidden group">
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                        <h3 className="font-black text-xs uppercase tracking-widest opacity-60 mb-4">Commission Totale</h3>
                        <div className="text-5xl font-black gradient-text tracking-tighter">1,240.50$</div>
                        <p className="text-xs text-text-muted mt-4 leading-relaxed font-medium">10% prélevés sur les locations réussies à Goma.</p>
                        <button className="mt-8 text-primary font-black text-[10px] tracking-widest uppercase hover:underline">Détails des gains →</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
