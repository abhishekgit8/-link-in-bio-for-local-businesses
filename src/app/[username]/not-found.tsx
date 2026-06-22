export default function UsernameNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-serif text-3xl tracking-[-0.02em] mb-2">Page not found</h1>
        <p className="text-sm text-gray-500 mb-8">
          This business page doesn&apos;t exist yet.
        </p>
        <a href="/" className="text-sm font-medium underline">
          Create your own page
        </a>
      </div>
    </div>
  );
}
