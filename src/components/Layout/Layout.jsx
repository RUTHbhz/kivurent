import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="glass m-4 p-8 text-center text-text-muted">
                <div className="mb-4">
                    <span className="text-xl font-bold gradient-text">KivuRent</span>
                    <p className="mt-2 text-sm">Le marketplace de location intelligent à Goma.</p>
                </div>
                <div className="border-t border-white/10 pt-6 text-xs italic">
                    &copy; {new Date().getFullYear()} KivuRent. Tous droits réservés.
                </div>
            </footer>

            <style dangerouslySetInnerHTML={{
                __html: `
        .flex-col { flex-direction: column; }
        .flex-grow { flex-grow: 1; }
        .mx-auto { margin-left: auto; margin-right: auto; }
        .mb-4 { margin-bottom: 1rem; }
        .mt-2 { margin-top: 0.5rem; }
        .pt-6 { padding-top: 1.5rem; }
        .border-t { border-top-width: 1px; }
        .text-center { text-align: center; }
        .text-sm { font-size: 0.875rem; }
        .text-xs { font-size: 0.75rem; }
        .italic { font-style: italic; }
      `}} />
        </div>
    );
};

export default Layout;
