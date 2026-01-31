"use server"

import { auth } from "@/utils/auth";

export default async function CheckIfUserExists() {
    const session = await auth()
    const idOfUser = session?.user?.id;

    if(!idOfUser) {
        console.log('we can not get idOfUser from Auth');
        return
    }
    return idOfUser
}
