CREATE DATABASE dbeljardindeberni

\c dbeljardindeberni

CREATE TABLE profiles (
  profile_id SERIAL PRIMARY KEY,
  profileName VARCHAR(50) NOT NULL,
  profileDescription TEXT
);

-- SCRIPT PARA GENERAR LOS PERFILES
INSERT INTO profiles
(profileName, profileDescription)
VALUES
('Administrador', 'Usuario habilitado para publicar, editar y eliminar productos de la tienda.'),
('Comprador', 'Usuario habilitado para realizar compras en la tienda.');

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  userName VARCHAR(50),
  userEmail VARCHAR(50) NOT NULL,
  userAddress VARCHAR(25),
  userPhone VARCHAR(12),
  password VARCHAR(100) NOT NULL, 
  profile_id INT NOT NULL,
  city VARCHAR(25) NOT NULL,
  region VARCHAR(25) NOT NULL,
  FOREIGN KEY (profile_id) REFERENCES profiles(profile_id)
);

CREATE TABLE products (
  product_id BIGSERIAL PRIMARY KEY,
  productName VARCHAR(25) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  description TEXT,
  image VARCHAR(200)
);

INSERT INTO products (productname, price, description, image) 
VALUES 
('Orquídea Pequeña', 25000, 'Mide 27 centímetros de alto aproximadamente. Viene en macetero plástico.', 'https://plantme.cl/cdn/shop/products/orquideas.chicas_Mesadetrabajo1copia8_540x.jpg?v=1620931254');

CREATE TABLE fav (
  fav_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  product_id BIGINT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE userCart (
  cart_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  product_id BIGINT NOT NULL,
  cantidad INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
); 
