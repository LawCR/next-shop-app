import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials"
import { dbUsers } from "../../../database"

export const authOptions: NextAuthOptions = {
  //* Providers
  providers: [
    // ...add more providers here
    Credentials({
      name: "Custom Login",
      credentials: {
        email: { label: 'Correo:', type: 'email', placeholder: 'correo@gmail.com'},
        password: { label: 'Contraseña:', type: 'password', placeholder: '******' }
      },
      async authorize(credentials){
        //* Validar credenciales en la base de datos
        // return {name: 'Juan', correo: 'juan@gmail.com', role: 'admin'}
        return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password)
      }
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  //* Custom Pages
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },
  session: {
    maxAge: 2592000, // 30 days
    strategy: "jwt",
    updateAge: 86400, // 24 hours
  },
  //* Callbacks
  callbacks: {
    async jwt({token, account, user}) {
      if (account) {
        token.accessToken = account.access_token
        switch (account.type) {
          case 'oauth': 
            //* Crear usuario o verificar si existe en mi DB (user: {email,name, image})
            token.user = await dbUsers.oAuthToDbUser(user?.email || '', user?.name || '')
            break;  
          case 'credentials':
            token.user = user
            break;
          
          default:
            break;
        }
      }
      
      return token
    },
    async session({session, token, user}) {
      session.accessToken = token.accessToken
      session.user = token.user as any

      return session
    }
  }
}
export default NextAuth(authOptions)