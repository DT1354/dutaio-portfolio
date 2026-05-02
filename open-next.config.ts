import type { Config } from "open-next/config";

const config: Config = {
  default: {
    override: {
      cacheKeySuffix: "",
      minifyStaticFiles: true,
    },
  },
};

export default config;
