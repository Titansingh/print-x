import { Paper, ScrollArea, Table } from "@mantine/core";
import type { ReactNode } from "react";

import { EmptyView, ErrorView, LoadingView } from "./DataStates";

export interface DataTableColumn<Row> {
  key: string;
  header: string;
  render: (row: Row) => ReactNode;
  /** Right-align numeric columns. */
  numeric?: boolean;
}

export interface DataTableProps<Row> {
  /** Accessible table caption. */
  caption: string;
  columns: readonly DataTableColumn<Row>[];
  rows: readonly Row[] | undefined;
  getRowKey: (row: Row) => string;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  empty?: { title: string; description?: string };
}

/**
 * Table convention for admin and partner list screens: one component handles loading,
 * error and empty states so every queue/list behaves the same way.
 * Server-side pagination/sorting params should flow through TanStack Query keys.
 */
export function DataTable<Row>({
  caption,
  columns,
  rows,
  getRowKey,
  isLoading,
  error,
  onRetry,
  empty = { title: "Nothing here yet" },
}: DataTableProps<Row>) {
  if (isLoading) return <LoadingView label={`Loading ${caption.toLowerCase()}`} />;
  if (error) return <ErrorView message={error.message} onRetry={onRetry} />;
  if (!rows || rows.length === 0) return <EmptyView {...empty} />;

  return (
    <Paper withBorder radius="md">
      <ScrollArea>
        <Table striped highlightOnHover verticalSpacing="sm" captionSide="top">
          <Table.Caption>{caption}</Table.Caption>
          <Table.Thead>
            <Table.Tr>
              {columns.map((column) => (
                <Table.Th key={column.key} ta={column.numeric ? "right" : undefined} scope="col">
                  {column.header}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((row) => (
              <Table.Tr key={getRowKey(row)}>
                {columns.map((column) => (
                  <Table.Td key={column.key} ta={column.numeric ? "right" : undefined}>
                    {column.render(row)}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
}
