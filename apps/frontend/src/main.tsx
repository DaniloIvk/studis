import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import i18n from './i18n';
import App from './App';
import PopupProvider from './components/context/PopupProvider';
import LoadingProvider from './components/context/LoadingProvider';
import QueryProvider from './components/context/QueryProvider';
import ZodProvider from './components/context/ZodProvider';
import { AuthProvider } from './core/context/AuthContext';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<I18nextProvider i18n={i18n}>
				<QueryProvider>
					<ZodProvider>
						<LoadingProvider>
							<PopupProvider>
								<AuthProvider>
									<App />
								</AuthProvider>
							</PopupProvider>
						</LoadingProvider>
					</ZodProvider>
				</QueryProvider>
			</I18nextProvider>
		</BrowserRouter>
	</StrictMode>,
);
