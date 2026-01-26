"use client";

import { useEffect, useState } from "react";
import FinanceDashboard, { Parcours } from "@/components/etablissement/Dashboard";
import { DownloadIcon, GroupIcon, LockIcon } from "@/icons";
import { getBudgetsByAnneeEtab, getFraisByAnnee, getParcoursByAnneeEtab, getTransactionsByFrais } from "@/lib/actions/finance/fraisActions";
import { getAnneeById, getEtablissementById } from "@/lib/actions/finance/reportingActions";

const EtabPage = ({ etabId, anneeId, role }: { etabId: string, anneeId: string, role: string }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [etab, setEtab] = useState<any>(null);
    const [annee, setAnnee] = useState<any>(null);
    const [transaction, setTransaction] = useState<any>(null);
    const [parcours, setParcours] = useState<Parcours[]>([]);
    const [budget, setBudget] = useState<any>(null);
    const [metriques, setMetriques] = useState<any[]>([]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            // Charger les données de l'année et de l'établissement
            const [anneeRes, etabRes] = await Promise.all([
                getAnneeById(anneeId),
                getEtablissementById(etabId)
            ]);
            
            if (!anneeRes.success || !etabRes.success) {
                console.error("Erreur lors du chargement des données de base");
                return;
            }
            
            const anneeData = anneeRes.data;
            const etabData = etabRes.data;
            
            setAnnee(anneeData);
            setEtab(etabData);

            // Créer l'objet transaction
            const transactionData: { _id: any; annee: string; actif: boolean; data: any[] } = {
                _id: anneeData?._id?.toString(),
                annee: anneeData?.debut + " - " + anneeData?.fin,
                actif: anneeData?.actif || false,
                data: [],
            };

            // Charger parcours et budget en parallèle
            const [respP, resB] = await Promise.all([
                getParcoursByAnneeEtab(anneeId, etabId),
                getBudgetsByAnneeEtab(anneeId, etabId),
            ]);

            if (respP.success) setParcours(respP.data || []);
            if (resB.success) setBudget(resB.data);

            // Charger les transactions
            const reqFrais = await getFraisByAnnee(anneeId);
            if (reqFrais.success && reqFrais.data?.length > 0) {
                const allTransactions = await Promise.all(
                    reqFrais.data.map((f: any) => getTransactionsByFrais(f._id))
                );
                allTransactions.forEach((res) => {
                    if (res.success && res.data) {
                        transactionData.data.push(...res.data);
                    }
                });
            }
            
            setTransaction(transactionData);

            // Calculer les métriques
            if (transactionData?._id) {
                const paiementsOk = transactionData.data.filter((t: any) => t.status === "OK");
                const paiementsNo = transactionData.data.filter((t: any) => t.status === "NO");
                const paiementsPending = transactionData.data.filter((t: any) => t.status === "PENDING");

                const stats: any[] = [
                    {
                        icon: <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />,
                        title: "Paiements collectés",
                        value: paiementsOk.reduce((total: number, item: any) => total + item.montant, 0),
                        proportion: paiementsOk.length / (paiementsOk.length + paiementsPending.length + paiementsNo.length) || 0,
                        annee: transactionData.annee,
                        status: "up",
                    },
                    {
                        icon: <DownloadIcon className="text-gray-800 size-6 dark:text-white/90" />,
                        title: "Paiements encours",
                        value: paiementsPending.reduce((total: number, item: any) => total + item.montant, 0),
                        proportion: paiementsPending.length / (paiementsOk.length + paiementsPending.length + paiementsNo.length) || 0,
                        annee: transactionData.annee,
                        status: "down",
                    },
                    {
                        icon: <LockIcon className="text-gray-800 size-6 dark:text-white/90" />,
                        title: "Paiements non collectés",
                        value: paiementsNo.reduce((total: number, item: any) => total + item.montant, 0),
                        proportion: paiementsNo.length / (paiementsOk.length + paiementsPending.length + paiementsNo.length) || 0,
                        annee: transactionData.annee,
                        status: "down",
                    },
                ];
                setMetriques(stats);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des données:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fonction pour rafraîchir seulement les données budgétaires
    const refreshBudgetData = async () => {
        try {
            const resB = await getBudgetsByAnneeEtab(anneeId, etabId);
            if (resB.success) {
                setBudget(resB.data);
            }
        } catch (error) {
            console.error("Erreur lors du rafraîchissement du budget:", error);
        }
    };

    useEffect(() => {
        loadData();
    }, [etabId, anneeId]);
    if (!etab || !transaction) {
        return (
            <FinanceDashboard
                isLoading={true}
                metriques={[]}
                parcours={[]}
                budget={null}
                transactions={[]}
                action={role}
                rapports={[]}
                anneeId={anneeId}
                etabId={etabId}
                programmes={[]}
            />
        );
    }

    return (
        <FinanceDashboard
            isLoading={isLoading}
            metriques={metriques}
            parcours={parcours}
            budget={{ ...budget, onRefresh: refreshBudgetData }}
            transactions={[transaction]}
            action={role}
            rapports={etab?.rapports || []}
            anneeId={anneeId}
            etabId={etabId}
            programmes={etab?.programmes || []}
        />
    );
};

export default EtabPage;
