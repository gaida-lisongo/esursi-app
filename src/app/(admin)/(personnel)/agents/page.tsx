"use client";

import React, { useEffect, useState, useMemo } from "react";
import UserCrud from "@/components/common/UserCrud";
import { AgentCard } from "@/components/personnels/agent/AgentCard";
import { AgentForm } from "@/components/personnels/agent/AgentForm";
import { AuthManager } from "@/components/personnels/agent/AuthManager";
import {
    getAffectations,
    createAgent,
    updateAgent,
    deleteAgent,
    manageAuthorizations,
    createAffectation
} from "@/lib/actions/personnels/agent/actions";
import { getGrades } from "@/lib/actions/personnels/grade/getGrades";
import { getProvinces } from "@/lib/actions/personnels/province/getProvinces";
import { useNotification } from "@/context/NotificationContext";

interface PageProps {
    personnel?: string;
    searchParams?: { personnel?: string };
    etabId?: string;
    anneeId?: string;
}

export default function AgentsPage({ personnel = "", searchParams, etabId, anneeId }: PageProps) {
    const [affectations, setAffectations] = useState<any[]>([]);
    const [grades, setGrades] = useState<any[]>([]);
    const [provinces, setProvinces] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();

    // Support both direct props and searchParams
    const currentPersonnel = searchParams?.personnel || personnel;

    const [modal, setModal] = useState<{
        type: "add" | "update" | "auth" | null;
        agent: any | null;
    }>({ type: null, agent: null });

    const loadData = async () => {
        setLoading(true);
        try {
            const [agentsRes, gradesRes, provincesRes] = await Promise.all([
                getAffectations(etabId!, anneeId!),
                getGrades(),
                getProvinces()
            ]);

            console.log("ALl agents fetched : ", agentsRes);

            if (agentsRes && "success" in agentsRes && agentsRes.success) {
                setAffectations(agentsRes.data || []);
            }
            if (gradesRes && "success" in gradesRes && gradesRes.success) {
                setGrades(gradesRes.data || []);
            }
            if (provincesRes && "success" in provincesRes && provincesRes.success) {
                setProvinces(provincesRes.data || []);
            }
        } catch (error: any) {
            console.error("Error loading data:", error);
            showNotification("Erreur lors du chargement des données", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredAffectations = useMemo(() => {
        if (!currentPersonnel) return affectations;
        return affectations.filter(aff => aff.agent.grade?.personnel === currentPersonnel);
    }, [affectations, currentPersonnel]);

    const filteredGrades = useMemo(() => {
        if (!currentPersonnel) return grades;
        return grades.filter(g => g.personnel === currentPersonnel);
    }, [grades, currentPersonnel]);

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
        if (!modal.agent) return;
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
            <UserCrud
                title={currentPersonnel ? `Agents - ${currentPersonnel}` : "Agents"}
                items={filteredAffectations}
                isLoading={loading}
                searchKeys={["agent.nom", "agent.postNom", "agent.prenom", "agent.matricule"]}
                onAdd={() => setModal({ type: "add", agent: null })}
                renderCard={(affectation) => (
                    <AgentCard
                        agent={affectation.agent}
                        onUpdate={(a) => setModal({ type: "update", agent: a })}
                        onDelete={() => handleSoftDelete(affectation.agent)}
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
                                grades={filteredGrades}
                                provinces={provinces}
                                onClose={() => setModal({ type: null, agent: null })}
                                onSubmit={async (data) => {
                                    if (modal.type === 'add') {
                                        const agentRes = await createAgent(data);
                                        if (agentRes.success && agentRes.data) {
                                            const affectationData = {
                                                agent: agentRes.data._id,
                                                etablissement: etabId,
                                                annee: anneeId,
                                            };
                                            const affectationRes = await createAffectation(affectationData);
                                            if (affectationRes.success) {
                                                loadData();
                                            }
                                            return affectationRes;
                                        }
                                        return agentRes;
                                    } else { // 'update'
                                        const res = await updateAgent(modal.agent._id, data);
                                        if (res.success) loadData();
                                        return res;
                                    }
                                }}
                            />
                        ) : (
                            <AuthManager
                                authorizations={modal.agent?.autorisation || []}
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
