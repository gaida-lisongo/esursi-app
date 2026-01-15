import CrudManager from "@/components/common/CrudManager";

const ProvincesPage = () => {
    return (
        <div>
            <CrudManager
                title="Provinces"
                header={[
                    "Code",
                    "Designation",
                    "Description",
                ]}
                items={[]}
                showComponent={<></>}
                updateComponent={<></>}
                deleteComponent={<></>}
            />
        </div>
    );
};

export default ProvincesPage;