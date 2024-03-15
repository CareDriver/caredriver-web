import Layout from "@/layouts/Layout";

export const metadata = {
    title: "Name of the application",
    description: "App...",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return <Layout>{children}</Layout>;
}
