import type Service from '../core/service/Service';
import type { Constructor } from '../types/Common';

interface UseServiceHook {
	<T extends Service>(service: Constructor<T>): T;
	services?: Service[];
}

const useService: UseServiceHook = <T extends Service>(
	service: Constructor<T>,
): T => {
	if (!useService.services) {
		useService.services = [];
	}

	let instance: T | undefined;

	instance = useService.services.find(
		(instance): instance is T => instance instanceof service,
	);

	if (instance) {
		return instance;
	}

	instance = new service();
	useService.services.push(instance);

	return instance;
};

export default useService;
