import FinanceDashboard, { Parcours } from "@/components/etablissement/Dashboard";
import { DownloadIcon, GroupIcon, LockIcon } from "@/icons";
import { getBudgetsByAnneeEtab, getFraisByAnnee, getParcoursByAnneeEtab, getTransactionsByFrais } from "@/lib/actions/finance/fraisActions";
import { Annee, Etablissement } from "@/lib/models";

const EtabPage = async ({ etabId, anneeId, role }: { etabId: string, anneeId: string, role: string }) => {

    try {
        const annee = await Annee.findById(anneeId);
        const rawEtab = await Etablissement.findById(etabId)
            .populate("province")
            .populate("coge.agent")
            .populate("rapports.annee")
            .lean();

        const etab = JSON.parse(JSON.stringify(rawEtab));

        const transaction: { _id: any; annee: string; actif: boolean; data: any[] } = {
            _id: annee?._id?.toString(),
            annee: annee?.debut + " - " + annee?.fin,
            actif: annee?.actif || false,
            data: [],
        };

        const [respP, resB] = await Promise.all([
            getParcoursByAnneeEtab(anneeId, etabId),
            getBudgetsByAnneeEtab(anneeId, etabId),
        ]);

        const parcours = respP.data;
        const budget = resB.data;

        const reqFrais = await getFraisByAnnee(anneeId);
        if (reqFrais.success && reqFrais.data?.length > 0) {
            const allTransactions = await Promise.all(
                reqFrais.data.map((f: any) => getTransactionsByFrais(f._id))
            );
            allTransactions.forEach((res) => {
                if (res.success && res.data) {
                    transaction.data.push(...res.data);
                }
            });
        }

        if (transaction?._id) {
            const paiementsOk = transaction.data.filter((t: any) => t.status === "OK");
            const paiementsNo = transaction.data.filter((t: any) => t.status === "NO");
            const paiementsPending = transaction.data.filter((t: any) => t.status === "PENDING");

            const stats: any[] = [
                {
                    icon: <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />,
                    title: "Paiements collectés",
                    value: paiementsOk.reduce((total: number, item: any) => total + item.montant, 0),
                    proportion: paiementsOk.length / (paiementsOk.length + paiementsPending.length + paiementsNo.length) || 0,
                    annee: transaction.annee,
                    status: "up",
                },
                {
                    icon: <DownloadIcon className="text-gray-800 size-6 dark:text-white/90" />,
                    title: "Paiements encours",
                    value: paiementsPending.reduce((total: number, item: any) => total + item.montant, 0),
                    proportion: paiementsPending.length / (paiementsOk.length + paiementsPending.length + paiementsNo.length) || 0,
                    annee: transaction.annee,
                    status: "down",
                },
                {
                    icon: <LockIcon className="text-gray-800 size-6 dark:text-white/90" />,
                    title: "Paiements non collectés",
                    value: paiementsNo.reduce((total: number, item: any) => total + item.montant, 0),
                    proportion: paiementsNo.length / (paiementsOk.length + paiementsPending.length + paiementsNo.length) || 0,
                    annee: transaction.annee,
                    status: "down",
                },
            ];

            return (
                <FinanceDashboard
                    isLoading={false}
                    metriques={stats}
                    parcours={parcours as Parcours[]}
                    budget={budget}
                    transactions={[transaction]}
                    action={role}
                    rapports={etab?.rapports || []}
                    anneeId={anneeId}
                    etabId={etabId}
                    programmes={etab?.programmes || []}
                />
            )
        }
        return (
            <div>
                <h1>Role {role}</h1>
                <p>Etab ID: {etabId}</p>
                <p>Annee ID: {anneeId}</p>
            </div>
        );
    } catch (error) {
        console.error(error);
        return (
            <div>
                <h1>Role {role}</h1>
                <p>Etab ID: {etabId}</p>
                <p>Annee ID: {anneeId}</p>
            </div>
        );

    }
};

export default EtabPage;
