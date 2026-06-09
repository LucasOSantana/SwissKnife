export const EMAIL_TONE_OPTIONS = ["professional", "casual", "urgent"] as const;

export const EMAIL_TEMPLATES = {
  professional: `Subject: Regarding {{subject}}

Dear Team,

I hope this email finds you well.

I am writing to formally bring your attention to {{subjectLower}}. Please review the attached details and let me know your thoughts or availability for a brief discussion regarding this matter.

Thank you for your time and cooperation.

Best regards,
[Your Name]`,
  casual: `Subject: Quick update on {{subject}}

Hey everyone,

Hope you're having a great week!

Just wanted to reach out and loop you in regarding {{subjectLower}}. Let me know what you think when you get a chance so we can sync up on this.

Cheers,
[Your Name]`,
  urgent: `Subject: URGENT: {{subject}}

Hello,

Please read this immediately.

We need to address the situation regarding {{subjectLower}} as soon as possible. Kindly review this and take action or reply with your immediate availability today.

Thank you for your prompt response.

Sincerely,
[Your Name]`,
} as const;

export const PASSWORD_CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+~}{[]:;?><,./-=",
} as const;

export const PASSWORD_OPTION_ITEMS = [
  { key: "uppercase", label: "Uppercase" },
  { key: "lowercase", label: "Lowercase" },
  { key: "numbers", label: "Numbers" },
  { key: "symbols", label: "Symbols" },
] as const;

export const LOREM_PARAGRAPHS = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin id sem ac sem pretium congue eget non justo. Vestibulum sit amet ex lorem. Morbi iaculis leo id purus pellentesque, sed fringilla risus porta. Aliquam elementum pretium elementum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
  "Ut feugiat mauris ac leo aliquet pellentesque. Maecenas scelerisque tristique hendrerit. Phasellus mattis feugiat sapien, id efficitur mauris convallis id. Cras ultrices lorem ac nulla eleifend, in vulputate mi vehicula. Etiam non sem nec ante molestie finibus sed vel orci. In rhoncus erat ut lacinia feugiat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Vivamus ac magna vel tortor tristique porttitor id a libero.",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
  "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? Fusce tincidunt, ligula in vestibulum vehicula, massa turpis luctus purus, non varius augue ex ut velit.",
  "Curabitur sodales feugiat sem. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris efficitur est dictum, convallis libero vel, pellentesque diam. Proin vel nisl a sapien luctus efficitur. In porta, est eget bibendum convallis, lectus ex dictum lorem.",
  "Nulla facilisi. Cras at lectus at nibh tincidunt sollicitudin ac nec eros. Integer iaculis ante ut feugiat lobortis. Vestibulum cursus eleifend erat, eget mollis ex hendrerit vel. Integer venenatis tempus mi, nec elementum diam sodales sit amet. Cras dictum tincidunt nisl eget interdum.",
] as const;
