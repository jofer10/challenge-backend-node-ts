import * as xmlrpc from 'xmlrpc';
import config from '../config/app';

const {
  odoo: { url, db, uid, password },
} = config;

// Definición de la estructura de datos para clientes en Odoo (res.partner)
interface OdooPartner {
  id?: number;
  name: string; // Nombre del cliente
  email: string; // Email del cliente (campo de búsqueda principal)
  vat?: string; // Número de identificación fiscal (RUC para empresas, DNI para personas)
  street?: string; // Dirección del cliente
  phone?: string; // Teléfono del cliente
}

// Estructura de respuesta para mantener un formato consistente
interface OdooResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Inicialización del cliente XML-RPC para Odoo
const client = xmlrpc.createClient({ url });

/*
 * Servicio de integración con Odoo ERP
 *
 * Este servicio implementa la integración con Odoo usando XML-RPC, específicamente
 * para la gestión de clientes (res.partner). Se incluyen las operaciones básicas:
 * - Búsqueda de clientes por email
 * - Creación de nuevos clientes
 * - Actualización de datos de clientes
 *
 * Implementación de ejemplo que demuestra la estructura y parámetros necesarios
 * para la integración. No requiere un servidor Odoo activo.
 *
 * Documentación Odoo XML-RPC:
 * - Autenticación: /xmlrpc/2/common
 * - Operaciones: /xmlrpc/2/object
 * - Modelo: res.partner
 */
class OdooService {
  /*
   * Busca información de un cliente en Odoo por su email
   *
   * Método: search_read
   * Modelo: res.partner
   * Dominio: [['email', '=', email]]
   *
   * @param email - Correo electrónico del cliente a buscar
   * @returns Promise<OdooResponse> - Datos del cliente si existe
   *
   * Ejemplo de respuesta exitosa:
   * {
   *   success: true,
   *   data: [{
   *     id: 1234,
   *     name: "Juan Pérez",
   *     email: "juan@empresa.com",
   *     vat: "20123456789"
   *   }]
   * }
   */
  getOdooClientInfo = async (email: string): Promise<OdooResponse<OdooPartner[]>> => {
    try {
      const result = await new Promise((resolve, reject) => {
        client.methodCall(
          'execute_kw',
          [
            db,
            Number(uid),
            password,
            'res.partner',
            'search_read',
            [[['email', '=', email]]],
            { fields: ['name', 'vat', 'email', 'street', 'phone'] },
          ],
          (err: Error, value: OdooPartner[]) => {
            if (err) reject(err);
            else resolve(value);
          }
        );
      });

      return {
        success: true,
        data: result as OdooPartner[],
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error en la búsqueda del cliente',
      };
    }
  };

  /*
   * Crea un nuevo cliente en Odoo
   *
   * Método: create
   * Modelo: res.partner
   *
   * @param partner - Datos del cliente a crear
   * @returns Promise<OdooResponse> - ID del cliente creado
   *
   * Ejemplo de uso:
   * const nuevoCliente = {
   *   name: "Juan Pérez",
   *   email: "juan@empresa.com",
   *   vat: "20123456789",
   *   street: "Av. Principal 123",
   *   phone: "999888777"
   * };
   */
  createPartner = async (partner: OdooPartner): Promise<OdooResponse<number>> => {
    try {
      const result = await new Promise((resolve, reject) => {
        client.methodCall(
          'execute_kw',
          [db, Number(uid), password, 'res.partner', 'create', [partner]],
          (err: Error, value: number) => {
            if (err) reject(err);
            else resolve(value);
          }
        );
      });

      return {
        success: true,
        data: result as number,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error en la creación del cliente',
      };
    }
  };

  /*
   * Actualiza los datos de un cliente existente en Odoo
   *
   * Método: write
   * Modelo: res.partner
   *
   * @param id - ID del cliente en Odoo
   * @param partner - Datos a actualizar (campos parciales)
   * @returns Promise<OdooResponse> - Confirmación de actualización
   *
   * Notas importantes:
   * - Solo se actualizarán los campos incluidos en el objeto partner
   * - El ID debe existir en Odoo
   * - Se recomienda primero buscar el cliente con getOdooClientInfo
   */
  updatePartner = async (
    id: number,
    partner: Partial<OdooPartner>
  ): Promise<OdooResponse<boolean>> => {
    try {
      await new Promise((resolve, reject) => {
        client.methodCall(
          'execute_kw',
          [db, Number(uid), password, 'res.partner', 'write', [[id], partner]],
          (err: Error, value: boolean) => {
            if (err) reject(err);
            else resolve(value);
          }
        );
      });

      return {
        success: true,
        data: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error en la actualización del cliente',
      };
    }
  };
}

export default new OdooService();
