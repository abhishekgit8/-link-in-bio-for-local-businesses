export function PageLoader() {
  return (
    <div className="animate-pulse space-y-4 p-6">
      <div className="h-8 w-48 bg-border rounded-lg" />
      <div className="h-4 w-72 bg-border rounded-md" />
      <div className="space-y-3 mt-8">
        <div className="h-24 bg-border rounded-2xl" />
        <div className="h-24 bg-border rounded-2xl" />
        <div className="h-24 bg-border rounded-2xl" />
      </div>
    </div>
  );
}
