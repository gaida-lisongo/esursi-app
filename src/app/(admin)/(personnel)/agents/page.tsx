"use client";

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UserCrud from "@/components/common/UserCrud";
import { AgentCard } from "@/components/personnels/agent/AgentCard";
import { AgentForm } from "@/components/personnels/agent/AgentForm";
import { AuthManager } from "@/components/personnels/agent/AuthManager";
import {
    getAgents,
    createAgent,
    updateAgent,
    deleteAgent,
    manageAuthorizations
} from "@/lib/actions/personnels/agent/actions";
import { getGrades } from "@/lib/actions/personnels/grade/getGrades";
import { getProvinces } from "@/lib/actions/personnels/province/getProvinces";
import { useNotification } from "@/context/NotificationContext";

export default function AgentsPage() {
    const [agents, setAgents] = useState<any[]>([]);
    const [grades, setGrades] = useState<any[]>([]);
    const [provinces, setProvinces] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();

    const [modal, setModal] = useState<{
        type: "add" | "update" | "auth" | null;
        agent: any | null;
    }>({ type: null, agent: null });

    const loadData = async () => {
        setLoading(true);
        const [agentsRes, gradesRes, provincesRes] = await Promise.all([
            getAgents(),
            getGrades(),
            getProvinces()
        ]);

        if (agentsRes.success) setAgents(agentsRes.data || []);
        if (gradesRes.success) setGrades(gradesRes.data || []);
        if (provincesRes.success) setProvinces(provincesRes.data || []);

        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSoftDelete = async (agent: any) => {
        if (confirm(`Voulez-vous vraiment désactiver l'agent ${agent.nom} ?`)) {
            const res = await deleteAgent(agent.id);
            if (res.success) {
                showNotification("Agent désactivé", "success");
                loadData();
            } else {
                showNotification(res.message, "error");
            }
        }
    };

    const handleManageAuth = async (auths: any[]) => {
        const res = await manageAuthorizations(modal.agent.id, auths);
        if (res.success) {
            showNotification("Autorisations mises à jour", "success");
            setModal({ type: null, agent: null });
            loadData();
        } else {
            showNotification(res.message, "error");
        }
    };

    return (
        <div className="container mx-auto pb-10">
            <PageBreadcrumb pageTitle="Gestion des Agents" />

            <UserCrud
                title="Agents"
                items={agents}
                isLoading={loading}
                searchKeys={["nom", "postNom", "prenom", "matricule"]}
                onAdd={() => setModal({ type: "add", agent: null })}
                renderCard={(agent) => (
                    <AgentCard
                        agent={agent}
                        onUpdate={(a) => setModal({ type: "update", agent: a })}
                        onDelete={handleSoftDelete}
                        onManageAuth={(a) => setModal({ type: "auth", agent: a })}
                    />
                )}
            />

            {/* Modals */}
            {modal.type && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-4xl animate-in fade-in zoom-in duration-200">
                        {modal.type === "add" || modal.type === "update" ? (
                            <AgentForm
                                agent={modal.agent}
                                grades={grades}
                                provinces={provinces}
                                onClose={() => setModal({ type: null, agent: null })}
                                onSubmit={async (data) => {
                                    const res = modal.type === "add"
                                        ? await createAgent(data)
                                        : await updateAgent(modal.agent.id, data);
                                    if (res.success) loadData();
                                    return res;
                                }}
                            />
                        ) : (
                            <AuthManager
                                authorizations={modal.agent.autorisation || []}
                                onClose={() => setModal({ type: null, agent: null })}
                                onSave={handleManageAuth}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
