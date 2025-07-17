# Reto Backend Semi-Senior - GraphQL + MongoDB

## 🚀 Objetivo

Construir una API GraphQL que gestione cuentas y productos, permitiendo:

- Crear y consultar cuentas y productos.
- Asociar productos a cuentas.
- Simular una compra (actualizar stock).
- (BONUS) Integrarse con Odoo (XML-RPC).

## 👁‍🗨️ Stack esperado

- Node.js + TypeScript
- Express + Apollo Server (GraphQL)
- MongoDB (conexión a dos bases)
- Buenas prácticas de código (tipado, validaciones)
- Uso de eslint/prettier
- Manejo de logger
- (Opcional) XML-RPC

## 🗂️ Estructura del proyecto base

```bash
server/
├── config/
│   └── app.ts              # Variables de entorno centralizadas
├── db/
│   └── mongodb.ts          # Conexión multi-base
├── graphql/
│   ├── accounts/
│   │   ├── index.ts
│   │   ├── queries.ts
│   │   ├── mutations.ts
│   │   └── schema.ts
│   ├── products/
│   │   ├── index.ts
│   │   ├── queries.ts
│   │   ├── mutations.ts
│   │   └── schema.ts
│   └── root/
│       └── index.ts        # TypeDefs y resolvers principales
│   └── index.ts            # Exporta los typeDefs y resolvers combinados
├── interfaces/
│   ├── account.ts          # IAccount
│   └── product.ts          # IProduct
├── models/
│   ├── accounts.ts
│   └── products.ts
├── services/
│   ├── odoo.ts
├── app.ts                  # Setup del servidor Express + Apollo
├── .env
├── .env.test
├── .gitignore
├── logo.png
├── package.json
├── tsconfig.json
└── README.md
```

## ✍️ Requisitos del reto

### 1. Cuentas (DB: `eiAccounts`, colección `accounts`)

- Crear cuenta: `name`, `email`
- Consultar cuenta por ID
- Listar cuentas con filtro por nombre (paginado)

### 2. Productos (DB: `eiBusiness`, colección `products`)

- Crear producto: `name`, `sku`, `stock`
- Consultar producto por ID
- Listar productos por ID de cuenta (relación manual)

### 3. Simulación de compra

- Mutation: `purchaseProduct(accountId: ID!, productId: ID!, quantity: Int!)`
  - Valida existencia de cuenta
  - Valida existencia de producto
  - Valida stock suficiente
  - Resta cantidad del stock y retorna un mensaje de éxito o error

### 4. BONUS (Odoo)

- Usar `xmlrpc` para consultar información de cliente en Odoo (correo o nombre)
- Crear una función para crear o editar clientes en Odoo (por ejemplo, `res.partner.create` o `res.partner.write` usando XML-RPC).
- **No es necesario contar con un entorno Odoo funcional.** Basta con que documentes en código cómo se haría la integración (estructura del método, parámetros esperados, y ejemplo de llamada).
- Si lo deseas, puedes usar mocks o comentarios explicativos para demostrar tu comprensión.

## 📑 Criterios de evaluación

| Criterio                      | Puntos |
| ----------------------------- | ------ |
| Correcta implementación       | 30     |
| Organización del proyecto     | 20     |
| Buen uso de GraphQL y Typings | 20     |
| Validaciones y errores        | 10     |
| Documentación y claridad      | 10     |
| Bonus Odoo (opcional)         | 10     |

## ✅ Entregables

- Repositorio GitHub o archivo ZIP
- README con instrucciones para levantar el proyecto
- Documentación de operaciones (puede ser en GraphQL Playground)

## 🛠️ Instalación y Configuración

### Requisitos previos
- Node.js v18 o superior
- MongoDB v4.4 o superior
- npm o yarn

### Pasos de instalación

1. Clonar el repositorio:
```bash
git clone <repositorio>
cd challenge-backend-node-ts
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
- Copia `.env.example` a `.env`
- Ajusta las variables según tu entorno:
  ```env
  # Server Configuration
  PORT=4000
  NODE_ENV=development

  # MongoDB Configuration
  MONGODB_ACCOUNTS_URI=mongodb://localhost:27017/eiAccounts
  MONGODB_BUSINESS_URI=mongodb://localhost:27017/eiBusiness

  # Pagination Defaults
  DEFAULT_PAGE=1
  DEFAULT_PER_PAGE=10

  # Odoo Configuration (opcional)
  ODOO_HOST=http://localhost
  ODOO_PORT=8069
  ODOO_DB=odoo
  ODOO_USERNAME=admin
  ODOO_PASSWORD=admin
  ```

4. Iniciar el servidor:
```bash
npm run dev
```

5. Acceder al GraphQL Playground:
- URL: http://localhost:4000/graphql

### Estructura de la base de datos

1. Base de datos `eiAccounts`:
   - Colección: `accounts`
   - Campos:
     - `name`: String (requerido, mín. 2 caracteres)
     - `email`: String (requerido, único, formato válido)
     - `createdAt`: Date
     - `updatedAt`: Date

2. Base de datos `eiBusiness`:
   - Colección: `products`
   - Campos:
     - `name`: String (requerido, mín. 2 caracteres)
     - `sku`: String (requerido, único)
     - `stock`: Number (requerido, >= 0)
     - `accountId`: String (requerido, ref: accounts)
     - `createdAt`: Date
     - `updatedAt`: Date

## 📘 Documentación

1. GraphQL API:
   - Ver archivo [GRAPHQL.md](GRAPHQL.md) para ejemplos detallados de:
     - Queries y mutations disponibles
     - Formato de entrada y respuesta
     - Manejo de errores
     - Validaciones de campos

2. Integración con Odoo:
   - El servicio está implementado en `server/services/odoo.ts`
   - Funcionalidades:
     - Búsqueda de clientes por email o nombre
     - Creación/actualización de clientes
   - No requiere una instancia de Odoo, es solo demostrativo

## 🧪 Testing

Para ejecutar las pruebas:
```bash
npm test
```

## 📝 Notas adicionales

- Los logs se guardan en la carpeta `logs/`
- Se usa ESLint y Prettier para mantener la calidad del código
- La documentación de GraphQL está disponible en el Playground

---

📢 **Importante**: Este reto está diseñado para ser resuelto en 1 o 2 días como máximo. No se espera una arquitectura enterprise, pero sí buenas prácticas y claridad.

🎓 Empresa: [Equip](https://www.equipconstruye.com) - B2B de materiales de construcción en Lima, Perú.
