import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Reporting Financier | Province Dashboard",
    description: "Système de reporting financier par province et établissement.",
};

export default function ReportingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
