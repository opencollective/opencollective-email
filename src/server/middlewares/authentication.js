import { get, contains } from 'lodash';
import config from 'config';
import jwt from 'jsonwebtoken';
import models from '../models';
import errors from '../lib/errors';
import debug from 'debug';

const { User } = models;

const { BadRequest, CustomError, Unauthorized } = errors;

const { secret } = config.server.jwtSecret;

/**
 * Middleware related to authentication.
 *
 * Identification is provided through two vectors:
 * - api_key URL parameter which uniquely identifies an application
 * - JSON web token JWT payload which contains 3 items:
 *   - sub: user ID
 *   - scope: user scope (e.g. 'subscriptions')
 *
 * Thus:
 * - a user is identified with a JWT
 */

/**
 * Express-jwt will either force all routes to have auth and throw
 * errors for public routes. Or authorize all the routes and not throw
 * expirations errors. This is a cleaned up version of that code that only
 * decodes the token (expected behaviour).
 */
export const parseJwtNoExpiryCheck = (req, res, next) => {
  let token = req.params.token || req.query.token || req.body.token;
  if (!token) {
    const header = req.headers && req.headers.authorization;
    if (!header) return next();

    const parts = header.split(' ');
    const scheme = parts[0];
    token = parts[1];
    if (!/^Bearer$/i.test(scheme) || !token) {
      return next(new BadRequest('Format is Authorization: Bearer [token]'));
    }
  }

  jwt.verify(token, secret, (err, decoded) => {
    // JWT library either returns an error or the decoded version
    if (err && err.name === 'TokenExpiredError') {
      req.jwtExpired = true;
      req.jwtPayload = jwt.decode(token, secret); // we need to decode again
    } else if (err) {
      return next(new BadRequest(err.message));
    } else {
      req.jwtPayload = decoded;
    }

    return next();
  });
};

export const checkJwtExpiry = (req, res, next) => {
  if (req.jwtExpired) {
    return next(new CustomError(401, 'jwt_expired', 'jwt expired'));
  }

  return next();
};

export function authenticateUserByJwtNoExpiry() {
  return [this.parseJwtNoExpiryCheck, this._authenticateUserByJwt];
}

/**
 * Authenticate the user using the JWT token and populates:
 *  - req.remoteUser
 *  - req.remoteUser.memberships[CollectiveId] = [roles]
 */
export const _authenticateUserByJwt = async (req, res, next) => {
  if (!req.jwtPayload) return next();
  const userid = req.jwtPayload.id;
  const user = await User.findById(userid);
  if (!user) throw errors.Unauthorized(`User id ${userid} not found`);
  user.update({ seenAt: new Date() });
  req.remoteUser = user;
  debug('auth')('logged in user', req.remoteUser.id);
  next();
  return null;
};

/**
 * Authenticate the user with the JWT token if any, otherwise continues
 *
 * @PRE: Request with a `Authorization: Bearer [token]` with a valid token
 * @POST: req.remoteUser is set to the logged in user or null if authentication failed
 * @ERROR: Will return an error if a JWT token is provided and invalid
 */
export function authenticateUser(req, res, next) {
  if (get(req, 'remoteUser.id')) return next();

  parseJwtNoExpiryCheck(req, res, e => {
    // If a token was submitted but is invalid, we continue without authenticating the user
    if (e) {
      debug('auth')('>>> checkJwtExpiry invalid error', e);
      return next();
    }

    checkJwtExpiry(req, res, e => {
      // If a token was submitted and is expired, we continue without authenticating the user
      if (e) {
        debug('auth')('>>> checkJwtExpiry expiry error', e);
        return next();
      }
      _authenticateUserByJwt(req, res, next);
    });
  });
}
