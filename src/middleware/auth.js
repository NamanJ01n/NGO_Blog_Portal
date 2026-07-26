// Mirrors JwtAuthFilter + CustomUserDetailsService together.
//
// Important behavioral detail carried over exactly from the Java version:
// the filter loads the user FRESH from the DB on every request (rather than
// trusting only what's baked into the JWT), so a role change takes effect
// immediately without needing a new login. It does NOT check `verified` on
// every request either -- verified is only enforced at login time, exactly
// like the Java version (JwtAuthFilter builds the Authentication object
// directly without going through the AuthenticationManager, so the
// "disabled" flag on UserDetails never actually gets checked post-login).
const User = require("../models/User");
const { verifyToken } = require("../utils/jwt");

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(); // no token -> proceed unauthenticated; route guards decide what to do
  }

  const token = authHeader.substring(7);

  try {
    const decoded = verifyToken(token); // throws if invalid/expired
    const email = decoded.sub;

    if (email) {
      const user = await User.findOne({ email });
      if (user) {
        req.user = {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
    }
  } catch (err) {
    // invalid/expired token -> request proceeds unauthenticated,
    // will be rejected downstream by requireAuth/requireAdmin if the route needs it
  }

  next();
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
}

module.exports = { authenticate, requireAuth, requireAdmin };
