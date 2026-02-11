import React from 'react';
import { Package, Truck, Clock, CheckCircle, MapPin, DollarSign, User } from 'lucide-react';

const DeliveryDashboard = () => {
    // Mock data
    const availableMissions = [
        { id: 101, item: "Groupe électrogène", client: "Sarah Nabintu", pickup: "Q. Virunga", delivery: "Q. Lac Vert", reward: "2.5$", distance: "4.5km" },
        { id: 102, item: "Appareil photo Sony", client: "Marcel Kabeya", pickup: "Q. Himbi", delivery: "Q. Mapendo", reward: "1.5$", distance: "2.1km" },
    ];

    const myMissions = [
        { id: 98, item: "Bouteille de gaz 12kg", status: "En cours", client: "Alice Bora", eta: "15 min" },
    ];

    return (
        <div className="py-10 animate-fade-in">
            <div className="mb-10">
                <h2 className="text-3xl font-bold gradient-text">Portail Livreur</h2>
                <p className="text-text-muted">Gérez vos livraisons et gagnez de l'argent à Goma.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass p-8">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <h3 className="text-xl font-bold">Missions disponibles</h3>
                        </div>
                        <div className="space-y-4">
                            {availableMissions.map((mission) => (
                                <div key={mission.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{mission.item}</h4>
                                            <div className="flex items-center gap-1 text-text-muted text-sm mt-1">
                                                <User size={14} /> {mission.client}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-primary font-bold text-xl">{mission.reward}</div>
                                            <div className="text-xs text-text-muted">{mission.distance}</div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm mb-6 bg-black/20 p-4 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                                            <span>{mission.pickup}</span>
                                        </div>
                                        <div className="flex-1 h-px bg-white/10 mx-4 relative">
                                            <Truck size={16} className="absolute -top-2 left-1/2 -translate-x-1/2 text-primary" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                            <span>{mission.delivery}</span>
                                        </div>
                                    </div>
                                    <button className="w-full btn-primary py-3">Accepter la mission</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="glass p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Truck size={20} className="text-primary" /> Mission active
                        </h3>
                        {myMissions.map((m) => (
                            <div key={m.id} className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                                <h4 className="font-bold mb-1">{m.item}</h4>
                                <p className="text-xs text-text-muted mb-3">Pour: {m.client}</p>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs bg-primary text-white px-2 py-0.5 rounded uppercase font-bold">{m.status}</span>
                                    <span className="text-xs text-primary font-bold">ETA: {m.eta}</span>
                                </div>
                                <button className="w-full bg-white text-black font-bold py-2 rounded-lg text-sm hover:bg-slate-200 transition-colors">
                                    Mettre à jour statut
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="glass p-6">
                        <h3 className="text-lg font-bold mb-4">Historique</h3>
                        <div className="space-y-3">
                            {[1, 2].map(i => (
                                <div key={i} className="flex items-center justify-between text-sm p-2 rounded hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={14} className="text-green-400" />
                                        <span className="text-text-muted">Livraison completed</span>
                                    </div>
                                    <span className="font-medium">+2.0$</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryDashboard;
