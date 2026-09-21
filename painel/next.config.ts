import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['pg'],
  // Gera .next/standalone: o Dockerfile copia só o servidor e as dependências que ele usa.
  output: 'standalone',
};

export default nextConfig;
