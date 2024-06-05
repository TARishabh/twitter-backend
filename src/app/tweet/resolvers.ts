import { Tweet } from "@prisma/client";
import { prismaClient } from "../../clients/db";
import { GraphqlContext } from "../../interfaces"


interface CreateTweetPayload {
        content: string
        imageURL?: string
    }

const queries = {
    getAllTweets: () => prismaClient.tweet.findMany({orderBy: {createdAt: "desc"}})    
}

const mutations = {
    createTweet: async (parent:any, {payload }: {payload: CreateTweetPayload}, context: GraphqlContext) => {
        console.log(context,"context")
        if (!context.user) {
            throw new Error("User not found");
        }
        const tweet = await prismaClient.tweet.create({
            data:{
                content:payload.content,
                imageURL:payload.imageURL,
                author:{connect : {id: context.user.id}},
            }
        })
        return tweet;
    }
}

const extraResolvers = {
    Tweet: {
        author : (parent:Tweet) => prismaClient.user.findUnique({where: {id: parent.authorId}})
    }
}

export const resolvers = {mutations,extraResolvers,queries}