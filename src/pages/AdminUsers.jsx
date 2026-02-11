import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, query, getDocs, doc, updateDoc, deleteDoc, addDoc, where } from 'firebase/firestore';
import {
    Users, UserPlus, Search, Filter, MoreVertical,
    Trash2, Shield, UserX, UserCheck, Edit, Save, X
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [editingUser, setEditingUser] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ displayName: '', email: '', role: 'client' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(usersData);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Échec du chargement des utilisateurs");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = async (userId, data) => {
        try {
            await updateDoc(doc(db, "users", userId), data);
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
            toast.success("Utilisateur mis à jour");
            setEditingUser(null);
        } catch (error) {
            console.error(error);
            toast.error("Erreur de mise à jour");
        }
    };

    const handleToggleStatus = async (user) => {
        const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
        await handleUpdateUser(user.id, { status: newStatus });
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
        try {
            await deleteDoc(doc(db, "users", userId));
            setUsers(prev => prev.filter(u => u.id !== userId));
            toast.success("Utilisateur supprimé");
        } catch (error) {
            console.error(error);
            toast.error("Erreur de suppression");
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = (u.displayName || u.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || u.role === filterRole;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="py-10 animate-fade-in">
            <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold gradient-text">Gestion Utilisateurs</h2>
                    <p className="text-text-muted">Contrôlez les accès et les rôles de la plateforme.</p>
                </div>
                {/* Add User Button (Mock - requires cloud function or special admin action for auth) */}
                <button
                    onClick={() => toast.error("La création directe nécessite une configuration Firebase Admin SDK (Cloud Functions)")}
                    className="btn-primary flex items-center gap-2"
                >
                    <UserPlus size={20} />
                    <span>Nouvel Utilisateur</span>
                </button>
            </div>

            <div className="glass p-6 mb-8 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou email..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 focus:ring-2 focus:ring-primary outline-none"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                    >
                        <option value="all">Tous les rôles</option>
                        <option value="client">Clients</option>
                        <option value="offerer">Offreurs</option>
                        <option value="delivery">Livreurs</option>
                        <option value="admin">Admins</option>
                    </select>
                </div>
            </div>

            <div className="glass overflow-hidden rounded-3xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-text-muted uppercase text-xs font-black tracking-widest">
                                <th className="p-6">Utilisateur</th>
                                <th className="p-6">Rôle</th>
                                <th className="p-6">Statut</th>
                                <th className="p-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="p-20 text-center text-text-muted italic">Chargement des utilisateurs...</td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-20 text-center text-text-muted italic">Aucun utilisateur trouvé.</td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold">
                                                    {user.email?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold">{user.displayName || 'Utilisateur sans nom'}</div>
                                                    <div className="text-xs text-text-muted">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            {editingUser === user.id ? (
                                                <select
                                                    className="bg-white/10 border border-white/20 rounded-lg py-1 px-2 text-sm"
                                                    value={user.role}
                                                    onChange={(e) => handleUpdateUser(user.id, { role: e.target.value })}
                                                >
                                                    <option value="client">Client</option>
                                                    <option value="offerer">Offreur</option>
                                                    <option value="delivery">Livreur</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            ) : (
                                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${user.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                                                        user.role === 'delivery' ? 'bg-blue-500/20 text-blue-400' :
                                                            user.role === 'offerer' ? 'bg-purple-500/20 text-purple-400' :
                                                                'bg-green-500/20 text-green-400'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-6">
                                            <span className={`flex items-center gap-2 text-sm ${user.status === 'suspended' ? 'text-red-400' : 'text-green-400'}`}>
                                                <div className={`w-2 h-2 rounded-full ${user.status === 'suspended' ? 'bg-red-400' : 'bg-green-400 animate-pulse'}`}></div>
                                                {user.status === 'suspended' ? 'Suspendu' : 'Actif'}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setEditingUser(editingUser === user.id ? null : user.id)}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-text-muted"
                                                    title="Changer le rôle"
                                                >
                                                    <Shield size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(user)}
                                                    className={`p-2 rounded-lg transition-colors ${user.status === 'suspended' ? 'text-green-400 hover:bg-green-400/10' : 'text-amber-400 hover:bg-amber-400/10'}`}
                                                    title={user.status === 'suspended' ? "Activer" : "Suspendre"}
                                                >
                                                    {user.status === 'suspended' ? <UserCheck size={18} /> : <UserX size={18} />}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="p-2 hover:bg-red-400/10 rounded-lg transition-colors text-text-muted hover:text-red-400"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
