// Libraries
import {readFileSync} from "node:fs";
import pkg from "jsonwebtoken";
// Services
import {Service} from "./service.js";
import {genSecureHexString} from "./util.service.js";

const {verify: jwtVerify, sign: jwtSign} = pkg;

// Types
export type jwtData = {
    token: string;
    data: {
        aud: string;
        jti: string;
        iat: number;
        nbf: number;
        exp: number;
        sub: number;
        scopes: Array<string>;
    };
}

/**
 * Service for handling JSON Web Tokens (JWT).
 */
export default class JwtService extends Service {
    private static instance: JwtService;
    private static private_key: Buffer;
    private static public_key: Buffer;

    /**
     * Private constructor to enforce singleton pattern.
     */
    private constructor() {
        super();

        if (!JwtService.instance) {
            JwtService.instance = this;
        }

        JwtService.private_key = readFileSync("./keys/private.key");
        JwtService.public_key = readFileSync("./keys/public.key");

        return JwtService.instance;
    }

    /**
     * Returns the singleton instance of the JwtService class.
     * @returns The singleton instance of JwtService.
     */
    public static getInstance(): JwtService {
        if (!JwtService.instance) {
            JwtService.instance = new JwtService();
        }

        return JwtService.instance;
    }

    /**
     * Creates a JSON Web Token (JWT) with the specified client ID and user ID.
     * @param client_id - The client ID for which the JWT is being created.
     * @param user_id - The user ID associated with the JWT.
     * @returns The generated JWT.
     */
    public createJWT(client_id: string, user_id: number): jwtData {
        return this.sign({
            aud: client_id,
            jti: Buffer.from(this.sign({
                aud: client_id,
                jti: genSecureHexString(80),
                iat: Math.floor(Date.now() / 1000),
                nbf: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + (86400 * 10),
                sub: user_id,
                scopes: ["authorization"],
            }).token).toString('base64'),
            iat: Math.floor(Date.now() / 1000),
            nbf: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 86400,
            sub: user_id,
            scopes: ["*"],
        });

    }

    /**
     * Signs the provided data and returns a JWT.
     * @param data - The data to be signed.
     * @returns The signed JWT.
     */
    private sign(data: any): jwtData {
        return {
            token: jwtSign(data, JwtService.private_key, {algorithm: "RS256"}),
            data: data,
        };
    }

    /**
     * Verifies the provided JWT and returns the decoded data.
     * @param jwt - The JWT to be verified.
     * @returns The decoded data from the JWT.
     */
    public verify(jwt: string): any {
        try {
            let token = jwtVerify(jwt, JwtService.public_key);

            return token;
        } catch (err) {
            return this.identifyErrorType(err);
        }
    }
}
