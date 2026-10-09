import type { NextConfig } from 'next';
// Static export (like lalibela): `out/` is uploaded to a PHP host so public/contact.php can run.
// Response headers live in public/.htaccess since `headers()` does not apply to exports.
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  poweredByHeader: false,
  images: { unoptimized: true },
};
export default nextConfig;
