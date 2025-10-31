import BgGradient from "../common/bg-gradient";

// components/upload/loading.tsx
export default function LoadingSkeletonUpload() {
  return <main className="min-w-screen relative">
  <section className="min-h-screen relative">
      <BgGradient />

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        {/* UploadHeader Skeleton */}
        <div className="w-full justify-items-center flex flex-col gap-4">
          {/* Badge skeleton */}
          <div className="flex pb-4">
            <div className="relative p-[1px] rounded-full w-full max-w-xs overflow-hidden">
              <div className="h-12 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Main heading skeleton */}
          <div className="font-bold text-3xl py-6 text-center">
            <div className="h-10 w-64 mx-auto bg-gray-200 rounded-md animate-pulse" />
          </div>

          {/* Subtitle skeleton */}
          <div className="flex gap-2 items-center justify-center">
            <div className="h-5 w-72 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse" />
          </div>

          {/* Upload form placeholder heading */}
          <div className="pt-6">
            <div className="h-5 w-40 mx-auto bg-gray-200 rounded-md animate-pulse" />
          </div>
        </div>

        {/* UploadForm Skeleton */}
        <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto my-5">
          {/* Show multiple skeleton input blocks to mimic form fields */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 w-full bg-gray-200 rounded-md animate-pulse" />
          ))}
          <div className="h-12 w-32 bg-gray-200 rounded-md mx-auto animate-pulse" />
        </div>
      </div>
    </section>
    </main> 
}
