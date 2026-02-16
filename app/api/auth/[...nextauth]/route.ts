import NextAuth from "next-auth"; // Sin llaves { }
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };