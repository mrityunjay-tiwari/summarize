import BgGradient from "@/components/common/bg-gradient";
import UploadForm from "@/components/upload/uploadform";
import UploadHeader from "@/components/upload/uploadheader";

export default function UploadPage() {
    return (
        <section className="min-h-screen">
            <BgGradient />
            <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                <UploadHeader />
                <UploadForm />
            </div>
        </section>
    )
}