import UploadForm from "@/components/upload/uploadform";
import BGGrid2 from "@/components/ui/bg-pattern2";

export default function UploadPage() {
  return (
    <section className="min-h-screen mx-auto max-w-7xl py-24 sm:py-32">
      <BGGrid2 />
      <UploadForm />
    </section>
  );
}
