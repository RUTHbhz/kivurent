import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { Calendar, MapPin, Shield, Star, Info, ChevronLeft, ChevronRight, Truck, ShoppingBag } from 'lucide-react';

const ListingDetails = () => {
    const { id } = useParams();
    const [selectedImg, setSelectedImg] = useState(0);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useState(() => {
        const fetchListing = async () => {
            try {
                const docRef = doc(db, "listings", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setListing(docSnap.data());
                } else {
                    toast.error("Annonce introuvable");
                    navigate('/');
                }
            } catch (error) {
                console.error("Error fetching listing:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchListing();
    }, [id]);

    const handleBooking = async () => {
        if (!currentUser) {
            toast.error("Vous devez être connecté pour effectuer une réservation.");
            navigate('/login', { state: { from: `/listing/${id}` } });
            return;
        }

        try {
            // Create a mission/order for the delivery team
            await addDoc(collection(db, "orders"), {
                listingId: id,
                itemName: listing.title,
                price: listing.price,
                clientId: currentUser.uid,
                clientName: currentUser.displayName || "Client",
                ownerId: listing.ownerId,
                ownerName: listing.ownerName,
                pickupLocation: listing.location,
                deliveryLocation: "A définir avec le client", // Placeholder
                deliveryStatus: "waiting",
                createdAt: new Date()
            });
            toast.success(`Réservation initiée pour ${listing.title} !`);
            navigate('/');
        } catch (error) {
            toast.error("Erreur lors de la réservation");
        }
    };

    if (loading) return <div className="py-20 text-center glass animate-pulse mx-4">Chargement des détails...</div>;
    if (!listing) return null;

    return (
        <div className="py-10 animate-fade-in mb-20">
            <Link to="/" className="flex items-center gap-2 text-text-muted hover:text-white transition-colors mb-6">
                <ChevronLeft size={20} /> Retour au marketplace
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Gallery */}
                <div className="space-y-4">
                    <div className="glass aspect-[4/3] flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        {(listing.images && listing.images.length > 0) ? (
                            <img src={listing.images[selectedImg]} alt={listing.title} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-9xl">📦</span>
                        )}
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {listing.images?.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImg(idx)}
                                className={`glass aspect-square flex items-center justify-center overflow-hidden transition-all ${selectedImg === idx ? 'border-primary ring-2 ring-primary/20' : 'hover:bg-white/5'}`}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info & Booking */}
                <div className="space-y-8">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{listing.category}</span>
                            <div className="flex items-center gap-1 text-amber-400 text-sm">
                                <Star size={14} fill="currentColor" /> {listing.rating} ({listing.reviews} avis)
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold mb-4">{listing.title}</h1>
                        <div className="flex items-center gap-2 text-text-muted mb-6">
                            <MapPin size={18} /> {listing.location}
                        </div>
                        <div className="border-y border-white/10 py-6 my-6">
                            <h3 className="font-semibold mb-2">Description</h3>
                            <p className="text-text-muted leading-relaxed">
                                {listing.description}
                            </p>
                        </div>
                    </div>

                    <div className="glass p-8">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <span className="text-3xl font-bold text-primary">{listing.price}$</span>
                                <span className="text-text-muted"> / jour</span>
                            </div>
                            <div className="text-sm text-green-400 font-medium flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                {listing.availability}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-xs text-text-muted mb-1 uppercase font-bold tracking-tighter">Début</label>
                                <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center gap-2">
                                    <Calendar size={16} className="text-primary" />
                                    <span className="text-sm font-medium">14 Fév 2026</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-text-muted mb-1 uppercase font-bold tracking-tighter">Fin</label>
                                <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center gap-2">
                                    <Calendar size={16} className="text-primary" />
                                    <span className="text-sm font-medium">16 Fév 2026</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-text-muted">Location (2 jours)</span>
                                <span>70.00$</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-text-muted">Frais de service (10%)</span>
                                <span>7.00$</span>
                            </div>
                            <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span className="gradient-text">77.00$</span>
                            </div>
                        </div>

                        <button
                            onClick={handleBooking}
                            className="w-full btn-primary py-4 text-lg font-bold flex items-center justify-center gap-2 group"
                        >
                            <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
                            Réserver maintenant
                        </button>
                        <div className="mt-4 flex items-center justify-center gap-6 text-xs text-text-muted">
                            <span className="flex items-center gap-1"><Shield size={12} /> Paiement sécurisé</span>
                            <span className="flex items-center gap-1"><Truck size={12} /> Livraison à Goma</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingDetails;
