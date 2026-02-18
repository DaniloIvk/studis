import Service from '../core/service/Service';
import app from '../config/app';

export interface DashboardStats {
	role: 'ADMIN' | 'PROFESSOR' | 'STUDENT';
	stats: Record<string, number>;
	chart: {
		labels: string[];
		data: number[];
	};
}

export interface DashboardResponse {
	data: DashboardStats;
}

class DashboardService extends Service {
	private apiUrl = app.apiUrl.replace(/\/*$/g, '/');

	async getStats(): Promise<DashboardResponse> {
		const response = await this.fetch<Response>(
			`${this.apiUrl}api/dashboard`,
			'GET',
			undefined,
			undefined,
			{
				Accept: 'application/json',
			},
		);

		const data = await response.json();

		if (response.status < 200 || response.status >= 300) {
			throw data;
		}

		return data;
	}
}

export default new DashboardService();
