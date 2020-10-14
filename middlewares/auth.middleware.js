const createError = require('http-errors')

module.exports.isAuthenticated = (req, _, next) => {
  if (req.session.user) {
    next()
  } else {
    next(createError(401))
  }
}

module.exports.isNotAuthenticated = (req, _, next) => {
  if (req.session.user) {
    next(createError(401))
  } else {
    next()
  }
}

/*
HTTP COMMON STATUS CODES:

2XX - OK
201 - CREATED

4XX BAD REQUEST
401 UNAUTHORIZED (NO ESTÁ AUTENTICADO, ES DECIR, NO HA INICIADO SESIÓN)
403 FORBIDDEN (AUN ESTANDO AUTENTICADO, NO TIENES SUFICIENTES PERMISOS PARA ACCEDER AL RECURSO)
404 NOT FOUND

302 REDIRECT
303 REDIRECT

500 SERVER ERROR (ERROR NO CONTROLADO, NO SE DEBERÍA VER, ES UN BUG)

user crud:
401 => si no está autenticado
403 => si no tiene permiso

GET /users => 200 OK
GET /users/:id => 200 OK, 404 NOT FOUND

POST /users => 201 OK, 400 ERROR EN VALIDACIÓN DE DATOS

PATCH /user/:id => 200 OK, 404 NOT FOUND, 400 validación de datos

PUT se utiliza para modificar el objecto entero, reescribe el objeto
PATCH se utiliza para modificar una key del obbjeto

DELETE /user/:id => 292 NO CONTENT, 404 NOT FOUND

*/