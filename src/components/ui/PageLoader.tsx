export function PageLoader() {
  return (
    <div className="animate-pulse space-y-4 p-4 sm:p-6 lg:p-8">
      <div className="h-8 w-48 bg-black/10 rounded-lg" />
      <div className="h-4 w-72 bg-black/10 rounded-md" />
      <div className="space-y-3 mt-8">
        <div className="h-24 bg-black/5 border border-black/5 rounded-2xl" />
        <div className="h-24 bg-black/5 border border-black/5 rounded-2xl" />
        <div className="h-24 bg-black/5 border border-black/5 rounded-2xl" />
      </div>
    </div>
  );
}
