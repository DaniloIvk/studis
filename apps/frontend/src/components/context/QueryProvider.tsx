import { useState, type PropsWithChildren } from 'react';
import { QueryContext } from '../../hooks/useQuery'; // Import here
import type { Query } from '../../types/Common';
import type { QueryKey } from '../../types/Query';
import { formatQuery } from '../../common/helpers';

function QueryProvider({ children }: PropsWithChildren) {
	const [resetValue, setResetValue] = useState<Query>({});
	const [value, setValue] = useState<Query>({});
	const [previousValue, setPreviousValue] = useState<Query>({});
	const [previousQuery, setPreviousQuery] = useState<Query>({});

	function use(
		form: HTMLFormElement | Query | undefined,
		defaultValues?: Query,
	): void {
		setPreviousQuery({});
		setPreviousValue(value);
		setValue(form || defaultValues || {});
		setResetValue(defaultValues ?? {});
	}

	function update(form: HTMLFormElement | Query): void {
		setPreviousQuery(value);
		setValue((value) => ({ ...value, ...form }));
	}

	function remove(...parameters: readonly QueryKey[]): void {
		setValue((value: Query) => {
			const newValue = { ...value };

			parameters.forEach((parameter) => {
				delete newValue[parameter];
			});

			return newValue;
		});
	}

	function reset(): void {
		setPreviousQuery(value);
		setValue(resetValue);
	}

	function getDirty(): QueryKey[] {
		return Object.entries(value)
			.filter(
				(value) =>
					previousQuery[value[0]] && value[1] !== previousQuery[value[0]],
			)
			.map((value) => value[0]);
	}

	function toString(): string {
		return formatQuery(value);
	}

	return (
		<QueryContext.Provider
			value={{
				value,
				previousValue,
				use,
				update,
				remove,
				reset,
				getDirty,
				toString,
			}}
		>
			{children}
		</QueryContext.Provider>
	);
}

export default QueryProvider;
