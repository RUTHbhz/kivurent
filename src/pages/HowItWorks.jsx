import React from 'react';
import { ShoppingBag, Upload, ShieldCheck, Truck, Rocket, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
    const steps = [
        {
            icon: <Upload size={40} className="text-primary" />,
            title: "Mettez en location",
            description: "Prenez quelques photos de votre objet, fixez un prix et postez votre annonce en quelques minutes."
        },
        {
            icon: <CheckCircle size={40} className="text-green-400" />,
            title: "Validation",
            description: "Notre équipe vérifie chaque annonce pour garantir la sécurité et la qualité du marketplace à Goma."
        },
        {
            icon: <ShoppingBag size={40} className="text-blue-400" />,
            title: "Réservez",
            description: "Les locataires cherchent ce dont ils ont besoin, paient en ligne ou à la livraison et réservent les dates."
        },
        {
            icon: <Truck size={40} className="text-amber-400" />,
            title: "Livraison",
            description: "Nos livreurs partenaires s'occupent du transport de l'objet du point A au point B en toute sécurité."
        }
    ];

    return (
        <div className="py-16 animate-fade-in px-4">
            {/* Hero Section */}
            <div className="text-center mb-20">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">Comment fonctionne <span className="gradient-text">KivuRent</span> ?</h1>
                <p className="text-xl text-text-muted max-w-2xl mx-auto">
                    La solution locale simple et sécurisée pour louer tout ce dont vous avez besoin à Goma.
                </p>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                {steps.map((step, idx) => (
                    <div key={idx} className="glass p-8 relative hover:scale-105 transition-transform">
                        <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary border border-primary/30">
                            {idx + 1}
                        </div>
                        <div className="mb-6">{step.icon}</div>
                        <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                        <p className="text-text-muted text-sm leading-relaxed">{step.description}</p>
                    </div>
                ))}
            </div>

            {/* Why KivuRent Section */}
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">Pourquoi nous faire confiance ?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldCheck className="text-primary" />
                        </div>
                        <h4 className="text-lg font-bold mb-2">Paiement Sécurisé</h4>
                        <p className="text-text-muted text-sm">Nous gardons les fonds jusqu'à ce que vous confirmiez la réception de l'objet.</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Rocket className="text-blue-400" />
                        </div>
                        <h4 className="text-lg font-bold mb-2">Service Local</h4>
                        <p className="text-text-muted text-sm">Conçu spécifiquement pour les quartiers et les besoins de Goma.</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Truck className="text-amber-400" />
                        </div>
                        <h4 className="text-lg font-bold mb-2">Logistique Intégrée</h4>
                        <p className="text-text-muted text-sm">Plus besoin de vous déplacer, nos livreurs s'occupent de tout.</p>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="mt-24 glass p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-amber-500"></div>
                <h2 className="text-3xl font-bold mb-6">Prêt à commencer ?</h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/signup" className="btn-primary px-10 py-4">Créer mon compte</Link>
                    <Link to="/" className="glass px-10 py-4 hover:bg-white/5 transition-colors">Explorer le marketplace</Link>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
