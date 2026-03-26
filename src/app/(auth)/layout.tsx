import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-full">
      {/* Left side — branding */}
      <div className="hidden w-1/2 flex-col justify-between bg-foreground p-12 text-white lg:flex">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-pink-500">
            <span className="text-sm font-bold text-white">M</span>
          </div>
          <span className="text-lg font-bold">MultiMart</span>
        </Link>

        <div>
          <blockquote className="text-lg leading-relaxed text-gray-300">
            &ldquo;MultiMart helped me launch my digital product store in
            minutes. I went from idea to first sale in the same day.&rdquo;
          </blockquote>
          <div className="mt-4">
            <p className="font-medium">Sarah Chen</p>
            <p className="text-sm text-gray-500">
              Design template creator
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-600">
          &copy; {new Date().getFullYear()} MultiMart
        </p>
      </div>

      {/* Right side — form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
