# Gerenciamento de versões

## Como funciona uma versão

1.17.3

1 -> Major changes (Há mudanças significativas no pacote que podem afetar a funcionalidade do software ou causar problemas de compatibilidade com versões anteriores, conhecido como breaking changes)
17 -> Minor changes (Há mudanças menores. Novas funcionalidades são adicionadas de uma maneira compatível com versões anteriores)
3 -> Patch (Mudanças menores como correções de bugs ou pequenas melhorias que não afetam a compatibilidade com versões anteriores)

## Atualizando versões

Caso você possua uma dependência instalada e rode o comando "npm install package", o packet manager irá entender que você deseja atualizar as dependências baseado na sintaxe da versão no package.json (consultar o site https://semver.npmjs.com/ para mais informações)

## Verificando versões desatualizadas

O comando "npm outdated" lista os pacotes com versões desatualizadas, as versões atualizadas compativeis e a versão mais recente, além de dados como localização e qual projeto depende deles
O comando "npm out" é uma abreviação do comando "npm outdated"

## Atualizando pacotes individuais

Para atualizar um pacote para a última versão disponível, rode o comando "npm i package@latest". Caso você queira a última versão de uma major específica, rode "npm i package@latest-major" (ex: npm i express@latest-4)

## Checando atualizações e atualizando todos pacotes

O comando "npx npm-check-updates" lista os pacotes, as últimas versões disponíveis e a recomendação de atualizações (se é recomendado fazer a atualização para a latest ou não)
Esse mesmo comando com a flag -u atualiza todos os pacotes para a última versão (independente da recomendação dada)

## IMPORTANTE

Sempre que um pacote é atualizado, é importante rodar o comando "npm install" para que o package.lock.json seja atualizado e as atualizações sejam realmente aplicadas nos pacotes instalados

## Checando atualizações e atualizando pacotes interativamente

Para checar atualizações e escolher quais dependências você deseja atualizar, rode o comando "npx npm-check-updates" com as flags "--interactive --format group". Nessa interface que abrir, use os seguintes comandos:

seta pra cima/seta para baixo -> navega entre dependências
space -> seleciona ou deseleciona uma dependência
a -> seleciona ou deseleciona todas as dependências
enter -> faz o upgrade nas dependências selecionadas
