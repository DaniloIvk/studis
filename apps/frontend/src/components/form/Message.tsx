import { concat } from '../../common/helpers';
import Icons from '../../common/Icons';

type MessageType = 'info' | 'warning' | 'error' | 'success';

function Message({
	text = '',
	variant = 'info',
	showImage = false,
}: {
	text?: string;
	variant?: MessageType;
	showImage?: boolean;
}) {
	const variants = {
		info: {
			color:
				'text-stone-700! dark:text-stone-400! fill-stone-600! dark:fill-stone-500!',
			icon: Icons.Info,
		},
		warning: {
			color: 'text-warn-dark! dark:text-warn-light! fill-warn!',
			icon: Icons.Warning,
		},
		error: {
			color: 'text-error-dark! dark:text-error-light! fill-error!',
			icon: Icons.Error,
		},
		success: {
			color: 'text-success-dark! dark:text-success-light! fill-success!',
			icon: Icons.Info,
		},
	};

	const config = variants[variant];

	return (
		<div className='my-1 flex flex-row gap-2'>
			{showImage && (
				<config.icon
					className={concat('w-4 h-4 place-self-center', config.color)}
				/>
			)}
			<span
				className={concat(
					'text-sm place-self-center pt-1 text-pretty wrap-normal',
					config.color,
				)}
			>
				{text}
			</span>
		</div>
	);
}

export default Message;
