import { Metadata } from "next";

const metadata: Metadata = {
    title: "ESURSI - Coge",
    description: "ESURSI - Coge",
};
const CogeLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            {children}
        </div>
    );
};

export default CogeLayout;