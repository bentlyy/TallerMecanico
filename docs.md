✅ 1. Cliente
Relaciona: Vehiculo[], Factura[]

Métodos recomendados:
getAllClientes()

getClienteById(id)

getClienteByEmail(email)

createCliente(data)

updateCliente(id, data)

deleteCliente(id)

getVehiculosPorCliente(clienteId) ← útil para mostrar historial

getFacturasPorCliente(clienteId)

✅ 2. Vehiculo
Relaciona: Cliente, Reparacion[]

Métodos recomendados:
getAllVehiculos()

getVehiculoById(id)

createVehiculo(data)

updateVehiculo(id, data)

deleteVehiculo(id)

getVehiculosPorCliente(clienteId) ← útil para sección cliente

getReparacionesPorVehiculo(vehiculoId)

✅ 3. Reparacion
Relaciona: Vehiculo, Mecanico?, Usuario (recepcionista), DetalleReparacion[], Factura[]

Métodos recomendados:
getAllReparaciones()

getReparacionById(id)

createReparacion(data)

updateReparacion(id, data)

deleteReparacion(id)

cambiarEstadoReparacion(id, nuevoEstado)

asignarMecanico(reparacionId, mecanicoId)

registrarSalida(id, fechaSalida)

getDetallesReparacion(reparacionId)

getReparacionesPorVehiculo(vehiculoId)

getReparacionesPorMecanico(mecanicoId)

getReparacionesPorRecepcionista(usuarioId)

✅ 4. DetalleReparacion (tabla intermedia)
Relaciona: Pieza, Reparacion

Métodos recomendados:
agregarDetalle(reparacionId, piezaId, cantidad, precioUnitario)

eliminarDetalle(reparacionId, piezaId)

actualizarDetalle(reparacionId, piezaId, data)

getDetallesDeReparacion(reparacionId)

calcularTotalRepuestos(reparacionId)

✅ 5. Pieza
Relaciona: DetalleReparacion[]

Métodos recomendados:
getAllPiezas()

getPiezaById(id)

createPieza(data)

updatePieza(id, data)

deletePieza(id)

getPiezaByCodigo(codigo)

actualizarStock(id, nuevaCantidad)

descontarStock(id, cantidad)

✅ 6. Factura
Relaciona: Cliente, Reparacion

Métodos recomendados:
getAllFacturas()

getFacturaById(id)

createFactura(data)

getFacturasPorCliente(clienteId)

getFacturasPorReparacion(reparacionId)

✅ 7. Usuario
Relaciona: Rol, Mecanico?, Reparaciones como recepcionista

Métodos recomendados:
getAllUsuarios()

getUsuarioById(id)

getUsuarioByEmail(email)

createUsuario(data)

updateUsuario(id, data)

deleteUsuario(id)

activarUsuario(id)

desactivarUsuario(id)

getUsuariosPorRol(rolId)

verReparacionesAsignadasComoRecepcionista(usuarioId)

autenticar(email, password)

✅ 8. Rol
Relaciona: Usuario[]

Métodos recomendados:
getAllRoles()

getRolById(id)

createRol(data)

updateRol(id, data)

deleteRol(id)

getPermisosDeRol(rolId)

✅ 9. Mecanico
Relaciona: Usuario, Reparacion[]

Métodos recomendados:
getAllMecanicos()

getMecanicoById(id)

createMecanico(usuarioId, especialidad)

updateMecanico(id, data)

getReparacionesAsignadas(mecanicoId)