import { Navbar } from "../sections/Navbar";
import { Footer } from "../sections/Footer";

export function SolutionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
