import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function PageContainer({ children, fluid }: { children: ReactNode; fluid?: boolean }) {
  return (
    <div
      className={
        fluid ? "h-full w-full" : "mx-auto w-full max-w-[1500px] px-6 py-6 md:px-8 lg:py-8"
      }
    >
      {children}
    </div>
  );
}
