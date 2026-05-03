import { Link } from "react-router";

export default function PageShell({
  children,
  back,
}: {
  children: React.ReactNode;
  back?: { label: string; to: string };
}) {
  return (
    <div className="min-h-screen bg-[#02102D] text-[#F4F5F7]">
      <header className="sticky top-0 z-10 bg-[#02102D] border-b border-[#1A2D5A]">
        <div className="max-w-[680px] mx-auto px-5 h-14 flex items-center gap-4">
          <Link
            to="/"
            className="font-mono text-[11px] text-[#7FA8FF] bg-[rgba(3,87,238,0.14)] border border-[rgba(3,87,238,0.45)] px-2.5 py-1 rounded-md tracking-[0.08em]"
          >
            DREAM VOTE
          </Link>
          {back && (
            <>
              <span className="text-[#6B7A9E] text-sm">/</span>
              <Link
                to={back.to}
                className="text-sm text-[#9BA9C7] hover:text-[#F4F5F7] transition"
              >
                ‹ {back.label}
              </Link>
            </>
          )}
        </div>
      </header>
      {children}
    </div>
  );
}
