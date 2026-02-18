import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../core/context/AuthContext';
import AuthService, {
	type UpdateProfileData,
} from '../core/service/AuthService';
import Form from '../components/form/Form';
import { getFormConfig } from '../validation/schemas/forms/User.schema';

function MyProfile() {
	const { t } = useTranslation();
	const { user, refreshUser } = useAuth();

	const defaultValues = useMemo(() => {
		if (!user) return {};

		return {
			role: user.role || '',
			firstName: user.firstName || '',
			lastName: user.lastName || '',
			email: user.email || '',
			phoneNumber: user.phoneNumber || '',
			address: user.address || '',
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		} as Record<string, string>;
	}, [user]);

	const onSubmit = async (data: any) => {
		const payload: UpdateProfileData = {
			firstName: data.firstName,
			lastName: data.lastName,
			phoneNumber: data.phoneNumber,
			address: data.address,
		};

		if (data.newPassword) {
			payload.currentPassword = data.currentPassword;
			payload.newPassword = data.newPassword;
		}

		await AuthService.updateProfileData(payload);

		await refreshUser();
	};

	if (!user) return null;

	return (
		<div className='w-full h-full overflow-y-auto bg-light! dark:bg-dark! text-dark! dark:text-light! flex flex-col justify-center items-center content-stretch gap-8 transition-colors duration-500 py-12 px-6 lg:px-32'>
			<h1 className='text-3xl font-extrabold'>{t('my_profile')}</h1>

			<Form
				defaultValues={defaultValues}
				onSubmit={onSubmit}
				showSubmit={true}
				showReset={true}
				submitButtonText='buttons.update_profile'
				className='h-fit!'
				{...getFormConfig(user.role as any)}
			/>
		</div>
	);
}

export default MyProfile;
