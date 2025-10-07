import "next-auth"

declare module "next-auth" {
  interface Session {
    currentUser?: {
      _id: string
      email: string
      name?: string
			username?: string;
      profileImage?: string
    }
  }
}
