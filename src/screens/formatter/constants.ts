export const JSON_MODE_OPTIONS = [
  { key: "prettify", label: "Prettify JSON", desc: "Format with 2-space indentation" },
  { key: "minify", label: "Minify JSON", desc: "Compact JSON removing all whitespace" },

] as const;

export const XML_MODE_OPTIONS = [
  { key: "prettify", label: "Prettify XML", desc: "Format with proper indentation" },
  { key: "minify", label: "Minify XML", desc: "Compact XML removing spaces and line breaks" },
] as const;

export const SQL_MODE_OPTIONS = [
  { key: "prettify", label: "Prettify SQL", desc: "Format with proper indentation" },
  { key: "minify", label: "Minify SQL", desc: "Compact SQL removing spaces and line breaks" },
] as const;

export const SQL_DIALECT_OPTIONS = [
  { key: "sql", label: "Standard SQL" },
  { key: "mysql", label: "MySQL" },
  { key: "postgresql", label: "PostgreSQL" },
  { key: "sqlite", label: "SQLite" },
  { key: "mariadb", label: "MariaDB" },
  { key: "tsql", label: "T-SQL (SQL Server)" },
  { key: "plsql", label: "PL/SQL (Oracle)" },
] as const;