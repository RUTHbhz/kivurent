import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, MapPin, Shield, Star, Info, ChevronLeft, ChevronRight, Truck, ShoppingBag } from 'lucide-react';

const ListingDetails = () => {
    const { id } = useParams();
    const [selectedImg, setSelectedImg] = useState(0);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    // Mock data
    const listing = {
        title: "Appareil photo professionnel Sony Alpha a7 III",
        category: "Électronique",
        price: 35,
        owner: "Gaston Mubiru",
        rating: 4.8,
        reviews: 12,
        location: "Goma, Quartier Himbi",
        description: "Cet appareil photo hybride plein format est idéal pour vos événements, mariages ou tournages professionnels à Goma. Livré avec un objectif 28-70mm f/3.5-5.6 OSS, une batterie et un chargeur.",
        images: ["🏠", "📷", "📽", "📸"],
        availability: "Disponible",
    };

    const handleBooking = () => {
        if (!currentUser) {
            alert("Vous devez être connecté pour effectuer une réservation.");
            navigate('/login', { state: { from: `/listing/${id}` } });
            return;
        }
        // Proceed with booking logic (mock for now)
        alert(`Réservation initiée pour ${listing.title} !`);
    };

    return (
        <div className="py-10 animate-fade-in mb-20">
            <Link to="/" className="flex items-center gap-2 text-text-muted hover:text-white transition-colors mb-6">
                <ChevronLeft size={20} /> Retour au marketplace
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Gallery */}
                <div className="space-y-4">
                    <div className="glass aspect-[4/3] flex items-center justify-center text-9xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        {listing.images[selectedImg]}
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {listing.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImg(idx)}
                                className={`glass aspect-square flex items-center justify-center text-2xl transition-all ${selectedImg === idx ? 'border-primary ring-2 ring-primary/20' : 'hover:bg-white/5'}`}
                            >
                                {img}
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
