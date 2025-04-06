// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getToken(session : any) {
  const token = await session?.getToken({
    template: process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE,
  });
  return token;
}
