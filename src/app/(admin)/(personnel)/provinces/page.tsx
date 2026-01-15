import CrudManager from "@/components/common/CrudManager";
import { getProvinces } from "@/lib/actions/personnels/grade/getProvinces";
import { CreateProvinceForm, UpdateProvinceForm, DeleteProvinceForm } from "@/components/personnels/province/ProvinceForms";

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

    console.log("Data fetched", initialItems);

    return (
        <div>
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
