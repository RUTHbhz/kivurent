import React from 'react';
import { Users, LayoutDashboard, CheckSquare, BarChart3, TrendingUp, AlertCircle, Trash2, CheckCircle2, XCircle } from 'lucide-react';

const AdminDashboard = () => {
    // Mock data
    const stats = [
        { title: "Utilisateurs", value: "154", sub: "+12 ce mois", icon: <Users className="text-blue-400" /> },
        { title: "Annonces", value: "89", sub: "5 en attente", icon: <LayoutDashboard className="text-purple-400" /> },
        { title: "Revenu Plateforme", value: "1,240$", sub: "Commission 10%", icon: <TrendingUp className="text-green-400" /> },
    ];

    const pendingListings = [
        { id: 201, title: "Drone DJI Mavic 3", owner: "Ibrahim S.", date: "10 Fév", price: "50$/jour" },
        { id: 202, title: "Kit de Sondage", owner: "Pascal L.", date: "11 Fév", price: "120$/jour" },
    ];

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
                        <div className="space-y-4">
                            {pendingListings.map((listing) => (
                                <div key={listing.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center group">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-xl">📦</div>
                                        <div>
                                            <h4 className="font-bold group-hover:text-primary transition-colors">{listing.title}</h4>
                                            <p className="text-xs text-text-muted">Par {listing.owner} • {listing.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold mr-4">{listing.price}</span>
                                        <button className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors" title="Approuver">
                                            <CheckCircle2 size={20} />
                                        </button>
                                        <button className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Refuser">
                                            <XCircle size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                        <div className="space-y-3">
                            {['Alice Kahindo', 'Bob Kasereka', 'Charlie Muhindo'].map((u, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent"></div>
                                        <span className="text-sm font-medium">{u}</span>
                                    </div>
                                    <button className="text-text-muted hover:text-red-400">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
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
