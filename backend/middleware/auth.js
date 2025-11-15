import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists in cookies (alternative method)
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    try {
        let user;

        // Check if it's a fake token for development (starts with 'autoria_admin_token_')
        if (token.startsWith('autoria_admin_token_')) {
          // For development: ensure an actual admin user exists in the database so
          // that controller actions (e.g. findByIdAndUpdate) succeed instead of
          // returning "User not found". Try to find an admin by email and create
          // one if missing.
          const adminEmail = 'admin@autoria.com';
          let adminUser = await User.findOne({ email: adminEmail }).select('-password');
          if (!adminUser) {
            // Create a default admin user for development/testing
            const created = await User.create({
              firstName: 'Admin',
              lastName: 'User',
              email: adminEmail,
              password: 'autonomia',
              role: 'admin',
              isActive: true
            });
            // Remove password before attaching to request
            adminUser = await User.findById(created._id).select('-password');
          }

          user = adminUser;
        } else {
        // Verify real JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Token is valid but user no longer exists'
          });
        }

        if (!user.isActive) {
          return res.status(401).json({
            success: false,
            message: 'Account has been deactivated'
          });
        }
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error in authentication middleware'
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please authenticate first.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${req.user.role} role is not authorized to access this resource.`
      });
    }

    next();
  };
};

// Admin authentication middleware
export const authenticateAdmin = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists in cookies (alternative method)
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    try {
      let user;

      // Check if it's a fake token for development (starts with 'autoria_admin_token_')
      if (token.startsWith('autoria_admin_token_')) {
        // For development: ensure an actual admin user exists in the database so
        // that controller actions (e.g. findByIdAndUpdate) succeed instead of
        // returning "User not found". Try to find an admin by email and create
        // one if missing.
        const adminEmail = 'admin@autoria.com';
        let adminUser = await User.findOne({ email: adminEmail }).select('-password');
        if (!adminUser) {
          // Create a default admin user for development/testing
          const created = await User.create({
            firstName: 'Admin',
            lastName: 'User',
            email: adminEmail,
            password: 'autonomia',
            role: 'admin',
            isActive: true
          });
          // Remove password before attaching to request
          adminUser = await User.findById(created._id).select('-password');
        }

        user = adminUser;
      } else {
        // Verify real JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database
        user = await User.findById(decoded.id).select('-password');

        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Token is valid but user no longer exists'
          });
        }

        if (!user.isActive) {
          return res.status(401).json({
            success: false,
            message: 'Account has been deactivated'
          });
        }
      }

      // Check if user has admin role
      if (user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin role required.'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error in admin authentication'
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Invalid token, but we don't reject the request, just don't set req.user
      }
    }

    next();
  } catch (error) {
    next();
  }
};

// Generate JWT Token
export const getSignedJwtToken = function(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Send token response
export const sendTokenResponse = (user, statusCode, res) => {
  const token = getSignedJwtToken(user._id);
  
  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.status(statusCode)
     .cookie('token', token, options)
     .json({
       success: true,
       token,
       data: {
         user
       }
     });
};