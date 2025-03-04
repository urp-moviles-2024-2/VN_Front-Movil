import { useContext, useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Pressable, ActivityIndicator, ImageBackground, StatusBar } from 'react-native';
import { AuthContext } from '../core/context/authContext';
import { useTheme } from '../core/context/themeContext';
import { TextInput } from 'react-native-paper';
import { LoginRequest } from '../core/models/shared/login';
import { useNavigation } from '@react-navigation/native';
import { Logo } from '../shared/components/custom/logo/index'
import { CustomSnackbar } from '../shared/components/custom/snackbar';
import isMediumScreen from '../shared/constants/screen-width/md';

const imagenFondo = require('../assets/images/fondo.jpg');

export const LoginScreen = () => {
  const [identificador, setIdentificador] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [flatTextSecureEntry, setFlatTextSecureEntry] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false); 
  const [snackbarMessage, setSnackbarMessage] = useState(''); 
  const [loading, setLoading] = useState(false);
  const { handleLogin, error } = useContext(AuthContext);
  const { theme, themeType, isDarkTheme } = useTheme();
  const { navigation } = useNavigation();

  const onLoginPress = () => {
    setLoading(true)
    if (!identificador) {
      setSnackbarMessage('El Nro. Documento o Correo no puede estar vacío.');
      setSnackbarVisible(true);
      setLoading(false)
      return;
    }

    if (!contrasena) {
      setSnackbarMessage('La contraseña no puede estar vacía.');
      setSnackbarVisible(true);
      setLoading(false)
      return;
    }

    const loginRequestInstance = new LoginRequest(identificador, contrasena);

    handleLogin(loginRequestInstance, navigation)
  };

  useEffect(() => {
    if (error && error.response) {
      setLoading(false)
      setSnackbarMessage(error.response.data.message);
      setSnackbarVisible(true);
    }
  }, [error]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isMediumScreen ? "#000" : theme.colors.background }}>
      <StatusBar 
        barStyle={isMediumScreen ? 'light-content' : (themeType === 'light' ? 'dark-content' : 'light-content') } 
        backgroundColor={isMediumScreen ? '#000' : theme.colors.background} 
      />
      <View style={{
        flexDirection: isMediumScreen ? 'row' : 'column',
        height: '100%',
      }}>
        {/* Sección de Imagen */}
        <View style={{
          flex: isMediumScreen ? 1 : 0,
          justifyContent: 'center',
          alignItems: 'center',
          width: isMediumScreen ? '50%' : '100%',
          overflow: 'hidden'
        }}>
          {isMediumScreen &&
            <ImageBackground
              source={imagenFondo}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%'
              }}
              resizeMode="cover"
            >
              <Logo />
            </ImageBackground>
          }
        </View>

        {/* Sección de Color y Bienvenido */}
        <View style={{
          flex: isMediumScreen ? 1 : 1,
          alignItems: 'center',
          width: isMediumScreen ? '50%' : '100%',
          paddingHorizontal: 24,
          backgroundColor: theme.colors.surface,
          justifyContent: 'center',
        }}>
          {isMediumScreen ? (
            <Text style={{
              marginBottom: 16,
              fontSize: 36,
              textAlign: 'center',
              color: theme.colors.paperText,
              fontWeight: '500'
            }}>
              ¡Bienvenido de nuevo!
            </Text>
            ) : (
            <Logo />
          )}

          <View style={{ width: '100%', marginBottom: 40, marginTop: 20 }}>
            <TextInput
              label="Nro. de Documento o Correo"
              value={identificador}
              onChangeText={text => setIdentificador(text)}
              mode="outlined"
              right={
                <TextInput.Icon
                  icon={"account"}
                  color={theme.colors.customIcon}
                  size={24}
                />
              }
            />
            <View style={{ marginBottom: 15 }}></View>
            <TextInput
              label="Contraseña"
              value={contrasena}
              onChangeText={text => setContrasena(text)}
              mode="outlined"
              secureTextEntry={flatTextSecureEntry}
              right={
                <TextInput.Icon
                  icon={flatTextSecureEntry ? 'eye' : 'eye-off'}
                  onPress={() => setFlatTextSecureEntry(!flatTextSecureEntry)} 
                  forceTextInputFocus={false}
                  color={ isDarkTheme && theme.colors.customIcon}
                />
              }
            />
          </View>

          <Pressable
            style={{
              backgroundColor: theme.colors.loginButton,
              width: '100%',
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 50
            }}
            onPress={onLoginPress}
          >
            <Text style={{ color: theme.colors.onPrimary, fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
              Ingresar
            </Text>
          </Pressable>
        </View>
      </View>

      <CustomSnackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        message={snackbarMessage}
      />
    </SafeAreaView>
  );
};
