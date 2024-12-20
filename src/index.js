import { ThemeContextProvider } from './core/context/themeContext';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './core/context/authContext';
import { HorariosProvider } from './core/context/horariosContext';
import { AsistenciaProvider } from './core/context/asistenciaContext';
import { EstudiantesProvider } from './core/context/estudiantesContext';
import { ProtectedRoute } from './core/context/protectedRoute';
import { LoginScreen } from './auth/index';
import { ApoderadosProvider } from './core/context/apoderadosContext';
import { NotasProvider } from './core/context/notasContext';
import { PeriodoProvider } from './core/context/periodoContext';
import { PagosProvider } from './core/context/pagosContext';
import SweetAlert from './shared/components/custom/swal';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PagosProvider>
      <ThemeContextProvider>
        <AuthProvider>
          <HorariosProvider>
            <AsistenciaProvider>
              <EstudiantesProvider>
                <ApoderadosProvider>
                  <NotasProvider>
                    <PeriodoProvider>
                      <SweetAlert />
                      <Stack.Navigator initialRouteName="Drawer" screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Drawer" component={ProtectedRoute} />
                      </Stack.Navigator>
                    </PeriodoProvider>
                  </NotasProvider>
                </ApoderadosProvider>
              </EstudiantesProvider>
            </AsistenciaProvider>
          </HorariosProvider>
        </AuthProvider>
      </ThemeContextProvider>
    </PagosProvider>
  );
}