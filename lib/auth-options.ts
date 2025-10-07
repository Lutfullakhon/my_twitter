
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from './mongoose'
import User from '@/database/user.model'
import { AuthOptions } from 'next-auth'

export const authOptions: AuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" }
			},
			async authorize(credentials) {
				await connectToDatabase()
				const user = await User.findOne({email: credentials?.email})

				return user
			}
		}),
		GitHubProvider({ 
			clientId: process.env.GIHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET! 
		})
	],
	callbacks: {
		async session({session}) {
			await connectToDatabase()
			const isExistUser = await User.findOne({email: session.user?.email})

			if (!isExistUser) {
				const newUser = await User.create({
					email: session.user?.email,
					name: session.user?.name,
					profileImage: session.user?.image,
				});

				session.currentUser = {
					_id: newUser._id.toString(),
					email: newUser.email,
					name: newUser.name,
					username: newUser.username,
					profileImage: newUser.profileImage,
				};
			} else {
				session.currentUser = {
					_id: isExistUser._id.toString(),
					email: isExistUser.email,
					name: isExistUser.name,
					username: isExistUser.username,
					profileImage: isExistUser.profileImage,
				};
			}

			return session
		}
	},
	session: {strategy: 'jwt'},
	jwt: {secret: process.env.NEXTAUTH_JWT_SECRET!},
	secret: process.env.NEXTAUTH_SECRET!,
}
