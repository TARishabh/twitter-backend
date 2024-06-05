import { User } from "@prisma/client";
import { prismaClient } from "../clients/db";
import JWT from 'jsonwebtoken';
import { jwtUser } from "../interfaces";

class JWTService {
    public static generateToken(user: User) {
        const payload: jwtUser = {
            id: user.id,
            email: user.email,
        }
        const token = JWT.sign(payload, process.env.JWT_SECRET as string);
        return token
    }


    public static decodeToken(token: string) {
        try {
            return JWT.verify(token, process.env.JWT_SECRET as string) as jwtUser
        } catch (error) {
            return null
        }
    }
}



export { JWTService }