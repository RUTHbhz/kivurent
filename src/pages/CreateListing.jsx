import React, { useState } from 'react';
import { Camera, Plus, Trash2, MapPin, Tag, DollarSign, Loader2 } from 'lucide-react';
import { storage } from '../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CreateListing = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleImageChange = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const storageRef = ref(storage, `listings/${Date.now()}_${file.name}`);
            setLoading(true);
            try {
                const snapshot = await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(snapshot.ref);
                setImages([...images, downloadURL]);
            } catch (error) {
                console.error("Error uploading image:", error);
                alert("Erreur lors du téléchargement de l'image");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 animate-fade-in">
            <h2 className="text-3xl font-bold mb-8 gradient-text">Publier un bien</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass p-6">
                        <h3 className="text-lg font-semibold mb-4 border-b border-white/10 pb-2">Informations Générales</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-text-muted mb-1">Titre de l'annonce</label>
                                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none" placeholder="Ex: Appareil de sonorisation complet" />
                            </div>
                            <div>
                                <label className="block text-sm text-text-muted mb-1">Description</label>
                                <textarea className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none h-32" placeholder="Décrivez votre bien en détail..."></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-text-muted mb-1 flex items-center gap-1"><Tag size={14} /> Catégorie</label>
                                    <select className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none text-white">
                                        <option value="electronics">Électronique</option>
                                        <option value="tools">Outillage</option>
                                        <option value="events">Événementiel</option>
                                        <option value="vehicles">Véhicules</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-text-muted mb-1 flex items-center gap-1"><MapPin size={14} /> Localisation</label>
                                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none" placeholder="Ex: Goma, Himbi" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass p-6">
                        <h3 className="text-lg font-semibold mb-4 border-b border-white/10 pb-2">Prix et Disponibilité</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <label className="block text-sm text-text-muted mb-1 flex items-center gap-1"><DollarSign size={14} /> Prix par jour ($)</label>
                                <input type="number" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none" placeholder="0.00" />
                            </div>
                            <div className="flex-1 pt-6 text-sm italic text-text-muted">
                                KivuRent prendra une commission de 10% sur chaque transaction.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass p-6">
                        <h3 className="text-lg font-semibold mb-4 border-b border-white/10 pb-2">Images</h3>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {images.map((img, idx) => (
                                <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-white/5 relative group">
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                            {images.length < 4 && (
                                <label className="aspect-square rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                                    <Plus size={24} className="text-text-muted mb-1" />
                                    <span className="text-xs text-text-muted">Ajouter</span>
                                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                </label>
                            )}
                        </div>
                        <p className="text-xs text-text-muted">Maximum 4 images. La première sera la photo principale.</p>
                    </div>

                    <button className="w-full btn-primary py-4 text-lg font-bold flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="animate-spin" /> : <Camera size={20} />}
                        Publier l'annonce
                    </button>
                    <p className="text-center text-xs text-text-muted">Votre annonce sera validée par un admin sous 24h.</p>
                </div>
            </div>


        </div>
    );
};

export default CreateListing;
