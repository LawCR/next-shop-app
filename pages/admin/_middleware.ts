import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
// import { jwt } from "../../utils";

export async function middleware(req: NextRequest | any, ev: NextFetchEvent) {
    
    //* El token ya viene en el request por los cookies
    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! })

    const requestedPage = req.page.name
    const url = req.nextUrl.clone()
    
    if (!session) {
        url.pathname = '/auth/login';
        url.search = `p=${requestedPage}`;
        return NextResponse.redirect(url);
    }

    const validRoles = ['admin', 'super-user', 'SEO']
    if (!validRoles.includes(session.user.role)) {
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    return NextResponse.next()
}