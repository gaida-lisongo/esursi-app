"use client";

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UserCrud from "@/components/common/UserCrud";
import { EtablissementCard } from "@/components/etablissement/EtablissementCard";
import { EtablissementForm } from "@/components/etablissement/EtablissementForms";
import { ManageEtablissementModal } from "@/components/etablissement/ManageEtablissementModal";
import {
    getEtablissements,
    deleteEtablissement
} from "@/lib/actions/etablissement/actions";
import { useNotification } from "@/context/NotificationContext";

export default function EtablissementsPage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();

    const [modal, setModal] = useState<{
        type: "add" | "update" | "manage" | null;
        item: any | null;
    }>({ type: null, item: null });

    const loadData = async () => {
        setLoading(true);
        const res = await getEtablissements();
        console.log("Etablissements fetched : ", res);
        if (res.success) setItems(res.data);
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    const handleDelete = async (item: any) => {
        if (!confirm(`Supprimer ${item.sigle} ?`)) return;
        const res = await deleteEtablissement(item.id);
        if (res.success) {
            showNotification("Établissement supprimé", "success");
            loadData();
        } else {
            showNotification(res.message, "error");
        }
    };

    console.log("Current Modal : ", modal);

    return (
        <div className="container mx-auto pb-10">
            <PageBreadcrumb pageTitle="Gestion des Établissements" />

            <UserCrud
                title="Liste des Établissements"
                items={items}
                isLoading={loading}
                searchKeys={["sigle", "designation"]}
                onAdd={() => setModal({ type: "add", item: null })}
                renderCard={(item) => (
                    <EtablissementCard
                        item={item}
                        onUpdate={(i) => setModal({ type: "update", item: i })}
                        onDelete={handleDelete}
                        onManage={(i) => setModal({ type: "manage", item: i })}
                    />
                )}
            />

            {/* Modals */}
            {modal.type && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-4xl animate-in fade-in zoom-in duration-200">
                        {modal.type === "manage" ? (
                            <ManageEtablissementModal
                                item={modal.item}
                                onClose={() => setModal({ type: null, item: null })}
                            />
                        ) : (
                            <EtablissementForm
                                item={modal.item}
                                onClose={() => { setModal({ type: null, item: null }); loadData(); }}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
