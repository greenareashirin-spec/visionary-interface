import { Info } from "lucide-react";
import { useErpData } from "@/lib/erp-store";

export function ErpEmptyBanner() {
  const { data } = useErpData();
  if (data) return null;
  return (
    <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-400/20 px-3 py-1.5 text-[11px] text-amber-200/90">
      <Info className="h-3.5 w-3.5 shrink-0" />
      <span className="min-w-0">
        Showing sample data — upload your ERP file from the Command Center pill to see your real numbers.
      </span>
    </div>
  );
}
