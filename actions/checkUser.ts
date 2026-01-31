"use server"

import { auth } from "@clerk/nextjs/server";

export default async function CheckIfUserExists() {
    const gettingUserFromClerk = await auth()
    const idOfUser = gettingUserFromClerk.userId;

    if(!idOfUser) {
        console.log('we can not get idOfUser from Clerk');
        return
    }
    return idOfUser
}