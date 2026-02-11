import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';

const Home = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                // Temporary workaround: remove orderBy to avoid index requirement
                const q = query(
                    collection(db, "listings"),
                    where("status", "==", "active"),
                    limit(20) // Fetch a bit more to sort in memory
                );
                const querySnapshot = await getDocs(q);
                let results = [];
                querySnapshot.forEach((doc) => {
                    results.push({ id: doc.id, ...doc.data() });
                });

                // Sort in JS: latest first
                results.sort((a, b) => {
                    const dateA = a.createdAt?.seconds || 0;
                    const dateB = b.createdAt?.seconds || 0;
                    return dateB - dateA;
                });

                setListings(results.slice(0, 6));
            } catch (error) {
                console.error("Error fetching listings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    return (
        <div className="animate-fade-in">
            <div className="py-12 md:py-20 flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-1/2 mb-10 md:mb-0">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                        Louez n'importe quoi, <br />
                        <span className="gradient-text">n'importe quand</span> à Goma.
                    </h1>
                    <p className="text-xl text-text-muted mb-8 max-w-xl">
                        KivuRent connecte les propriétaires de biens avec ceux qui en ont besoin. Simple, sécurisé et local.
                    </p>
                    <div className="flex space-x-4">
                        <button className="btn-primary px-8 py-4 text-lg">Explorer le marketplace</button>
                        <a href="/how-it-works" className="glass px-8 py-4 text-lg hover:bg-white/10 transition-colors flex items-center justify-center">En savoir plus</a>
                    </div>
                </div>
                <div className="md:w-1/2 flex justify-center">
                    <div className="relative w-80 h-80">
                        <div className="absolute inset-0 bg-primary blur-[100px] opacity-20 rounded-full"></div>
                        <div className="glass w-full h-full relative z-10 flex items-center justify-center">
                            <div className="text-8xl animate-bounce-slow">🏠</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-20">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Nouveautés</h2>
                        <p className="text-text-muted">Les derniers objets disponibles à Goma.</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="glass px-4 py-2 text-sm rounded-full bg-primary/20 border-primary text-primary">Tout</button>
                        {/* More filters placeholder */}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="glass h-80 animate-pulse"></div>
                        ))}
                    </div>
                ) : listings.length === 0 ? (
                    <div className="glass p-12 text-center text-text-muted italic">
                        Aucun objet disponible pour le moment. Revenez bientôt !
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {listings.map(listing => (
                            <a href={`/listing/${listing.id}`} key={listing.id} className="glass overflow-hidden group hover:scale-[1.02] transition-transform block">
                                <div className="h-48 bg-white/5 relative overflow-hidden">
                                    {listing.imageUrl ? (
                                        <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-4xl bg-white/5">
                                            📦
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 glass px-2 py-1 text-xs font-bold text-primary capitalize">{listing.category || 'Nouveau'}</div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold mb-2 truncate">{listing.title}</h3>
                                    <p className="text-text-muted text-sm mb-4 line-clamp-2">{listing.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-primary font-bold text-xl">{listing.price} <span className="text-xs text-text-muted">$ / jour</span></span>
                                        <span className="text-sm font-medium text-text-muted">Détails →</span>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
