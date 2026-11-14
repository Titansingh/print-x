import type { ConfigContext, ExpoConfig } from "expo/config";

/**
 * One Expo project, two flavours: the customer app and the print partner app.
 * Select with APP_VARIANT=customer|partner (default: customer). The variant is
 * also exposed to the JS bundle as EXPO_PUBLIC_APP_VARIANT (see
 * src/services/config.ts). Static values live in app.json.
 *
 * The partner identifiers below are placeholders, like the customer ones in
 * app.json, until real store identifiers are chosen.
 */
const variants = {
  customer: {
    name: "Print x",
    slug: "print-x",
    scheme: "printx",
    iosBundleIdentifier: "com.example.printx",
    androidPackage: "com.example.printx",
  },
  partner: {
    name: "Print x Partner",
    slug: "print-x-partner",
    scheme: "printxpartner",
    iosBundleIdentifier: "com.example.printx.partner",
    androidPackage: "com.example.printx.partner",
  },
} as const;

type AppVariant = keyof typeof variants;

function resolveVariant(value: string | undefined): AppVariant {
  if (value === undefined || value === "") return "customer";
  if (value === "customer" || value === "partner") return value;
  throw new Error(`Unknown APP_VARIANT "${value}". Use "customer" or "partner".`);
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const variant = resolveVariant(process.env.APP_VARIANT);
  const v = variants[variant];

  return {
    ...config,
    name: v.name,
    slug: v.slug,
    scheme: v.scheme,
    ios: { ...config.ios, bundleIdentifier: v.iosBundleIdentifier },
    android: { ...config.android, package: v.androidPackage },
    extra: { ...config.extra, appVariant: variant },
  };
};
