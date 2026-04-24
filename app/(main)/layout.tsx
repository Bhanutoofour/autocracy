import Footer from "@/component/Footer/Footer";
import GlobalHeader from "@/app/_components/GlobalHeader";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GlobalHeader />
      <main className="w-full">{children}</main>
      <Footer />
    </>
  );
}
