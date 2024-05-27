import { User } from "@prisma/client";
import { prismaClient } from "../clients/db";
import JWT from 'jsonwebtoken';

class JWTService  {
    public static generateToken(user:User) {
        const payload = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        }
        const token = JWT.sign(payload, process.env.JWT_SECRET as string);
        return token
        }
    }


export { JWTService }