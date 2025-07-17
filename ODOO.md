# Integración con Odoo

Este documento describe la integración con Odoo ERP usando XML-RPC. La implementación es demostrativa y no requiere un servidor Odoo activo.

## Configuración

En el archivo `.env`:
```env
ODOO_HOST=http://localhost
ODOO_PORT=8069
ODOO_DB=odoo
ODOO_USERNAME=admin
ODOO_PASSWORD=admin
```

## Funcionalidades Implementadas

### 1. Búsqueda de Clientes

```typescript
import odooService from '../services/odoo';

// Buscar cliente por email
const result = await odooService.getOdooClientInfo('juan@email.com');

// Respuesta exitosa
{
  success: true,
  data: [{
    id: 1234,
    name: "Juan Pérez",
    email: "juan@email.com",
    vat: "20123456789",
    street: "Av. Principal 123",
    phone: "999888777"
  }]
}

// Respuesta con error
{
  success: false,
  error: "Error en la búsqueda del cliente"
}
```

### 2. Crear Cliente

```typescript
// Datos del nuevo cliente
const nuevoCliente = {
  name: "María García",
  email: "maria@email.com",
  vat: "10987654321",
  street: "Jr. Secundaria 456",
  phone: "988777666"
};

const result = await odooService.createPartner(nuevoCliente);

// Respuesta exitosa
{
  success: true,
  data: 5678 // ID del cliente creado
}

// Respuesta con error
{
  success: false,
  error: "Error en la creación del cliente"
}
```

### 3. Actualizar Cliente

```typescript
// ID del cliente y datos a actualizar
const idCliente = 5678;
const datosActualizados = {
  street: "Nueva Dirección 789",
  phone: "977666555"
};

const result = await odooService.updatePartner(idCliente, datosActualizados);

// Respuesta exitosa
{
  success: true,
  data: true
}

// Respuesta con error
{
  success: false,
  error: "Error en la actualización del cliente"
}
```

## Estructura de Datos

### Cliente (res.partner)
```typescript
interface OdooPartner {
  id?: number;          // ID en Odoo (auto-generado)
  name: string;         // Nombre del cliente (requerido)
  email: string;        // Email (requerido, único)
  vat?: string;         // RUC/DNI
  street?: string;      // Dirección
  phone?: string;       // Teléfono
}
```

## Notas Técnicas

1. **Autenticación**:
   - Endpoint: `/xmlrpc/2/common`
   - Credenciales en variables de entorno
   - Sesión manejada internamente por el servicio

2. **Operaciones**:
   - Endpoint: `/xmlrpc/2/object`
   - Modelo: `res.partner`
   - Métodos: `search_read`, `create`, `write`

3. **Manejo de Errores**:
   - Todas las operaciones retornan un objeto `OdooResponse`
   - Incluye flag de éxito y mensaje de error si falla
   - Logs detallados para debugging

4. **Validaciones**:
   - Email único por cliente
   - Nombre requerido
   - VAT (RUC/DNI) debe ser válido según formato peruano

## Ejemplo de Integración Completa

```typescript
import odooService from '../services/odoo';

async function sincronizarCliente(email: string) {
  try {
    // 1. Buscar si el cliente existe
    const busqueda = await odooService.getOdooClientInfo(email);
    
    if (!busqueda.success) {
      console.error('Error en búsqueda:', busqueda.error);
      return;
    }

    if (busqueda.data && busqueda.data.length > 0) {
      // 2. Actualizar cliente existente
      const cliente = busqueda.data[0];
      const actualizacion = await odooService.updatePartner(cliente.id!, {
        phone: "999999999"
      });
      
      console.log('Cliente actualizado:', actualizacion.success);
    } else {
      // 3. Crear nuevo cliente
      const nuevoCliente = {
        name: "Nuevo Cliente",
        email: email,
        vat: "20123456789"
      };
      
      const creacion = await odooService.createPartner(nuevoCliente);
      console.log('Cliente creado con ID:', creacion.data);
    }
  } catch (error) {
    console.error('Error en sincronización:', error);
  }
}
```

## Consideraciones de Seguridad

1. Nunca exponer credenciales de Odoo en el código
2. Usar HTTPS para conexiones en producción
3. Implementar rate limiting para prevenir sobrecarga
4. Mantener logs de todas las operaciones
5. Validar datos antes de enviar a Odoo 