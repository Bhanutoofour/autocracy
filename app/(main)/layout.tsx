import GlobalHeader from "@/app/_components/GlobalHeader";
import UniversalFooter from "@/app/_components/UniversalFooter";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GlobalHeader />
      <main className="w-full">{children}</main>
      <UniversalFooter />
    </>
  );
}
