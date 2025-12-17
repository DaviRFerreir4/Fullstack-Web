import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // configurações importantes para docker
    host: true,
    port: 5173,
    watch: {
      usePolling: true, // faz com que o o subsistema de linux no windows (docker) consiga verificar alterações nos arquivos do windows, coisa que ele não faz normalmente (usePolling aparentemente consome mais CPU. A melhor alternativa seria alterar os arquivos no próprio subsistema de linux, ou seja, o container do docker, isso pelo que eu entendi)
    },
  },
})
