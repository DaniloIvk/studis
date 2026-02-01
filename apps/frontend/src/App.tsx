import { withTranslation } from 'react-i18next';
import AppRoutes from './routes/AppRoutes';

function App() {
  return <AppRoutes />;
}

export default withTranslation()(App);
