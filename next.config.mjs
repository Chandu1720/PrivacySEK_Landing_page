/** Static export: every route is pre-rendered to HTML in /out. */
const nextConfig = {
  ...(process.env.NODE_ENV === "production" ? { output: "export" } : {}),
  trailingSlash: false,
  images: { unoptimized: true },
};
export default nextConfig;
