import { auth } from "express-oauth2-jwt-bearer";
import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      auth0Id: string;
    }
  }
}

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: process.env.AUTH0_TOKEN_SIGNING_ALG
});

export const jwtParse = async(req: Request, res: Response, next: NextFunction) => {
  const {authorization} = req.headers;

  // checking if the user request header has an authorization property containing access token in it
  if (!authorization || !authorization.startsWith("Bearer ")){
    return res.sendStatus(401);
  }

  // getting token from the authorization header
  const token = authorization.split(" ")[1];

  try{
    const decodedToken = jwt.decode(token) as jwt.JwtPayload;

    //getting user's auth0Id from the decoded token
    const auth0Id = decodedToken.sub;

    const user = await User.findOne({auth0Id});

    if (!user){
      return res.sendStatus(401);
    }

    req.auth0Id = auth0Id as string;
    req.userId = user._id.toString();
    next();
  }
  catch(err) {
    return res.sendStatus(401);
  }
}

