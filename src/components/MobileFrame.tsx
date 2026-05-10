import { ReactNode } from "react";

export function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {children}
    </div>
  );
}