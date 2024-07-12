// Libraries
import { Request, Response, NextFunction } from "express";

// Models
import { Account } from "../../models/account.model.js";

// Services
import JwtService from "../../services/jwt.service.js";

// Errors
import { BadRequest, Forbidden } from "../../errors/api.error.js";

/**
 * Handles the POST request for generating an authentication token.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A Promise that resolves when the request is handled.
 */
export const post = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const formData = req.body;

    // Check if the client_id and client_secret are provided
    if (
      (Number(process.env.CLIENT_ID) ?? 0) !== Number(formData.client_id) ||
      (process.env.CLIENT_SECRET ?? "") !== formData.client_secret
    ) {
      throw new Forbidden("Invalid client credentials.");
    }

    // Check if the username and password are provided
    if (!formData.username || !formData.password) {
      throw new BadRequest("Username and password are required");
    }

    // Create a new Account object
    const contextUser = await new Account().getAccount(formData.username);
    const valid = await contextUser.validatePassword(formData.password);

    // If the username or password is invalid, throw a Forbidden error
    if (!valid) {
      throw new Forbidden("Invalid username or password.");
    }

    /**
     * JSON Web Token (JWT) representing the authentication token.
     *
     * @type {string}
     */
    const jwt = JwtService.getInstance().createJWT(
      req.body.client_id,
      contextUser.getId()
    );

    res
      .cookie("jwt", jwt.token, {
        maxAge: jwt.data.exp,
      })
      .status(200)
      .json({
        access_token: jwt.token,
        expires_in: jwt.data.exp - Math.floor(Date.now() / 1000),
        refresh_token: jwt.data.jti,
        token_type: "Bearer",
      });
  } catch (e) {
    next(e);
  }
};
