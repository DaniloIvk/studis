import { useEffect, useRef } from 'react';
import { t } from 'i18next';
import type {
	PopupLevel,
	PopupPosition,
	PopupProps,
} from '../../types/ConfirmationPopup';
import Icons from '../../common/Icons';
import { concat } from '../../common/helpers';

function ConfirmationPopup({
	title,
	description,
	confirmButtonLabel = 'yes',
	declineButtonLabel = 'no',
	level = 'critical',
	position = 'center',
	discardable,
	hidden,
	setHidden,
	onConfirm = () => {},
	onDecline = () => {},
	onDiscard = () => {},
}: PopupProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	setHidden ??= _setHidden;
	const buttonBackground = getButtonClasses(level);
	const popupPosition = getPositionClasses(position);

	// Handlers
	async function handleConfirm(): Promise<void> {
		await onConfirm();
		dialogRef.current?.close();
	}
	async function handleDecline(): Promise<void> {
		await onDecline();
		dialogRef.current?.close();
	}
	async function handleDiscard(): Promise<void> {
		await onDiscard();
		dialogRef.current?.close();
	}
	function handleNativeClose(): void {
		setHidden?.(true);
	}
	function _setHidden(value: boolean): void {
		hidden = value;
	}

	useEffect(() => {
		if (hidden === undefined || !dialogRef.current) {
			return;
		}

		if (hidden) {
			if (dialogRef.current?.open === false) {
				dialogRef.current?.close();
			}
		} else {
			position === 'screen-center' ?
				dialogRef.current?.showModal()
			:	dialogRef.current?.show();
		}
	}, [hidden, position]);

	return (
		<dialog
			ref={dialogRef}
			onClose={handleNativeClose}
			className={concat(
				'bg-light! dark:bg-primary-dark! absolute w-max rounded-xl shadow-lg z-50',
				popupPosition,
			)}
		>
			<div className='bg-light-gray! dark:bg-primary-hover! w-full h-fit flex flex-row justify-between items-center content-stretch gap-4 p-4'>
				{title && (
					<h6 className='bg-transparent! w-fit text-base text-start font-semibold text-pretty wrap-anywhere'>
						{t(title)}
					</h6>
				)}
				{discardable && (
					<Icons.Close
						onClick={handleDiscard}
						className='bg-dark/7! dark:bg-light/10! hover:bg-dark/5! dark:hover:bg-light/15! active:bg-dark/5! dark:active:bg-light/15! hover:fill-error! active:fill-error! hover:shadow-sm active:shadow-sm w-8 xs:w-6 h-8 xs:h-6 p-1 rounded-full cursor-pointer'
					/>
				)}
			</div>
			<form className='bg-transparent! relative flex flex-col justify-between items-stretch content-stretch gap-4 p-4'>
				{description && (
					<p className='text-start mx-4 mb-2'>{t(description)}</p>
				)}
				<div className='flex flex-col xs:flex-row justify-end items-center content-stretch gap-4 select-none'>
					<button
						type='button'
						onClick={handleConfirm}
						className={concat(
							'text-white! w-full xs:w-auto px-6 py-2 rounded-md shadow-md hover:shadow-lg active:shadow-lg',
							buttonBackground,
						)}
					>
						{t(confirmButtonLabel)}
					</button>
					<button
						type='button'
						onClick={handleDecline}
						className='bg-neutral-dark! dark:bg-neutral-light! hover:bg-neutral! text-white! w-full xs:w-auto px-6 py-2 rounded-md shadow-md hover:shadow-lg active:shadow-lg'
					>
						{t(declineButtonLabel)}
					</button>
				</div>
			</form>
		</dialog>
	);
}

/**
 * Maps the danger level to specific button Tailwind classes.
 */
function getButtonClasses(level: PopupLevel): string {
	const levels: Record<PopupLevel, string> = {
		important:
			'bg-warn-dark! dark:bg-warn-light! hover:bg-warn! active:bg-warn!',
		critical:
			'bg-error-dark! dark:bg-error-light! hover:bg-error! active:bg-error!',
		default:
			'bg-primary-light! hover:bg-primary-hover! active:bg-primary-hover!',
	};

	return levels[level];
}

/**
 * Maps the position prop to the specific Tailwind classes.
 */
function getPositionClasses(position: PopupPosition): string {
	const positions: Record<PopupPosition, string> = {
		'below': 'top-full left-1/2 -translate-x-1/2 mt-4',
		'above': 'bottom-full left-1/2 -translate-x-1/2 mb-4',
		'left': 'top-1/2 left-auto right-full -translate-y-1/2 mr-4',
		'right': 'top-1/2 left-full -translate-y-1/2 ml-4',
		'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
		'screen-center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
	};

	return positions[position];
}

export default ConfirmationPopup;
