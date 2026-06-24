export default function ProfileLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 bg-[#F7F6F2]">
      <div className="w-full max-w-md animate-pulse">
        {/* Cover skeleton */}
        <div className="w-full h-40 rounded-2xl bg-gray-200 mb-6" />

        {/* Avatar + name skeleton */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-4" />
          <div className="h-7 w-48 bg-gray-200 rounded-lg mx-auto mb-2" />
          <div className="h-4 w-32 bg-gray-200 rounded-lg mx-auto mb-2" />
          <div className="h-4 w-40 bg-gray-200 rounded-lg mx-auto" />
        </div>

        {/* Link buttons skeleton */}
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-14 rounded-xl bg-gray-200"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
