"use client";

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CrudManager from "@/components/common/CrudManager";
import {
    getFacultesByEtablissement,
    getEtablissementFull
} from "@/lib/actions/etablissement/actions";
import { DeleteFaculteForm } from "@/components/etablissement/FaculteForms";
import { useParams } from "next/navigation";

export default function FacultesByEtablissementPage() {
    const { etablissementId } = useParams();
    const [facultes, setFacultes] = useState<any[]>([]);
    const [etab, setEtab] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        const [resFac, resEtab] = await Promise.all([
            getFacultesByEtablissement(etablissementId as string),
            getEtablissementFull(etablissementId as string)
        ]);
        if (resFac.success) setFacultes(resFac.data);
        if (resEtab.success) setEtab(resEtab.data);
        setLoading(false);
    };

    useEffect(() => { loadData(); }, [etablissementId]);

    return (
        <div className="container mx-auto pb-10">
            <PageBreadcrumb pageTitle={`Facultés - ${etab?.sigle || "Détails"}`} />

            <CrudManager
                title={`Facultés de ${etab?.designation || "l'établissement"}`}
                header={["designation", "programmesCount"]}
                items={facultes}
                isLoading={loading}
                searchKeys={["designation"]}
                // Only delete form as requested
                DeleteForm={(props) => (
                    <DeleteFaculteForm
                        {...props}
                        etablissementId={etablissementId as string}
                        onClose={() => { props.onClose(); loadData(); }}
                    />
                )}
            />
        </div>
    );
}
