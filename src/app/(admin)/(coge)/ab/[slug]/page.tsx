import EtabPage from "@/components/coge/EtabPage";

const AbPage = async (props: Promise<{ params: { slug: string } }>) => {
    const { params } = await props;

    const { slug } = await params;

    const [etabId, anneeId] = slug.split("-");

    return <EtabPage etabId={etabId} anneeId={anneeId} role={"AB"} />;

};

export default AbPage;