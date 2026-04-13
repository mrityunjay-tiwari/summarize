import Footer from "@/components/home/footer";
import Hero from "@/components/home/hero";
import { Navbar } from "@/components/navbar/nav";
import BGGrid from "@/components/ui/bg-pattern";
import { auth } from "@/utils/auth";

export default async function Home() {
  const user = await auth();
  return (
    <div className="flex flex-col">
      <Navbar user={user} />
      <BGGrid />
      <div className="mt-16">
        <Hero />
      </div>
      <Footer />
    </div>
  );
}
