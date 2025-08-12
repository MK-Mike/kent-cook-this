"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Use next/navigation for client-side routing
import { Input } from "~/components/ui/input"; // Assuming this is also a client component

export function SearchBar({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    // Update URL param on change
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      newSearchParams.set("q", e.target.value);
    } else {
      newSearchParams.delete("q");
    }
    router.replace(`?${newSearchParams.toString()}`);
  };

  return (
    <Input
      type="text"
      placeholder="Search recipes..."
      value={query}
      onChange={handleSearchChange}
      className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
    />
  );
}
