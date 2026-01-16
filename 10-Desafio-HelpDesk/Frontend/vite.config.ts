import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), svgr()],
  /*server: {
    // configurações importantes para docker utilizando volumes para desenvolvimento
    host: true,
    port: 5173,
    watch: {
      usePolling: true, // faz com que o o subsistema de linux no windows (docker) consiga verificar alterações nos arquivos do windows, coisa que ele não faz normalmente (usePolling aparentemente consome mais CPU. A melhor alternativa seria alterar os arquivos no próprio subsistema de linux, ou seja, o container do docker, isso pelo que eu entendi)
    },
  },*/
})
