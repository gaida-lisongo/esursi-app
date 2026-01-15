import CrudManager from "@/components/common/CrudManager";
import { getProvinces } from "@/lib/actions/personnels/province/getProvinces";
import { CreateProvinceForm, UpdateProvinceForm, DeleteProvinceForm } from "@/components/personnels/province/ProvinceForms";
import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export const metadata: Metadata = {
    title: "Provinces | ESURSI-APP",
    description: "Gestion des provinces",
};
type ProvinceItem = {
    id: string;
    code: string;
    designation: string;
    description?: string;
    actif: boolean;
};

const ProvincesPage = async () => {
    const provincesData = await getProvinces();
    const initialItems: ProvinceItem[] = provincesData.success ? provincesData.data : [];

    return (
        <div>
            <PageBreadcrumb pageTitle="Provinces" />
            <CrudManager
                title="Provinces"
                header={["code", "designation", "description"]}
                items={initialItems}
                searchKeys={["code", "designation"]}
                CreateForm={CreateProvinceForm}
                UpdateForm={UpdateProvinceForm}
                DeleteForm={DeleteProvinceForm}
            />
        </div>
    );
};

export default ProvincesPage;
