import React from 'react';
import { LayoutDashboard, PlusCircle, Package, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const OffererDashboard = () => {
    // Mock data
    const stats = [
        { title: "Biens actifs", value: "8", icon: <Package className="text-blue-400" /> },
        { title: "Réservations", value: "12", icon: <Clock className="text-amber-400" /> },
        { title: "Revenus totaux", value: "420$", icon: <DollarSign className="text-green-400" /> },
    ];

    const recentBookings = [
        { id: 1, item: "Appareil photo Sony", client: "Marcel Kabeya", date: "12 Fév", status: "Confirmé", price: "20$" },
        { id: 2, item: "Groupe électrogène", client: "Sarah Nabintu", date: "15 Fév", status: "En attente", price: "45$" },
    ];

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
                    <h3 className="text-xl font-bold mb-6">Réservations récentes</h3>
                    <div className="space-y-4">
                        {recentBookings.map((booking) => (
                            <div key={booking.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                <div>
                                    <h4 className="font-semibold">{booking.item}</h4>
                                    <p className="text-xs text-text-muted">{booking.client} • {booking.date}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs px-2 py-1 rounded-full ${booking.status === 'Confirmé' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                        {booking.status}
                                    </span>
                                    <div className="font-bold mt-1">{booking.price}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass p-8">
                    <h3 className="text-xl font-bold mb-6">Mes biens en attente de validation</h3>
                    <div className="text-center py-10 text-text-muted italic">
                        <Package size={40} className="mx-auto mb-4 opacity-20" />
                        Tous vos biens ont été validés !
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OffererDashboard;
