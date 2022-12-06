import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
// import { jwt } from "../../utils";

export async function middleware(req: NextRequest | any, ev: NextFetchEvent) {
    
    //* Version de next-auth
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! })

    const requestedPage = req.page.name
    const url = req.nextUrl.clone()
    url.pathname = '/auth/login';
    url.search = `p=${requestedPage}`;
    
    if (!session) {
        return NextResponse.redirect(url);
    }

    return NextResponse.next()
    //* Version propia
    // const { token = '' } = req.cookies;
    // // return new Response('No autorizado', {
    // //     status: 401,
    // // })
    // try {
    //     await jwt.isValidToken(token)
    //     return NextResponse.next();
    // } catch (error) {
    //     return NextResponse.redirect(url);
    // }
}