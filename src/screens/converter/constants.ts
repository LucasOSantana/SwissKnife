export const CASE_MODE_OPTIONS = [
  { key: "camel", label: "camelCase", desc: "Lower camel case" },
  { key: "snake", label: "snake_case", desc: "Words with underscores" },
  { key: "pascal", label: "PascalCase", desc: "Capitalized camel case" },
  { key: "kebab", label: "kebab-case", desc: "Words with hyphens" },
  { key: "upper", label: "UPPERCASE", desc: "All caps string" },
  { key: "lower", label: "lowercase", desc: "All small letters" },
  { key: "reverse", label: "Invert String", desc: "Reverse text character order" },
] as const;

export const NUMBER_BASE_OPTIONS = [
  { value: 2, label: "Binary (2)" },
  { value: 8, label: "Octal (8)" },
  { value: 10, label: "Decimal (10)" },
  { value: 16, label: "Hexadecimal (16)" },
] as const;

export const COLOR_FORMAT_OPTIONS = [
  { value: "hex", label: "HEX" },
  { value: "rgb", label: "RGB" },
  { value: "hsl", label: "HSL" },
] as const;

export const JSON_YAML_MODE_OPTIONS = [
  { key: "json-to-yaml", label: "JSON to YAML", desc: "Convert JSON string to YAML" },
  { key: "yaml-to-json", label: "YAML to JSON", desc: "Convert YAML string to JSON" },
] as const;

export const DATE_MODE_OPTIONS = [
  { key: "date-to-unix", label: "Date to Unix", desc: "Convert Date/Time to Unix Epoch" },
  { key: "unix-to-date", label: "Unix to Date", desc: "Convert Unix Epoch to Date/Time" },
] as const;

