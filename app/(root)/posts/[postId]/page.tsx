'use client'

import Header from '@/components/shared/header'
import { IPost } from '@/types'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { use, useEffect, useState } from 'react'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '../../../../components/ui/avatar'
import { sliceText } from '@/lib/utils'
import { formatDistanceToNowStrict } from 'date-fns'
import Form from '@/components/shared/form'
import CommentItem from '@/components/shared/comment-item'

type PageProps = {
	params: Promise<{
		postId: string
	}>
}

const Page = ({ params }: PageProps) => {
	const { postId } = use(params)

	const { data: session, status } = useSession()
	const [isLoading, setIsLoading] = useState(false)
	const [isFetchingComments, setIsFetchingComments] = useState(false)
	const [post, setPost] = useState<IPost | null>(null)
	const [comments, setComments] = useState<IPost[]>([])

	const getPost = async () => {
		try {
			setIsLoading(true)
			const { data } = await axios.get(`/api/posts/${postId}`)
			setPost(data)
			setIsLoading(false)
		} catch (error) {
			console.log(error)
			setIsLoading(false)
		}
	}

	const getComments = async () => {
		try {
			setIsFetchingComments(true)
			const { data } = await axios.get(`/api/posts/${postId}/comments`)

			setComments(data)
			setIsFetchingComments(false)
		} catch (error) {
			console.log(error)
			setIsFetchingComments(false)
		}
	}

	useEffect(() => {
		getPost()
		getComments()
	}, [])

	return (
		<>
			<Header label='Posts' isBack />

			{isLoading || status === 'loading' ? (
				<div className='flex justify-center items-center h-24'>
					<Loader2 className='animate-spin text-sky-500' />
				</div>
			) : (
				<>
					<div className='border-b-[1px] border-neutral-800 p-5 cursor-pointer bg-neutral-900 transition '>
						<div className='flex flex-row items-center gap-3'>
							<Avatar>
								<AvatarImage src={post?.user.profileImage} />
								<AvatarFallback>{post?.user.name[0]}</AvatarFallback>
							</Avatar>

							<div className='flex flex-row items-center gap-2'>
								<p className='text-white font-semibold cursor-pointer hover:underline'>
									{post?.user.name}
								</p>
								<span className='text-neutral-500 cursor-pointer hover:underline hidden md:block'>
									{post && post?.user.username
										? `@${sliceText(post.user.username, 16)}`
										: post && sliceText(post.user.email, 16)}
								</span>
								<span className='text-neutral-500 text-sm'>
									{post && formatDistanceToNowStrict(new Date(post.createdAt))}{' '}
									ago
								</span>

								<div className='text-white mt-1'>{post?.body}</div>
							</div>
						</div>
					</div>

					<Form
						placeholder='Post your reply'
						user={JSON.parse(JSON.stringify(session?.currentUser))}
						setPosts={setComments}
						postId={postId}
						isComment
					/>

					{isFetchingComments ? (
						<div className='flex justify-center items-center h-24'>
							<Loader2 className='animate-spin text-sky-500' />
						</div>
					) : (
						comments.map(comment => (
							<CommentItem
								comment={comment}
								key={comment._id}
								user={JSON.parse(JSON.stringify(session?.currentUser))}
								setComments={setComments}
								comments={comments}
							/>
						))
					)}
				</>
			)}
		</>
	)
}

export default Page
