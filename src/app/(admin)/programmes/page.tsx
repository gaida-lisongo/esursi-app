"use client";

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CardCrudManager from "@/components/common/CardCrudManager";
import { getCycles } from "@/lib/actions/education/programmeActions";
import { CreateCycleForm, UpdateCycleForm, DeleteCycleForm } from "@/components/education/CycleForms";
import { EyeIcon } from "@/icons";
import Link from "next/link";

export default function CyclesPage() {
    const [cycles, setCycles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        const res = await getCycles();
        if (res.success) setCycles(res.data);
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    return (
        <div className="container mx-auto pb-10">
            <PageBreadcrumb pageTitle="Cycles de Formation" />
            <CardCrudManager
                title="Cycles"
                header={["code", "designation", "credits"]}
                items={cycles}
                isLoading={loading}
                searchKeys={["code", "designation"]}
                CreateForm={(props) => <CreateCycleForm {...props} onClose={() => { props.onClose(); loadData(); }} />}
                UpdateForm={(props) => <UpdateCycleForm {...props} onClose={() => { props.onClose(); loadData(); }} />}
                DeleteForm={(props) => <DeleteCycleForm {...props} onClose={() => { props.onClose(); loadData(); }} />}
                customActions={(item) => (
                    <Link
                        href={`/programmes/${item.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                        title="Voir les programmes"
                    >
                        <EyeIcon className="w-5 h-5" />
                    </Link>
                )}
            />
        </div>
    );
}
