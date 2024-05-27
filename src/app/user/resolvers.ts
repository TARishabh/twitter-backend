import axios from 'axios';
import { prismaClient } from '../../clients/db';
import { JWTService } from '../../services/jwt';

interface GoogleJwtPayload {
    iss: string;          // Issuer
    azp: string;          // Authorized party
    aud: string;          // Audience
    sub: string;          // Subject (user ID)
    email: string;        // User email
    email_verified: string; // Email verification status (it should be boolean, but here it's string 'true')
    nbf: string;          // Not before
    name: string;         // User name
    picture: string;      // User picture URL
    given_name: string;   // Given name
    family_name: string;  // Family name
    iat: string;          // Issued at (timestamp)
    exp: string;          // Expiration time (timestamp)
    jti: string;          // JWT ID
    alg: string;          // Algorithm
    kid: string;          // Key ID
    typ: string;          // Type
}


const queries = {
    verifyGoogleToken: async (parent:any, { token }: { token:string }) => {
        const googleToken = token;
        const googleOauthUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`;
        const {data} = await axios.get<GoogleJwtPayload>(googleOauthUrl.toString(),{
            responseType: 'json'
        });

        const checkForUser = await prismaClient.user.findUnique({where:{email:data.email}});

        if (!checkForUser) {
            await prismaClient.user.create({
                data:{
                    email:data.email,
                    firstName:data.given_name,
                    lastName:data.family_name,
                    profileImageURL:data.picture
                }
            })
        }
        const userInDb = await prismaClient.user.findUnique({where:{email:data.email}});
        if (!userInDb) {
            throw new Error("User not found");
        }
        const jwtToken = JWTService.generateToken(userInDb);
        return jwtToken;
    },
}


export const resolvers = {queries}