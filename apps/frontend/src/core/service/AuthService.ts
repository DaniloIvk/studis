import Service from "./Service";
import app from "../../config/app";

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'ADMIN' | 'PROFESSOR' | 'STUDENT';
    index: string | null;
    phoneNumber: string | null;
    address: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface UpdateProfileData {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address?: string;
    currentPassword?:string;
    newPassword?:string;
}
class AuthService extends Service {
    private apiUrl = app.apiUrl.replace(/\/*$/g, '/');

    async login(credentials: LoginCredentials): Promise<User> {
        const response = await this.fetch<Response>(
            `${this.apiUrl}auth/login`,
            'POST',
            undefined,
            credentials,
            {
                'Content-Type' : 'application/json',
                'Accept' : 'application/json'
            }
        );

        const data = await response.json();

        if (response.status < 200 || response.status >= 300) {
            throw data;
        }

        return data.data;
    }

    async logout(): Promise<void> {
        const response = await this.fetch<Response> (
            `${this.apiUrl}auth/logout`,
            'POST',
            undefined,
            null,
            {
                'Accept': 'application/json'
            }
        )

        if (response.status < 200 || response.status >= 300){
            const data = await response.json();
            throw data;
        }
    }

    async getCurrentUser(): Promise<User | null> {
        try {
            const response = await this.fetch<Response>(
                `${this.apiUrl}/auth/me`,
                'GET',
                undefined,
                undefined,
                {
                    'Accept': 'application/json'
                }
            );

            if (response.status === 401) {
                return null;
            }

            const data = await response.json();

            if ( response.status < 200 || response.status >=300 ) {
                throw data;
            }
            
            return data.data;
        } catch(error) {
            return null;
        }
    }

    async updateProfileData(data: UpdateProfileData): Promise<User> {
        const response = await this.fetch<Response>(
            `${this.apiUrl}/auth/me`,
            'PATCH',
            undefined,
            data,
            {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        );

        const responseData = await response.json();

        if (response.status <200 || response.status >= 300){
            throw responseData;
        }

        return responseData.data;
    }
}

export default new AuthService();