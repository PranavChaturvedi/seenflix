import { useSession } from "@clerk/nextjs"

export async function getToken() {
  const { session } = useSession();
  const token = await session?.getToken({
    template : process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE
  });
  return token;
}