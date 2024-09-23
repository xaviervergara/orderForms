// Middleware para verificar si el usuario está autenticado
export function redirectIfAuthenticated(req, res, next) {
  console.log('User session:', req.session.user);
  if (req.session.user) {
    return res.redirect('/'); // Redirigir al inicio si ya está logueado
  }
  next(); // Continuar si no está autenticado
}

// Middleware para verificar si el usuario está autenticado
export function redirectIfNotAuthenticated(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login'); // Redirigir al inicio si ya está logueado
  }
  next(); // Continuar si no está autenticado
}
