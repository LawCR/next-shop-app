import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
// import { jwt } from "../../utils";

export async function middleware(req: NextRequest | any, ev: NextFetchEvent) {
    
    //* El token ya viene en el request por los cookies
    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! })

    if (!session) {
        return new Response( JSON.stringify({ message: 'No tienes permisos para acceder a este servicio' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    const validRoles = ['admin', 'super-user', 'SEO']
    if (!validRoles.includes(session.user.role)) {
        return new Response( JSON.stringify({ message: 'No tienes permisos para acceder a este servicio' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    return NextResponse.next()
}