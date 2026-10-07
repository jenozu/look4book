import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Look4Book",
    short_name: "Look4Book",
    description: "Scan thrift-store books and estimate whether they are worth reselling.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFD8E8",
    theme_color: "#FFD8E8",
    orientation: "portrait",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
