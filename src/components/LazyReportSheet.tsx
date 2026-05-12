import { lazy, Suspense } from "react";
import type { ComponentProps } from "react";
import type { ReportSheet as ReportSheetType } from "@/components/ReportSheet";

const ReportSheetLazy = lazy(() =>
  import("@/components/ReportSheet").then((m) => ({ default: m.ReportSheet })),
);

type Props = ComponentProps<typeof ReportSheetType>;

export function LazyReportSheet(props: Props) {
  return (
    <Suspense fallback={null}>
      <ReportSheetLazy {...props} />
    </Suspense>
  );
}