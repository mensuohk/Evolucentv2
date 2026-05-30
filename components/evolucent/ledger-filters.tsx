"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { GHANA_REGIONS } from "@/lib/ghana-regions";

export function LedgerFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [region, setRegion] = useState(searchParams.get("region") ?? "");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (debouncedQuery) {
      params.set("q", debouncedQuery);
    } else {
      params.delete("q");
    }

    if (region) {
      params.set("region", region);
    } else {
      params.delete("region");
    }

    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  }, [debouncedQuery, region, router, searchParams]);

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-md">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="size-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Search by project, citizen name, or ref..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full rounded-full border border-black/10 bg-white py-2.5 pl-10 pr-10 text-sm placeholder:text-muted-foreground focus:border-evolucent-black focus:outline-none focus:ring-1 focus:ring-evolucent-black shadow-sm transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-evolucent-black"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="relative shrink-0">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Filter className="size-4 text-muted-foreground" />
        </div>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="block w-full appearance-none rounded-full border border-black/10 bg-white py-2.5 pl-10 pr-10 text-sm focus:border-evolucent-black focus:outline-none focus:ring-1 focus:ring-evolucent-black shadow-sm transition-all sm:w-auto min-w-[200px]"
        >
          <option value="">All Regions</option>
          {GHANA_REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
