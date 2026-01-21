import EtabPage from "@/components/coge/EtabPage";

const DgPage = async (props: Promise<{ params: { slug: string } }>) => {
    const { params } = await props;

    const { slug } = await params;

    const [etabId, anneeId, role] = slug.split("-");

    return <EtabPage etabId={etabId} anneeId={anneeId} role={role} />;

};

export default DgPage;