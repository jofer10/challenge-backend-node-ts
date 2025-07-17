# Documentación de GraphQL

## Queries

### Obtener un producto por ID
```graphql
query {
  product(id: "65f3a2c8e32a7b2d45678901") {
    _id
    name
    sku
    stock
    accountId
    account {
      name
      email
    }
    createdAt
    updatedAt
  }
}
```

Respuesta:
```json
{
  "data": {
    "product": {
      "_id": "65f3a2c8e32a7b2d45678901",
      "name": "Laptop HP",
      "sku": "LAP-001",
      "stock": 10,
      "accountId": "65f3a2c8e32a7b2d45678903",
      "account": {
        "name": "Juan Pérez",
        "email": "juan@email.com"
      },
      "createdAt": "2024-03-14T15:30:00Z",
      "updatedAt": "2024-03-14T15:30:00Z"
    }
  }
}
```

### Obtener productos por cuenta
```graphql
query {
  productsByAccount(accountId: "65f3a2c8e32a7b2d45678903") {
    _id
    name
    sku
    stock
    createdAt
    updatedAt
  }
}
```

Respuesta:
```json
{
  "data": {
    "productsByAccount": [
      {
        "_id": "65f3a2c8e32a7b2d45678901",
        "name": "Laptop HP",
        "sku": "LAP-001",
        "stock": 10,
        "createdAt": "2024-03-14T15:30:00Z",
        "updatedAt": "2024-03-14T15:30:00Z"
      },
      {
        "_id": "65f3a2c8e32a7b2d45678902",
        "name": "Monitor Dell",
        "sku": "MON-001",
        "stock": 15,
        "createdAt": "2024-03-14T15:35:00Z",
        "updatedAt": "2024-03-14T15:35:00Z"
      }
    ]
  }
}
```

### Obtener una cuenta por ID
```graphql
query {
  account(id: "65f3a2c8e32a7b2d45678903") {
    _id
    name
    vat
    email
    phone
    createdAt
    updatedAt
  }
}
```

Respuesta:
```json
{
  "data": {
    "account": {
      "_id": "65f3a2c8e32a7b2d45678903",
      "name": "Juan Pérez",
      "vat": "20123456789",
      "email": "juan@email.com",
      "phone": "987654321",
      "createdAt": "2024-03-14T15:00:00Z",
      "updatedAt": "2024-03-14T15:00:00Z"
    }
  }
}
```

## Mutations

### Crear un producto
```graphql
mutation {
  createProduct(
    input: {
      name: "Teclado Mecánico"
      sku: "TEC-001"
      stock: 20
      accountId: "65f3a2c8e32a7b2d45678903"
    }
  ) {
    _id
    name
    sku
    stock
    accountId
    createdAt
  }
}
```

Respuesta:
```json
{
  "data": {
    "createProduct": {
      "_id": "65f3a2c8e32a7b2d45678905",
      "name": "Teclado Mecánico",
      "sku": "TEC-001",
      "stock": 20,
      "accountId": "65f3a2c8e32a7b2d45678903",
      "createdAt": "2024-03-14T16:00:00Z"
    }
  }
}
```

### Comprar un producto
```graphql
mutation {
  purchaseProduct(
    input: {
      accountId: "65f3a2c8e32a7b2d45678903"
      productId: "65f3a2c8e32a7b2d45678905"
      quantity: 2
    }
  ) {
    success
    message
    product {
      _id
      name
      stock
    }
  }
}
```

Respuesta:
```json
{
  "data": {
    "purchaseProduct": {
      "success": true,
      "message": "Compra realizada con éxito",
      "product": {
        "_id": "65f3a2c8e32a7b2d45678905",
        "name": "Teclado Mecánico",
        "stock": 18
      }
    }
  }
}
```

## Notas
- Todos los IDs son generados por MongoDB y siguen el formato ObjectId de 24 caracteres
- El campo VAT corresponde al RUC (para empresas) o DNI (para personas naturales) en el contexto peruano
- El campo SKU es único para cada producto
- Las fechas se devuelven en formato ISO 8601
- Todas las operaciones requieren que el servidor GraphQL esté corriendo en `http://localhost:4000/graphql`
- Puedes probar estas operaciones usando GraphQL Playground accediendo a la URL anterior en tu navegador

## Posibles Errores

### Producto no encontrado
```json
{
  "errors": [
    {
      "message": "Product not found",
      "extensions": {
        "code": "BAD_USER_INPUT"
      }
    }
  ]
}
```

### Stock insuficiente
```json
{
  "errors": [
    {
      "message": "Stock insuficiente. Disponible: 18",
      "extensions": {
        "code": "BAD_USER_INPUT",
        "invalidArgs": ["quantity"]
      }
    }
  ]
}
```

### SKU duplicado
```json
{
  "errors": [
    {
      "message": "El SKU TEC-001 ya está en uso",
      "extensions": {
        "code": "BAD_USER_INPUT",
        "invalidArgs": ["sku"]
      }
    }
  ]
}
```

## Validaciones de Campos

### Cuentas (Accounts)
- **name**:
  - Requerido
  - Mínimo 2 caracteres
  - Se eliminan espacios al inicio y final
- **email**:
  - Requerido
  - Debe ser único
  - Se convierte a minúsculas
  - Debe seguir el formato: usuario@dominio.com

### Productos (Products)
- **name**:
  - Requerido
  - Mínimo 2 caracteres
  - Se eliminan espacios al inicio y final
- **sku**:
  - Requerido
  - Debe ser único
  - Se convierte a mayúsculas
  - Se eliminan espacios al inicio y final
- **stock**:
  - Requerido
  - No puede ser negativo
- **accountId**:
  - Requerido
  - Debe ser un ID válido de una cuenta existente

## Ejemplos de Errores

### Email inválido
```json
{
  "errors": [
    {
      "message": "Please enter a valid email",
      "extensions": {
        "code": "BAD_USER_INPUT",
        "invalidArgs": ["email"]
      }
    }
  ]
}
```

### Nombre muy corto
```json
{
  "errors": [
    {
      "message": "Name must be at least 2 characters long",
      "extensions": {
        "code": "BAD_USER_INPUT",
        "invalidArgs": ["name"]
      }
    }
  ]
}
```

### Stock negativo
```json
{
  "errors": [
    {
      "message": "Stock cannot be negative",
      "extensions": {
        "code": "BAD_USER_INPUT",
        "invalidArgs": ["stock"]
      }
    }
  ]
}
```

### Cuenta no existente al crear producto
```json
{
  "errors": [
    {
      "message": "La cuenta especificada no existe",
      "extensions": {
        "code": "BAD_USER_INPUT",
        "invalidArgs": ["accountId"]
      }
    }
  ]
}
``` 