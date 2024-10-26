import React, { useContext, useState } from 'react';
import { SafeAreaView, TextInput, View, Image, Text, Pressable, ActivityIndicator, useWindowDimensions, ImageBackground } from 'react-native';
import { AuthContext } from '../core/context/authContext';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../core/context/themeContext';  // Ajusta la ruta del ThemeContext
import { Button, Snackbar } from 'react-native-paper';

export const LoginScreen = () => {
  const [identificador, setIdentificador] = useState('');
  const [contrasena, setContrasena] = useState('');
  const { handleLogin, loading } = useContext(AuthContext);
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const { theme, toogleThemeType, isDarkTheme, themeType } = useTheme();  // Extraemos el tema y el toggle
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false); // Estado inicial: Snackbar no visible

// Función para mostrar el Snackbar
const onLoginPress = () => {
  // Validación para el campo identificador
  if (!identificador) {
    setSnackbarMessage('El campo de identificador no puede estar vacío');
    setSnackbarVisible(true); // Mostrar el Snackbar con el mensaje de error
    return;
  }

  // Validación para el campo contraseña
  if (!contrasena || contrasena.length <= 4) {
    setSnackbarMessage(
      'La contraseña debe tener más de 4 caracteres y no puede estar vacía'
    );
    setSnackbarVisible(true); // Mostrar el Snackbar con el mensaje de error
    return;
  }

  // Si ambas validaciones pasan, ejecutar el login
  handleLogin(identificador, contrasena);
};
  // Definir punto de quiebre para pantallas medianas (tabletas)
  const isMediumScreen = width >= 768;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{
        flexDirection: isMediumScreen ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        backgroundColor: themeType === 'light' ? '#fff' : '#000' // Usar color del tema
        
      }}>
        {/* Sección del logo */}
        <View style={{
          flex: isMediumScreen ? 1 : 0,
          justifyContent: 'center',
          alignItems: 'center',
          width: isMediumScreen ? '40%' : '100%',
          height: isMediumScreen ? '100%' : 'auto',
          
          backgroundColor: isMediumScreen ? 'transparent' : theme.colors.surface
        }}>
          {isMediumScreen ? (
            <ImageBackground
              source={{uri:'https://img.freepik.com/vector-gratis/fondo-azul-degradado_23-2149337036.jpg'}}
              style={{
                flex: 5,
                justifyContent: 'center',
                alignItems: 'center',
                width: '140%',
                height: '100%',
                padding: 80
              }}
              resizeMode="cover"
            >
              <Image
                source={require("../assets/images/logo.png")}
                style={{ width: 100, height: 100, marginBottom: 20 }}
                resizeMode="contain"
              />
              <Text style={{ color: 'white', fontSize: 36, fontWeight: 'bold', textAlign: 'center', marginLeft: '20%' }}>
                Virgen Natividad
              </Text>
            </ImageBackground>
          ) : (
            <Image
              source={require("../assets/images/logo.png")}
              style={{ width: 100, height: 100, marginBottom: 20 }}
              resizeMode="contain"
            />
          )}
        </View>

        <View style={{
          flex: isMediumScreen ? 2 : 1,
          alignItems: 'center',
          width: isMediumScreen ? '60%' : '100%',
          padding: 24,
          backgroundColor: theme.colors.surface,  // Usar color del tema
          borderRadius: isMediumScreen ? 16 : 0,
          justifyContent: 'center',
          borderWidth: isMediumScreen ? 4 : 0,
          borderColor: isMediumScreen ? theme.colors.border : 'transparent',
          marginLeft: isMediumScreen ? 100 : 0,
          marginRight: isMediumScreen ? 100 : 0,
        }}>
          <Text style={{
            marginBottom: 16,
            fontSize: isMediumScreen ? 40 : 36,
            textAlign: 'center',
            color: isDarkTheme ? theme.colors.text : theme.colors.primary,  // Usar color del tema
            fontWeight: 'bold'
          }}
          
          >
            ¡Bienvenido de nuevo!
          </Text>

          <View style={{ width: '100%', marginBottom: 24 }}>
            <TextInput
              value={identificador}
              onChangeText={setIdentificador}
              style={{
                width: '100%',
                marginBottom: 12,
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.border,
                padding: 12,
                borderRadius: 16,
                color: isDarkTheme ? theme.colors.text : theme.colors.primary  // Usar color del tema
              }}
              
              placeholder="Nro. Documento"
              placeholderTextColor={ theme.colors.placeholder}  // Placeholder acorde al tema
            />
            <TextInput
              value={contrasena}
              onChangeText={setContrasena}
              style={{
                width: '100%',
                marginBottom: 12,
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.border,
                padding: 12,
                borderRadius: 16,
                color:  isDarkTheme ? theme.colors.text : theme.colors.primary
              }}
              
              placeholder="Contraseña"
              secureTextEntry
              placeholderTextColor={ theme.colors.placeholder}
            />
          </View>

          {/* Botón de iniciar sesión */}
          <Pressable
            style={{
              backgroundColor: theme.colors.primary,
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

          {/* Botón para alternar tema */}
          <Pressable
            style={{
              marginTop: 16,
              backgroundColor: isDarkTheme ? theme.colors.secondary : theme.colors.primary,
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 20
            }}
            onPress={toogleThemeType} 
             // Alterna entre los temas
            
          >
            <Text style={{ color: theme.colors.onPrimary, textAlign: 'center' }}>
              Cambiar a {isDarkTheme ? 'Modo Día' : 'Modo Noche'}
            </Text>
          </Pressable>
        </View>
      </View>
       {/* Snackbar */}
      {/* Snackbar */}
      <View
  style={{
    flex: 1, // Ocupa todo el espacio disponible
    justifyContent: 'center', // Centra verticalmente
    alignItems: 'center', // Centra horizontalmente
  }}
>
  <Snackbar
    visible={snackbarVisible}
    onDismiss={() => setSnackbarVisible(false)} // Ocultar el Snackbar
    duration={3000} // Duración de 3 segundos
    action={{
      label: 'Cerrar',
      onPress: () => setSnackbarVisible(false), // Acción para cerrar manualmente el Snackbar
    }}
    style={{
      width: '50%', // Establece el ancho del Snackbar
      alignSelf: 'center', // Asegura que el Snackbar esté centrado horizontalmente
    }}
  >
    {snackbarMessage}
  </Snackbar>
</View>
    </SafeAreaView>
  );
};
