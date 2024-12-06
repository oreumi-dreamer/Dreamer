export function metadataMaker(
  title = "DREAMER",
  description = "당신의 꿈을 들려주세요!",
  currentUrl = ""
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  return {
    metadataBase: new URL(baseUrl),
    title: title,
    description: description,
    icons: {
      icon: [
        { url: "/metadata/favicon.ico" },
        {
          url: "/metadata/favicon-16x16.png",
          sizes: "16x16",
          type: "image/png",
        },
        {
          url: "/metadata/favicon-32x32.png",
          sizes: "32x32",
          type: "image/png",
        },
        {
          url: "/metadata/favicon-96x96.png",
          sizes: "96x96",
          type: "image/png",
        },
      ],
      apple: [
        {
          url: "/metadata/apple-icon-57x57.png",
          sizes: "57x57",
          type: "image/png",
        },
        {
          url: "/metadata/apple-icon-60x60.png",
          sizes: "60x60",
          type: "image/png",
        },
        {
          url: "/metadata/apple-icon-72x72.png",
          sizes: "72x72",
          type: "image/png",
        },
        {
          url: "/metadata/apple-icon-76x76.png",
          sizes: "76x76",
          type: "image/png",
        },
        {
          url: "/metadata/apple-icon-114x114.png",
          sizes: "114x114",
          type: "image/png",
        },
        {
          url: "/metadata/apple-icon-120x120.png",
          sizes: "120x120",
          type: "image/png",
        },
        {
          url: "/metadata/apple-icon-144x144.png",
          sizes: "144x144",
          type: "image/png",
        },
        {
          url: "/metadata/apple-icon-152x152.png",
          sizes: "152x152",
          type: "image/png",
        },
        {
          url: "/metadata/apple-icon-180x180.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
      other: [
        {
          rel: "icon",
          url: "/metadata/android-icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
      ],
    },
    manifest: "/metadata/manifest.json",
    openGraph: {
      type: "website",
      url: baseUrl,
      title: "DREAMER",
      description: description,
      images: [
        {
          url: "/metadata/og-image.png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "DREAMER",
      description: description,
      images: ["/metadata/og-image.png"],
    },
    other: {
      "msapplication-TileImage": "/metadata/ms-icon-144x144.png",
    },
  };
}
