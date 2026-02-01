import { useState, type PropsWithChildren } from 'react';
import { PopupContext } from '../../hooks/usePopup';
import type { Popup } from '../../types/Popup';
import { logErrors } from '../../common/helpers';

const INFO_LIFETIME = 4;
const WARN_LIFETIME = 5;
const ERROR_LIFETIME = 6;

function PopupProvider({ children }: PropsWithChildren) {
	const [popups, setPopups] = useState<Popup[]>([]);

	function info(message: string) {
		setPopups((prev) => [
			...prev,
			{ message, level: 'info', lifetime: INFO_LIFETIME },
		]);
	}

	function warn(message: string) {
		setPopups((prev) => [
			...prev,
			{ message, level: 'warn', lifetime: WARN_LIFETIME },
		]);
	}

	function error(message: string, error?: Error) {
		setPopups((prev) => [
			...prev,
			{ message, level: 'error', lifetime: ERROR_LIFETIME },
		]);
		logErrors(error);
	}

	function popupFromResponse(response: ReturnType<typeof JSON.parse>) {
		const message = (response?.message! || '') as string;
		let level: Popup['level'], lifetime: Popup['lifetime'];

		if ('errors' in response) {
			level = 'error';
			lifetime = ERROR_LIFETIME;
		} else {
			level = 'info';
			lifetime = INFO_LIFETIME;
		}

		setPopups((prev) => [...prev, { message, level, lifetime }]);
	}

	return (
		<PopupContext.Provider
			value={{ popups, info, warn, error, popupFromResponse }}
		>
			{children}
		</PopupContext.Provider>
	);
}

export default PopupProvider;
