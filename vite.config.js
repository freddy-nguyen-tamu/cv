import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const majorNodeVersion = Number.parseInt(process.versions.node.split('.')[0], 10)

export default defineConfig(async () => {
  const plugins = [react()]

  if (majorNodeVersion >= 20) {
    const { cloudflare } = await import('@cloudflare/vite-plugin')
    plugins.push(cloudflare())
  }

  return {
    plugins,
    base: '/cv/',
  }
})
