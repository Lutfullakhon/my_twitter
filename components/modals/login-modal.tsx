import useLoginModal from '@/hooks/useLoginModal'
import React, { useCallback, useState } from 'react'
import Modal from '../ui/modal'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import Button from '../ui/button'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { loginSchema } from '@/lib/validation'
import useRegisterModal from '@/hooks/useRegisterModal'
import axios from 'axios'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { signIn } from 'next-auth/react'

function LoginModal() {
	const [error, setError] = useState('')

	const loginModal = useLoginModal()
	const registermodal = useRegisterModal()

	const onToggle = useCallback(() => {
		loginModal.onClose()
		registermodal.onOpen()
	}, [loginModal, registermodal])

	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	async function onSubmit(values: z.infer<typeof loginSchema>) {
		try {
			const { data } = await axios.post('/api/auth/login', values)
			if (data.success) {
				signIn('credentials', {
					email: data.email,
					values,
				})
				loginModal.onClose()
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			if (error.response.data.error) {
				setError(error.response.data.error)
			} else {
				setError('Something went wrong. Please tyr again later')
			}
		}
	}

	const { isSubmitting } = form.formState

	const bodyContent = (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 px-12'>
				{error && (
					<Alert variant='destructive'>
						<AlertCircle />
						<AlertTitle>Heads up!</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input placeholder='Email' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input placeholder='Password' type='password' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					label={'Login'}
					type='submit'
					secondary
					fullWidth
					disabled={isSubmitting}
				/>
			</form>
		</Form>
	)
	const footer = (
		<div className='text-neutral-400 text-center mb-4'>
			<p>
				First time using X?{' '}
				<span
					className='text-white cursor-pointer hover:underline'
					onClick={onToggle}
				>
					Create an account
				</span>
			</p>
		</div>
	)

	return (
		<Modal
			isOpen={loginModal.isOpen}
			onClose={loginModal.onClose}
			body={bodyContent}
			footer={footer}
		/>
	)
}

export default LoginModal
