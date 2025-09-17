# Estudos sobre parâmetros de consulta SQL

## Where com igual (=)

SELECT * FROM products WHERE category = 'audio'
SELECT * FROM products WHERE price = 1200
SELECT * FROM products WHERE price = 1500

## Where com LIKE

SELECT * FROM products WHERE name LIKE '%cam' -- % no começo procura no final do texto
SELECT * FROM products WHERE name LIKE 'web%' -- % no fim procura no começo do texto
SELECT * FROM products WHERE name LIKE '%bc%' -- % no começo e fim procura em qualquer parte do texto
SELECT * FROM products WHERE name LIKE '%e%'

## Filtrando valores

SELECT * FROM products WHERE price <> 800 -- Seleciona valores diferentes
SELECT * FROM products WHERE price > 500.50 -- Seleciona valores maiores que o desejado
SELECT * FROM products WHERE price < 800 -- Seleciona valores menores que o desejado
SELECT * FROM products WHERE price >= 500.50 -- Seleciona valores maiores ou iguais que o desejado
SELECT * FROM products WHERE price <= 800 -- Seleciona valores menores ou iguais que o desejado

## Operador AND e OR

SELECT * FROM products WHERE price > 500 AND price < 1000 AND category = 'audio'
SELECT * FROM products WHERE price > 500 OR price < 1000

## Utilizando AND e OR com parênteses (parênteses define a ordem de precedência das verificações dos filtros)

SELECT * FROM products WHERE price > 45 AND price < 1000 AND category = 'audio' OR category = 'video'
SELECT * FROM products WHERE (price > 45 AND price < 1000) AND (category = 'audio' OR category = 'video')

## Where com BETWEEN

SELECT * FROM products WHERE price >= 600 AND price <= 1200
SELECT * FROM products WHERE price BETWEEN 600 AND 1200 -- Tem o mesmo resultado

## Where com IN

SELECT * FROM products WHERE price IN (800, 550, 600) -- 600 não existe, logo não retorna nada além dos outros
SELECT * FROM products WHERE category IN ('video', 'audio')

## SELECT com ORDER BY

SELECT * FROM products ORDER BY price -- Padrão é ASC
SELECT * FROM products ORDER BY price ASC -- (Ascendente/Crescente)
SELECT * FROM products ORDER BY price DESC -- (Descendente/Decrescente)
SELECT * FROM products WHERE category = 'audio' ORDER BY price DESC
SELECT * FROM products ORDER BY name -- Ordenado por texto

## SELECT com LIMIT

SELECT * FROM products ORDER BY price DESC LIMIT 3

## SELECT com COUNT

SELECT COUNT(*) FROM products
SELECT COUNT(name) FROM products -- Retorna o mesmo resultado
SELECT COUNT(*) FROM products WHERE price >= 600

## SELECT com SUM

SELECT SUM(price) FROM products
SELECT SUM(price) FROM products WHERE category = 'audio'
SELECT SUM(name) FROM products -- Retorna 0 porque não consegue somar letras

## SELECT com AVG

SELECT AVG(price) FROM products
SELECT AVG(price) FROM products WHERE category = 'audio'

## SELECT usando Aliases

SELECT COUNT(*) AS total_de_produtos FROM products
SELECT COUNT(*) AS 'Total de produtos' FROM products
SELECT COUNT(*) AS [Total de produtos] FROM products
SELECT COUNT(*) Total FROM products
SELECT id AS product_code, name AS 'product name', price AS [product price] FROM products

## SELECT usando GROUP BY

SELECT category, COUNT(*) FROM products
SELECT category, COUNT(*) AS total
  FROM products
  WHERE price >= 500.50
  GROUP BY category
  ORDER BY total DESC