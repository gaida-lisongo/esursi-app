import CrudManager from "@/components/common/CrudManager";
import { getGrades } from "@/lib/actions/personnels/grade/getGrades";
import {
    CreateGradeForm,
    UpdateGradeForm,
    DeleteGradeForm,
} from "@/components/personnels/grade";
import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export const metadata: Metadata = {
    title: "Grades | ESURSI-APP",
    description: "Gestion des grades",
};

type GradeItem = {
    id: string;
    code: string;
    designation: string;
    personnel: "PAS" | "PATO";
};

const GradesPage = async () => {
    const gradesData = await getGrades();
    const initialItems: GradeItem[] = gradesData.success ? gradesData.data : [];

    return (
        <div>
            <PageBreadcrumb pageTitle="Grades" />
            <CrudManager
                title="Grades"
                header={["code", "designation", "personnel"]}
                items={initialItems}
                searchKeys={["code", "designation"]}
                CreateForm={CreateGradeForm}
                UpdateForm={UpdateGradeForm}
                DeleteForm={DeleteGradeForm}
            />
        </div>
    );
};

export default GradesPage;
