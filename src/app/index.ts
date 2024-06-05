import express from "express";
import {expressMiddleware} from '@apollo/server/express4'
import { ApolloServer } from "@apollo/server";
import bodyParser from "body-parser";
import { prismaClient } from "../clients/db";
import { User } from './user'
import { Tweet } from './tweet'
import cors from 'cors'
import { GraphqlContext } from "../interfaces";
import { JWTService } from "../services/jwt";

export async function startServer(){
    const app = express();
    app.use(bodyParser.json())
    app.use(cors())

    // prismaClient.user.create({
    //     data:{
    //         email:"rishabh",
    //         firstName:"rishabh",
    //     }
    // })

    const graphqlServer = new ApolloServer<GraphqlContext>({
        typeDefs:`
            ${User.types}
            ${Tweet.types}

            type Query{
                ${User.queries}
                ${Tweet.queries}
            }

            type Mutation{
                ${Tweet.mutations}
            }
        `,
        resolvers:{
            Query:{
                ...User.resolvers.queries,
                ...Tweet.resolvers.queries
            },
            Mutation : {
                ...Tweet.resolvers.mutations
            },
            ...Tweet.resolvers.extraResolvers,
            ...User.resolvers.UserExtraResolvers
        }
    })
    await graphqlServer.start();
    app.use("/graphql",expressMiddleware(graphqlServer, {context: async({req,res})=>{
        return {
            user: req.headers.authorization ? JWTService.decodeToken(req.headers.authorization.split('Bearer ')[1] as string) : undefined
        }
    }}));
    return app
}

