"use client";

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UserCrud from "@/components/common/UserCrud";
import { ProgrammeCard } from "@/components/education/ProgrammeCard";
import { ProgrammeForm, DeleteProgrammeForm } from "@/components/education/ProgrammeForms";
import { getProgrammesByCycle } from "@/lib/actions/education/programmeActions";
import { useNotification } from "@/context/NotificationContext";
import { useParams } from "next/navigation";

export default function ProgrammesByCyclePage() {
    const { cycleId } = useParams();
    const [programmes, setProgrammes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();

    const [modal, setModal] = useState<{
        type: "add" | "update" | "delete" | null;
        item: any | null;
    }>({ type: null, item: null });

    const loadData = async () => {
        setLoading(true);
        const res = await getProgrammesByCycle(cycleId as string);
        if (res.success) setProgrammes(res.data);
        setLoading(false);
    };

    useEffect(() => { loadData(); }, [cycleId]);

    const cycleName = programmes.length > 0 ? programmes[0].cycle.designation : "Détails";

    return (
        <div className="container mx-auto pb-10">
            <PageBreadcrumb pageTitle={`Programmes - ${cycleName}`} />

            <UserCrud
                title="Programmes"
                items={programmes}
                isLoading={loading}
                searchKeys={["designation", "code"]}
                onAdd={() => setModal({ type: "add", item: null })}
                renderCard={(programme) => (
                    <ProgrammeCard
                        item={programme}
                        onUpdate={(p) => setModal({ type: "update", item: p })}
                        onDelete={(p) => setModal({ type: "delete", item: p })}
                    />
                )}
            />

            {/* Modals */}
            {modal.type && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-2xl animate-in fade-in zoom-in duration-200">
                        {modal.type === "delete" ? (
                            <DeleteProgrammeForm
                                item={modal.item}
                                onClose={() => { setModal({ type: null, item: null }); loadData(); }}
                            />
                        ) : (
                            <ProgrammeForm
                                cycleId={cycleId as string}
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
