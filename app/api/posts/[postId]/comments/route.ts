import Comment from '@/database/comment.model'
import Post from '@/database/post.model'
import User from '@/database/user.model'
import { authOptions } from '@/lib/auth-options'
import { connectToDatabase } from '@/lib/mongoose'
import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'

export async function GET(req: Request, route: { params: { postId: string } }) {
	try {
		await connectToDatabase()
		const {postId} = await route.params
		

		const { currentUser }: any = await getServerSession(authOptions)

		const post = await Post.findById(postId).populate({
			path: 'comments',
			model: Comment,
			populate: {
				path: 'user',
				model: User,
				select: 'name email profileImage _id username',
			},
			options: { sort: { likes: -1 } },
		})
		

		 const filteredComments = post.comments.map((item: any) => {
      const likesArray = Array.isArray(item.likes) ? item.likes : []
      return {
        _id: item._id.toString(),
        body: item.body,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        user: {
          _id: item.user._id.toString(),
          name: item.user.name,
          username: item.user.username,
          profileImage: item.user.profileImage,
          email: item.user.email,
        },
        likes: likesArray.length,
        hasLiked: currentUser
          ? likesArray.includes(currentUser._id.toString())
          : false,
      }
    })
		return NextResponse.json(filteredComments)
	} catch (error) {
			console.error('Error in GET /api/posts/[postId]/comments:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
	}
}