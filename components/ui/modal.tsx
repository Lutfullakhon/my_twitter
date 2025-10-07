import React, { ReactElement } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
	isOpen?: boolean
	onClose?: () => void
	body?: ReactElement
	footer?: ReactElement
	step?: number
	totlaSteps?: number
	isEditing?: boolean
}

function Modal({
	body,
	footer,
	isOpen,
	onClose,
	step,
	totlaSteps,
	isEditing,
}: ModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogTitle></DialogTitle>
			<DialogContent
				className={cn(
					'bg-black p-1',
					isEditing && 'h-[80vh] overflow-x-hidden overflow-y-auto'
				)}
			>
				<div className='flex items-center gap-6'>
					<button className='flex flex-col space-y-4'>
						<X size={28} onClick={onClose} />
					</button>
					{step && totlaSteps && (
						<div className='text-xl font-bold'>
							Step {step} of {totlaSteps}
						</div>
					)}
				</div>
				<div className='mt-4'>{body}</div>
				{footer && <div>{footer}</div>}
			</DialogContent>
		</Dialog>
	)
}

export default Modal
