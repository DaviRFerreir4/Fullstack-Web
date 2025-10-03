# Estudos sobre relacionamentos em Banco de Dados

CREATE TABLE students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
)

INSERT INTO students (name) VALUES
  ('Rodrigo Mendes'),
  ('Rafael Ferreira'),
  ('Laura Bortoleto'),
  ('Lucas Amaral'),
  ('Gabriel Brito'),
  ('Leonardo Lima'),
  ('Ana Gomes'),
  ('Patrícia Rodrigues'),
  ('Vinicius Souza'),
  ('Maria Costa'),
  ('Juliano Oliveira')

CREATE TABLE courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
)

INSERT INTO courses (name) VALUES
  ('Git'),
  ('HTML'),
  ('CSS'),
  ('JavaScript'),
  ('TypeScript'),
  ('Node.js'),
  ('Express'),
  ('SQLite'),
  ('PostgreSQL'),
  ('React')

## Relacionamento 1:1 (um para um)

CREATE TABLE student_address(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL UNIQUE, -- UNIQUE garante que não haverá valores iguais, assim garantindo o relacionamento 1:1
  street TEXT NOT NULL,
  city TEXT NOT NULL,

  FOREIGN KEY (student_id) REFERENCES students(id)
)

-- Retorna erro. Não existe um estudante com id 12
INSERT INTO student_address (student_id, street, city) VALUES
  (12, 'Rua X', 'Salticity')

-- Funciona, mas se rodar duas vezes (mesmo mudando o nome da rua e cidade) retorna erro, pois o relacionamento das tabelas é de 1:1
INSERT INTO student_address (student_id, street, city) VALUES
  (1, 'Rua X', 'Salticity')

-- Retorna erro. Já existe um endereço para esse aluno
INSERT INTO student_address (student_id, street, city) VALUES
  (1, 'Rua Y', 'Piracity')

## INNER JOIN para tabelas relacionadas

SELECT s.id AS student_id, s.name, a.id AS address_id, a.street, a.city
  FROM student_address a
  INNER JOIN students s ON a.student_id = s.id -- Une a seleção baseado nas colunas referentes

## Relacionamento 1:n (um para muitos)

CREATE TABLE course_modules(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  name TEXT NOT NULL,

  FOREIGN KEY (course_id) REFERENCES courses(id)
)

SELECT c.id AS course_id, c.name, m.id AS module_id, m.name
  FROM course_modules m
  INNER JOIN courses c ON c.id = m.course_id

## Relacionamento n:n (muitos para muitos)

CREATE TABLE students_courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,

  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
)

INSERT INTO students_courses (student_id, course_id) VALUES
  (1, 3),
  (1, 2),
  (3, 1),
  (3, 4),
  (4, 4),
  (4, 5)

SELECT sc.student_id, s.name AS 'student', sc.course_id, c.name AS 'course' -- Aspas simples foi usada somente para dar enfase nas aliases
  FROM students_courses sc
  INNER JOIN students s ON s.id = sc.student_id
  INNER JOIN courses c ON c.id = sc.course_id