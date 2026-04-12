import Footer from "@/components/home/footer";
import Hero from "@/components/home/hero";
import BGGrid from "@/components/ui/bg-pattern";

export default function Home() {
  return (
    <div className="flex flex-col">
      <BGGrid />
      <div className="mt-16">
        <Hero />
      </div>
      <Footer />
    </div>
  );
}
