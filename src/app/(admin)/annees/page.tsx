"use client";

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CardCrudManager from "@/components/common/CardCrudManager";
import { getAnnees } from "@/lib/actions/education/anneeActions";
import { CreateAnneeForm, UpdateAnneeForm, DeleteAnneeForm } from "@/components/education/AnneeForms";
import { CalenderIcon } from "@/icons";
import Link from "next/link";

export default function AnneesPage() {
    const [annees, setAnnees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        const res = await getAnnees();
        if (res.success) setAnnees(res.data || []);
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    return (
        <div className="container mx-auto pb-10">
            <PageBreadcrumb pageTitle="Années Académiques" />
            <CardCrudManager
                title="Liste des Années"
                header={["debut", "fin", "description", "actif"]}
                items={annees}
                isLoading={loading}
                searchKeys={["debut", "fin", "description"]}
                CreateForm={(props) => <CreateAnneeForm {...props} onClose={() => { props.onClose(); loadData(); }} />}
                UpdateForm={(props) => <UpdateAnneeForm {...props} onClose={() => { props.onClose(); loadData(); }} />}
                DeleteForm={(props) => <DeleteAnneeForm {...props} onClose={() => { props.onClose(); loadData(); }} />}
                customActions={(item) => (
                    <Link
                        href={`/annees/${item.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                        title="Configurer le Calendrier"
                    >
                        <CalenderIcon className="w-5 h-5" />
                    </Link>
                )}
            />
        </div>
    );
}
