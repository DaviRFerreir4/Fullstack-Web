# Comandos do Docker

## Comando para listar containers

docker ps -> mostra containers em execução
docker ps -a -> mostra todos os containers

## Comando para listar imagens baixadas e disponíveis

docker image ls -> mostra imagens

## Comando para criar uma imagem a partir de um dockerfile

docker build -t image_name . -> Cria uma imagem baseado no 'Dockerfile' do diretório
docker build -t image_name -f docker_file -> Cria uma imagem baseada em um arquivo qualquer do diretório

## Comando para executar uma imagem como um container

docker run -p docker_port:host_port image_name | image_id -> cria um container baseado no none ou id da imagem
docker run -p docker_port:host_port -d image_name -> cria um container sem bloquear o terminal (-d = detach)

## Visualizando logs de um container e o histórico de uma imagem

docker logs container_id -> mostra os logs de um container em execução
docker history image_name -> mostra o histórico relacionado ao imagem em específico

## Status de containers

docker pause container_id -> pausa a execução de um container
docker unpause container_id -> retoma a execução de um container pausado
docker stop container_id -> para completamente a execução de um container
docker start container_id -> retoma a execução de um container que foi parado

## Removendo containers e imagens

docker rm container_id -> remove um container fora de execução
docker rm -f container_id -> força a remoção de um container mesmo que em execução
docker rmi image_name | image_id -> remove uma imagem

## Versionando imagens

docker build -t image_name:version . -> cria uma imagem com uma tag de versionamento. Criar outra imagem com o mesmo nome e outra tag de versionamento deveria criar outra imagem com o mesmo id e outra tag, mas por algum motivo isso não funciona. Para isso, usar o próximo comando
docker tag image_id image_name:version -> duplica uma imagem com outro nome e outra tag de versionamento (é meio inutil para versionamento, porque o dockerfile continuará o mesmo)

## Entrando no diretório de trabalho de um container

docker exec -it container_id sh -> Entra no diretório de trabalho do container especificado
exit -> Sai do diretório de trabalho do container

## Criando volumes que perduram dados

docker container inspect container_id -> Mostra diversas informações sobre o container
docker volume create volume_name -> Cria um novo volume para uso (só possui nome, não id)
docker volume inspect volume_name -> Mostra as informações do volume
docker run -v volume_name:work_directory -p docker_port:host_port -d image_name -> Cria um container que utiliza um volume criado no diretório de trabalho passado para ele. A partir disso, novos dados serão salvos no volume e outros containers que utilizarem o volume terão acesso a esses dados

## Removendo volumes

docker volume ls -> Lista os volumes disponíveis
docker container prune -> Remove todos os containers disponíveis
docker volume rm volume_name -> Remove o volume caso não haja containers dependentes dele

## Criando containers com imagens remotas de banco de dados

docker run --name container_name -e enviroment_var=value (ex: POSTGRES_USER e POSTGRES_PASSWORD) -e enviroment_var=value -p docker_port:host_port -d remote_image -> Cria um container (como um banco de dados, onde é necessário passar varíaveis de ambiente) baseado numa imagem remota (a qual é puxada para a máquina e fica disponível localmente após a operação)l