# 🍔 BurgerHouse

**BurgerHouse** es una aplicación desarrollada con **NestJS** y **GraphQL** que gestiona usuarios y productos para un sistema de pedidos de hamburguesas. El sistema contempla tres tipos de usuarios: `admin`, `client` y `delivery`.

## Funcionalidades principales

* Autenticación y autorización de usuarios según su rol.
* Gestión de productos con un CRUD.
* Consulta de productos y de usuarios.
* Modularización de la app en:

  * **Módulo de usuarios** (`Users`)
  * **Módulo de productos** (`Products`)

## Link del despligue: 

   ```bash
      https://taller-graphql-gb0p.onrender.com/graphql
 
   ```


## Configuración y ejecución del proyecto

### Requisitos previos

Asegúrate de tener instalado:

* [Node.js](https://nodejs.org/) (versión recomendada: 18.x o superior)
* [npm](https://www.npmjs.com/) (versión 9.x o superior)

### Pasos para la configuración de  manera local 

1. **Clonar el repositorio:**

   ```bash
   git clone https: https://github.com/DaniLond/taller-Graphql.git
   cd taller-Graphql.git
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Instalar paquetes necesarios para GraphQL:**

   ```bash
   npm install @nestjs/graphql @nestjs/apollo graphql apollo-server-express
   ```

4. **Levantar el servidor:**

   ```bash
   npm run start:dev
   ```

5. Accede a la consola de GraphQL en:
   [http://localhost:3000/graphql](http://localhost:3000/graphql)

## 👤 Tipos de usuario

* **Admin:** Tiene control total sobre los productos y los usuarios.
* **Client:** Puede consultar y solicitar productos.
* **Delivery:** Visualiza pedidos, no puede crear productos ni obtenerlos.


##  Dificultades encontradas

No se encontro ninguna dificultad 

---

## 📚 Tipos de documentos y fragmentos

### 🔸 Fragmento `UserBasicInfo`

```graphql
fragment UserBasicInfo on User {
  id
  email
  fullName
  roles
  isActive
}
```

### 🔸 Fragmento `ProductInfo`

```graphql
fragment ProductInfo on Product {
  id
  name
  description
  price
  isActive
  category
  imageUrl
}
```

---

## 👥 Módulo de Usuarios

###  `registerUser`

**Mutation** — Registra un nuevo usuario

```graphql
mutation RegisterUser {
  registerUser(createUserInput: {
    email: "maria@gmail.com"
    password: "123Maria"
    fullName: "Maria Perez"
  }) {
    user {
      ...UserBasicInfo
    }
    token
  }
}
```

---

###  `loginUser`

**Mutation** — Inicia sesión y retorna token JWT

```graphql
mutation LoginUser {
  loginUser(loginUserInput: {
    email: "leidy@gmail.com"
    password: "123Leidy"
  }) {
    user {
      ...UserBasicInfo
    }
    token
  }
}
```

---

###  `profile`

**Query** — Retorna el perfil del usuario autenticado

```graphql
query GetProfile {
  profile {
    ...UserBasicInfo
  }
}
```

---

###  `users`

**Query** — Lista todos los usuarios

```graphql
query GetUsers {
  users {
    ...UserBasicInfo
  }
}
```

---

###  `user`

**Query** — Obtiene un usuario por email

```graphql
query GetUser {
  user(email: "maria@gmail.com") {
    ...UserBasicInfo
  }
}
```

---

###  `deleteUser`

**Mutation** — Elimina un usuario por email

```graphql
mutation DeleteUser {
  deleteUser(email: "maria@gmail.com") {
    message
  }
}
```

---

###  `updateUser`

**Mutation** — Actualiza datos de un usuario

```graphql
mutation UpdateUser {
  updateUser(
    email: "maria@gmail.com"
    updateUserInput: {
      fullName: "Maria Jose Perez"
      roles: ["delivery"]
    }
  ) {
    ...UserBasicInfo
  }
}
```

---

## 🍔 Módulo de Productos

### `createProduct`

**Mutation** — Crea un nuevo producto

```graphql
mutation CreateProduct {
  createProduct(
    createProductInput: {
      name: "Hamburguesa BBQ"
      description: "Con salsa BBQ, tocineta y cebolla caramelizada"
      price: 28000
      category: burgers
      imageUrl: "https://example.com/hamburguesa-bbq.jpg"
    }
  ) {
    ...ProductInfo
  }
}
```

---

###  `products`

**Query** — Retorna todos los productos

```graphql
query GetAllProducts {
  products {
    ...ProductInfo
  }
}
```

---

###  `product`

**Query** — Retorna un producto por nombre

```graphql
query GetProductByName {
  product(name: "Hamburguesa BBQ") {
    ...ProductInfo
  }
}
```

---

###  `updateProduct`

**Mutation** — Actualiza un producto

```graphql
mutation UpdateProduct {
  updateProduct(
    updateProductInput: {
      name: "Hamburguesa BBQ"
      price: 32000
    }
  ) {
    ...ProductInfo
  }
}
```

---

###  `deleteProduct`

**Mutation** — Elimina un producto por nombre

```graphql
mutation DeleteProduct {
  deleteProduct(name: "Hamburguesa BBQ") {
    message
  }
}
```

---

##  Para tener en cuenta 

* Todos los endpoints requieren autenticación excepto `registerUser` y `loginUser`.
* Se recomienda enviar el token JWT en el header `Authorization`:

  ```
  Authorization: Bearer <token>
  ```




