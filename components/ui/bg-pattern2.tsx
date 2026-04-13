export default function BGGrid2() {
  return (
    <div className="min-h-screen w-full bg-white fixed inset-0 z-[-1] pointer-events-none">
      {/* White Grid with Dots Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px),
        radial-gradient(circle, rgba(51,65,85,0.08) 1px, transparent 1px)
      `,
          backgroundSize: "30px 30px, 30px 30px, 30px 30px",
          backgroundPosition: "0 0, 0 0, 0 0",
        }}
      />
      {/* Your Content/Components */}
    </div>
  );
}
