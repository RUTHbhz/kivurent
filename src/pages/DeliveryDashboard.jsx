import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Package, Truck, Clock, CheckCircle, MapPin, DollarSign, User } from 'lucide-react';
import toast from 'react-hot-toast';

const DeliveryDashboard = () => {
    const { currentUser } = useAuth();
    const [availableMissions, setAvailableMissions] = useState([]);
    const [myMissions, setMyMissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen for available missions (listings marked as 'approved' or 'ready_to_deliver')
        // For this demo, we assume 'listings' that are 'active' might need delivery if specified.
        // But let's create a theoretical 'orders' collection for real missions.
        const q = query(
            collection(db, "orders"),
            where("deliveryStatus", "==", "waiting")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const missions = [];
            snapshot.forEach((doc) => {
                missions.push({ id: doc.id, ...doc.data() });
            });
            setAvailableMissions(missions);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, "orders"),
            where("deliveryPersonId", "==", currentUser.uid),
            where("deliveryStatus", "in", ["accepted", "in_progress"])
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const missions = [];
            snapshot.forEach((doc) => {
                missions.push({ id: doc.id, ...doc.data() });
            });
            setMyMissions(missions);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const handleAcceptMission = async (missionId) => {
        try {
            const missionRef = doc(db, "orders", missionId);
            await updateDoc(missionRef, {
                deliveryStatus: "accepted",
                deliveryPersonId: currentUser.uid,
                deliveryPersonName: currentUser.displayName || "Livreur"
            });
            toast.success("Mission acceptée ! Bonne route.");
        } catch (error) {
            console.error("Error accepting mission:", error);
            toast.error("Erreur lors de l'acceptation");
        }
    };

    const handleUpdateStatus = async (missionId, currentStatus) => {
        const nextStatus = currentStatus === "accepted" ? "in_progress" : "delivered";
        try {
            const missionRef = doc(db, "orders", missionId);
            await updateDoc(missionRef, {
                deliveryStatus: nextStatus,
                updatedAt: new Date()
            });
            toast.success(nextStatus === "delivered" ? "Livraison terminée ! Bien joué." : "Statut mis à jour.");
        } catch (error) {
            toast.error("Erreur de mise à jour");
        }
    };

    return (
        <div className="py-10 animate-fade-in">
            <div className="mb-10">
                <h2 className="text-3xl font-bold gradient-text">Tableau de Bord Livreur</h2>
                <p className="text-text-muted">Gérez vos courses et gagnez de l'argent à Goma.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass p-8">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <h3 className="text-xl font-bold">Missions disponibles à Goma</h3>
                        </div>

                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2].map(i => <div key={i} className="h-40 glass animate-pulse"></div>)}
                            </div>
                        ) : availableMissions.length === 0 ? (
                            <div className="p-10 text-center glass border-dashed border-white/10 text-text-muted italic">
                                Aucune nouvelle mission pour le moment.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {availableMissions.map((mission) => (
                                    <div key={mission.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{mission.itemName}</h4>
                                                <div className="flex items-center gap-1 text-text-muted text-sm mt-1">
                                                    <User size={14} /> {mission.clientName}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-primary font-bold text-xl">{mission.price}$</div>
                                                <div className="text-xs text-text-muted">{mission.distance || 'Goma Central'}</div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-sm mb-6 bg-black/20 p-4 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                                                <span>{mission.pickupLocation}</span>
                                            </div>
                                            <div className="flex-1 h-px bg-white/10 mx-4 relative">
                                                <Truck size={16} className="absolute -top-2 left-1/2 -translate-x-1/2 text-primary" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                <span>{mission.deliveryLocation}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleAcceptMission(mission.id)}
                                            className="w-full btn-primary py-3"
                                        >
                                            Accepter la mission
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="glass p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Truck size={20} className="text-primary" /> Mes missions actives
                        </h3>
                        {myMissions.length === 0 ? (
                            <p className="text-sm text-text-muted italic px-4">Aucune mission en cours.</p>
                        ) : (
                            myMissions.map((m) => (
                                <div key={m.id} className="p-4 rounded-xl bg-primary/10 border border-primary/20 mb-4">
                                    <h4 className="font-bold mb-1">{m.itemName}</h4>
                                    <p className="text-xs text-text-muted mb-3">Pour: {m.clientName}</p>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xs bg-primary text-white px-2 py-0.5 rounded uppercase font-bold">
                                            {m.deliveryStatus === 'accepted' ? 'Acceptée' : 'En route'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleUpdateStatus(m.id, m.deliveryStatus)}
                                        className="w-full bg-white text-black font-bold py-2 rounded-lg text-sm hover:bg-slate-200 transition-colors"
                                    >
                                        {m.deliveryStatus === 'accepted' ? 'Démarrer la course' : 'Confirmer la livraison'}
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="glass p-6">
                        <h3 className="text-lg font-bold mb-4">Gains du jour</h3>
                        <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                            <DollarSign className="text-green-500" />
                            <span className="text-2xl font-bold text-green-400 underline decoration-green-500/30">0.00 $</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryDashboard;
