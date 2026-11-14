import { Group, Select, TextInput } from "@mantine/core";

export interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchLabel?: string;
  status?: {
    label: string;
    value: string | null;
    options: readonly { value: string; label: string }[];
    onChange: (value: string | null) => void;
  };
}

/**
 * Filter convention: controlled inputs whose values become part of the
 * TanStack Query key (and, later, the URL search params) for list screens.
 */
export function FilterBar({
  search,
  onSearchChange,
  searchLabel = "Search",
  status,
}: FilterBarProps) {
  return (
    <Group gap="sm" align="flex-end" wrap="wrap" role="search">
      <TextInput
        label={searchLabel}
        placeholder="Search…"
        value={search}
        onChange={(event) => onSearchChange(event.currentTarget.value)}
        w={{ base: "100%", sm: 280 }}
      />
      {status ? (
        <Select
          label={status.label}
          data={status.options.map((option) => ({ ...option }))}
          value={status.value}
          onChange={status.onChange}
          clearable
          placeholder="Any"
          w={{ base: "100%", sm: 200 }}
        />
      ) : null}
    </Group>
  );
}
