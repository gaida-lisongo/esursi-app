"use client";

import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Image from "next/image";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { PlusIcon, TrashBinIcon, PencilIcon, UserIcon, LockIcon } from "@/icons";
import { getAdmins, createAdmin, updateAdmin, deleteAdmin, getAgents } from "@/lib/actions/personnels/agent/actions";
import InputField from "@/components/form/input/InputField";
import Select from "@/components/form/Select";

export default function AdminPage() {
    const [admins, setAdmins] = useState<any[]>([]);
    const [agents, setAgents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Create Admin Form State
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedAgentId, setSelectedAgentId] = useState("");
    const [selectedRole, setSelectedRole] = useState("Moderateur");
    const [generatedPassword, setGeneratedPassword] = useState("");

    // Edit Admin State
    const [editingAdmin, setEditingAdmin] = useState<any>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        const [adminsRes, agentsRes] = await Promise.all([getAdmins(), getAgents()]);
        console.log("Admin fetched : ", adminsRes);
        console.log("Admin fetched : ", agentsRes);
        if (adminsRes.success) setAdmins(adminsRes.data);
        if (agentsRes.success) setAgents(agentsRes.data);
        setIsLoading(false);
    };

    const generatePassword = () => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let retVal = "";
        for (let i = 0, n = charset.length; i < 10; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        setGeneratedPassword(retVal);
    };

    const handleCreateAdmin = async () => {
        if (!selectedAgentId || !selectedRole || !generatedPassword) {
            alert("Veuillez remplir tous les champs");
            return;
        }

        const res = await createAdmin({
            agentId: selectedAgentId,
            role: selectedRole,
            password: generatedPassword
        });

        if (res.success) {
            setIsModalOpen(false);
            resetForm();
            fetchData();
        } else {
            alert(res.message);
        }
    };

    const handleDeleteAdmin = async (id: string) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cet administrateur ?")) {
            const res = await deleteAdmin(id);
            if (res.success) {
                fetchData();
            } else {
                alert(res.message);
            }
        }
    };

    const handleUpdateAdminRole = async () => {
        if (!editingAdmin) return;
        const res = await updateAdmin(editingAdmin.id, { role: selectedRole });
        if (res.success) {
            setIsEditModalOpen(false);
            fetchData();
        } else {
            alert(res.message);
        }
    };

    const resetForm = () => {
        setSelectedAgentId("");
        setSelectedRole("Moderateur");
        setGeneratedPassword("");
        setSearchQuery("");
    };

    const filteredAgents = agents.filter(agent =>
        !admins.some(admin => admin.agentId?._id === agent._id) &&
        (agent.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agent.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agent.matricule.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="p-4 sm:p-6 ml-0">
            <PageBreadcrumb pageTitle="Gestion des Administrateurs" />

            <div className="flex justify-end mb-6">
                <Button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" />
                    Ajouter un Admin
                </Button>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[1102px]">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        Agent
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        Matricule
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        Rôle
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {admins.map((admin) => (
                                    <TableRow key={admin.id}>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 overflow-hidden rounded-full bg-gray-100 flex items-center justify-center">
                                                    {admin.agentId?.photo ? (
                                                        <Image width={40} height={40} src={admin.agentId.photo} alt={admin.agentId.nom} />
                                                    ) : (
                                                        <UserIcon className="w-6 h-6 text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {admin.agentId?.nom} {admin.agentId?.prenom}
                                                    </span>
                                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                        {admin.agentId?.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {admin.agentId?.matricule}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">
                                            <Badge
                                                size="sm"
                                                color={
                                                    admin.role === "Super" ? "error" :
                                                        admin.role === "Finance" ? "success" :
                                                            admin.role === "Education" ? "warning" : "primary"
                                                }
                                            >
                                                {admin.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-end">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => { setEditingAdmin(admin); setSelectedRole(admin.role); setIsEditModalOpen(true); }}
                                                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg dark:hover:bg-white/5"
                                                >
                                                    <PencilIcon className="w-5 h-5 text-gray-400" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAdmin(admin.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg dark:hover:bg-red-500/10"
                                                >
                                                    <TrashBinIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {admins.length === 0 && !isLoading && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="px-5 py-10 text-center text-gray-500">
                                            Aucun administrateur trouvé.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Modal Création Admin */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-[500px] p-6">
                <h2 className="text-xl font-bold mb-4 dark:text-white">Ajouter un Administrateur</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Rechercher un Agent
                        </label>
                        <InputField
                            type="text"
                            placeholder="Nom, Prénom ou Matricule..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && !selectedAgentId && (
                            <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
                                {filteredAgents.map(agent => (
                                    <div
                                        key={agent._id}
                                        className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2 border-b last:border-0 dark:border-gray-700"
                                        onClick={() => { setSelectedAgentId(agent._id); setSearchQuery(`${agent.nom} ${agent.prenom}`); }}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                            {agent.photo ? <Image src={agent.photo} width={32} height={32} alt="" /> : <UserIcon className="w-5 h-5 m-1.5 text-gray-400" />}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium dark:text-white">{agent.nom} {agent.prenom}</div>
                                            <div className="text-xs text-gray-500">{agent.matricule}</div>
                                        </div>
                                    </div>
                                ))}
                                {filteredAgents.length === 0 && (
                                    <div className="p-4 text-center text-sm text-gray-500">Aucun agent disponible</div>
                                )}
                            </div>
                        )}
                        {selectedAgentId && (
                            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex justify-between items-center">
                                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Agent sélectionné</span>
                                <button
                                    onClick={() => { setSelectedAgentId(""); setSearchQuery(""); }}
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    Changer
                                </button>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Rôle
                        </label>
                        <Select
                            options={[
                                { value: "Moderateur", label: "Modérateur" },
                                { value: "Finance", label: "Finance" },
                                { value: "Education", label: "Education" },
                                { value: "Super", label: "Super Admin" },
                            ]}
                            onChange={(value) => setSelectedRole(value)}
                            defaultValue={selectedRole}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Mot de passe
                        </label>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <InputField
                                    type="text"
                                    value={generatedPassword}
                                />
                            </div>
                            <Button onClick={generatePassword} variant="outline" className="h-11">
                                Générer
                            </Button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                        <Button onClick={handleCreateAdmin}>Confirmer</Button>
                    </div>
                </div>
            </Modal>

            {/* Modal Edition Admin */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className="max-w-[400px] p-6">
                <h2 className="text-xl font-bold mb-4 dark:text-white">Modifier les privilèges</h2>
                <p className="text-sm text-gray-500 mb-4 font-medium">
                    Agent: {editingAdmin?.agentId?.nom} {editingAdmin?.agentId?.prenom}
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" >
                            Rôle
                        </label>
                        <Select
                            options={[
                                { value: "Moderateur", label: "Modérateur" },
                                { value: "Finance", label: "Finance" },
                                { value: "Education", label: "Education" },
                                { value: "Super", label: "Super Admin" },
                            ]}
                            onChange={(value) => setSelectedRole(value)}
                            defaultValue={selectedRole}
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Annuler</Button>
                        <Button onClick={handleUpdateAdminRole}>Mettre à jour</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
