import express from "express";
import {expressMiddleware} from '@apollo/server/express4'
import { ApolloServer } from "@apollo/server";
import bodyParser from "body-parser";
import { prismaClient } from "../clients/db";
import { User } from './user'
import cors from 'cors'

export async function startServer(){
    const app = express();
    app.use(bodyParser.json())
    app.use(cors())

    prismaClient.user.create({
        data:{
            email:"rishabh",
            firstName:"rishabh",
        }
    })

    const graphqlServer = new ApolloServer({
        typeDefs:`
            ${User.types}
            type Query{
                ${User.queries}
            }
        `,
        resolvers:{
            Query:{
                ...User.resolvers.queries
            }
        }
    })
    await graphqlServer.start();
    app.use("/graphql",expressMiddleware(graphqlServer));
    return app
}

