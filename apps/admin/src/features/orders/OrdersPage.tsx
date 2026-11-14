import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { DataTable, FilterBar, PageLayout, type DataTableColumn } from "@platform/ui-admin";

/** Frontend row view model; map from generated API types once available. */
interface OrderRow {
  id: string;
  customer: string;
  status: string;
}

const columns: readonly DataTableColumn<OrderRow>[] = [
  { key: "id", header: "Order", render: (row) => row.id },
  { key: "customer", header: "Customer", render: (row) => row.customer },
  { key: "status", header: "Status", render: (row) => row.status },
];

// Display filter options only; actual order states are defined by the backend.
const statusOptions = [
  { value: "open", label: "Open" },
  { value: "in_production", label: "In production" },
  { value: "completed", label: "Completed" },
] as const;

/**
 * Representative list screen demonstrating the table/filter conventions.
 * INTEGRATION BOUNDARY: the orders API is not published yet, so the query
 * resolves to no rows. Replace `queryFn` with an `apiClient` call.
 */
export function OrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["admin", "orders", { search, status }],
    queryFn: async (): Promise<OrderRow[]> => [],
  });

  return (
    <PageLayout title="Orders" description="Review, assign and track customer orders.">
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchLabel="Search orders"
        status={{ label: "Status", value: status, options: statusOptions, onChange: setStatus }}
      />
      <DataTable
        caption="Orders"
        columns={columns}
        rows={query.data}
        getRowKey={(row) => row.id}
        isLoading={query.isPending}
        error={query.error}
        onRetry={() => void query.refetch()}
        empty={{
          title: "No orders to show",
          description: "Orders appear here once the orders API is connected.",
        }}
      />
    </PageLayout>
  );
}
