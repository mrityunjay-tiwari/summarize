export default function PDFPageSkeleton() {
  return (
    <div className="h-screen w-full bg-black text-white flex flex-col">

      {/* 🔝 TOP BAR */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-neutral-800">
        
        {/* Left (Logo / PDF icon) */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-neutral-800 animate-pulse" />
          <div className="w-20 h-4 bg-neutral-800 rounded animate-pulse" />
        </div>

        {/* Right (Upload + Theme) */}
        <div className="flex items-center gap-3">
          <div className="w-28 h-9 rounded-lg bg-neutral-800 animate-pulse" />
          <div className="w-9 h-9 rounded-full bg-neutral-800 animate-pulse" />
        </div>
      </div>

      {/* 🔻 MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">

        {/* 📌 LEFT SIDEBAR */}
        <div className="w-14 flex flex-col items-center py-4 gap-5 border-r border-neutral-800">
          <div className="w-10 h-10 rounded-xl bg-neutral-800 animate-pulse" />
          <div className="w-8 h-8 rounded bg-neutral-800 animate-pulse" />
          <div className="w-8 h-8 rounded bg-neutral-800 animate-pulse" />
          <div className="w-8 h-8 rounded bg-neutral-800 animate-pulse" />
        </div>

        {/* 📄 PDF SECTION (35%) */}
        <div className="w-[35%] p-4 flex flex-col gap-3">
          
          {/* PDF Toolbar */}
          <div className="h-11 rounded-md bg-neutral-800 animate-pulse" />

          {/* PDF Page */}
          <div className="flex-1 rounded-md bg-neutral-900 animate-pulse" />
        </div>

        {/* 💬 RIGHT PANEL (50%) */}
        <div className="w-[50%] border-l border-neutral-800 flex flex-col">

          {/* Tabs Container (single rectangle) */}
          <div className="p-3">
            <div className="h-11 w-full rounded-lg bg-neutral-800 animate-pulse" />
          </div>

          {/* Chat Area */}
          <div className="flex-1 px-6 py-4 space-y-5 overflow-hidden">

            {/* Left message */}
            {/* <div className="space-y-2">
              <div className="w-2/3 h-4 bg-neutral-800 rounded animate-pulse" />
              <div className="w-1/2 h-4 bg-neutral-800 rounded animate-pulse" />
            </div> */}

            {/* Right message */}
            {/* <div className="space-y-2 flex flex-col items-end">
              <div className="w-1/2 h-4 bg-neutral-700 rounded animate-pulse" />
            </div> */}

            {/* Another left */}
            <div className="space-y-2">
              <div className="w-3/4 h-4 bg-neutral-800 rounded animate-pulse" />
              <div className="w-1/3 h-4 bg-neutral-800 rounded animate-pulse" />
            </div>
          </div>

          {/* Input Box */}
          <div className="p-4">
            <div className="h-14 w-full rounded-xl bg-neutral-800 animate-pulse" />
          </div>
        </div>

      </div>
    </div>
  );
}