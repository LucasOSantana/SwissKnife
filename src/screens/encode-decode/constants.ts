export const URL_MODE_OPTIONS = [
  { key: "encode", label: "Encode", desc: "Percent-encode special characters" },
  { key: "decode", label: "Decode", desc: "Convert %xx back to human-readable" },
] as const;

export const HEX_MODE_OPTIONS = [
  { key: "encode", label: "Text to Hex", desc: "Convert plain text to hexadecimal string" },
  { key: "decode", label: "Hex to Text", desc: "Convert hexadecimal string back to plain text" }
] as const;

export const JWT_DEFAULT_PAYLOAD = JSON.stringify(
  { sub: "1234567890", name: "John Doe", iat: 1516239022 },
  null,
  2
);

export const JWT_DEFAULT_SECRET = "your-256-bit-secret";
