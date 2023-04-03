import type { Config } from "tailwindcss";

import baseConfig from "@chuckl/tailwind-config";

export default {
  content: ["./src/**/*.tsx"],
  presets: [baseConfig],
} satisfies Config;
