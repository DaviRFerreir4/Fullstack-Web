# Estudos sobre SQL básico

## Criando uma tabela

CREATE TABLE products (
id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
price REAL NOT NULL,
category TEXT NULL DEFAULT 'general'
)

## Adicionando e removendo uma coluna

ALTER TABLE products ADD quantity INTEGER NOT NULL
ALTER TABLE products DROP COLUMN quantity

## Renomeando uma coluna

ALTER TABLE products RENAME COLUMN name TO description

## Renomeando uma tabela

ALTER TABLE products RENAME TO items

## Removendo uma tabela

DROP TABLE products

## Inserindo e selecionando dados de uma tabela

INSERT INTO products (name, price) VALUES ('Mouse', 50)
INSERT INTO products (name, price, category) VALUES ('Teclado', 500.50, 'accessory')
SELECT \* FROM products

## Visualizando dados de uma tabela

-- Recupera a tabela toda
SELECT \* FROM products
-- Recuperando colunas específicas
SELECT name, price FROM products
-- Ordem declarada define a ordem de exibição
SELECT price, name FROM products

## Atualizando dados da tabela

UPDATE products SET price = 45.9, category = 'accessory'
UPDATE products SET price = 45.9, category = 'accessory' WHERE id = 1
UPDATE products SET category = 'general' WHERE id = 2

## Removendo registros da tabela

INSERT INTO products (name, price, category) VALUES ('Microfone', 550, 'audio'), ('Webcam', 1200, 'video'), ('Headseat', 800, 'audio')
DELETE FROM products WHERE id = 3
INSERT INTO products (name, price, category) VALUES ('Microfone', 550, 'audio')
