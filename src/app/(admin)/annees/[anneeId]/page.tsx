"use client";

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UserCrud from "@/components/common/UserCrud";
import { getAnneeDetails } from "@/lib/actions/education/anneeActions";
import { CalendarSectionCard } from "@/components/education/CalendarComponents";
import { CreateSectionForm, DeleteSectionForm } from "@/components/education/CalendarForms";
import { useParams } from "next/navigation";
import { useNotification } from "@/context/NotificationContext";

export default function CalendarManagementPage() {
    const { anneeId } = useParams();
    const [annee, setAnnee] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();

    const [modal, setModal] = useState<{
        type: "add" | "delete" | null;
        item: any | null;
    }>({ type: null, item: null });

    const loadData = async () => {
        setLoading(true);
        const res = await getAnneeDetails(anneeId as string);
        if (res.success) setAnnee(res.data);
        setLoading(false);
    };

    useEffect(() => { loadData(); }, [anneeId]);

    const title = annee ? `Calendrier ${annee.debut}-${annee.fin}` : "Calendrier";

    return (
        <div className="container mx-auto pb-10">
            <PageBreadcrumb pageTitle={title} />

            <UserCrud
                title="Calendrier Académique"
                items={(annee?.calendrier || []).map((s: any, i: number) => ({ ...s, id: i, index: i }))}
                isLoading={loading}
                searchKeys={["titre"]}
                onAdd={() => setModal({ type: "add", item: null })}
                renderCard={(section) => (
                    <CalendarSectionCard
                        item={section}
                        index={section.index}
                        anneeId={anneeId as string}
                        onRefresh={loadData}
                        onUpdate={(s) => { /* Update not implemented for simplicity or logic */ }}
                        onDelete={(s) => setModal({ type: "delete", item: s })}
                    />
                )}
            />

            {/* Modals */}
            {modal.type && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-xl animate-in fade-in zoom-in duration-200 bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden">
                        {modal.type === "add" ? (
                            <CreateSectionForm
                                anneeId={anneeId as string}
                                onClose={() => { setModal({ type: null, item: null }); loadData(); }}
                            />
                        ) : (
                            <DeleteSectionForm
                                anneeId={anneeId as string}
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
