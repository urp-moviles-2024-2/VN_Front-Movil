import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, ImageBackground, TouchableOpacity, Image, Platform } from 'react-native';
import { AuthContext } from '../../../../core/context/authContext';
import React, { useContext, useState } from 'react';
import { Switch } from 'react-native-paper';
import { useTheme } from '../../../../core/context/themeContext';
import { Ionicons } from '@expo/vector-icons';

const CustomDrawer = (props) => {
  const { user, handleLogout } = useContext(AuthContext);
  const { theme, toogleThemeType } = useTheme();
  const defaultImage = require('../../../../assets/images/default-profile.jpg');
  const [isSwitchOn, setIsSwitchOn] = useState(theme === 'dark');
  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
    toogleThemeType();
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <ImageBackground style={{ paddingStart: 10, paddingBottom: 10, marginTop: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={{ marginBottom: 10, height: 80, width: 80, borderRadius: 40 }}
              source={user.perfil.multimedia ? { uri: user.perfil.multimedia.url } : defaultImage}
            />
            <View style={{ marginLeft: 15 }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              {isSwitchOn ? 'Tema: Claro' : 'Tema: Oscuro'}
            </Text>
              <Switch 
                color='#9ca3af'
                value={isSwitchOn}
                onValueChange={onToggleSwitch}
                style={{
                  marginRight: Platform.OS === 'android' ? 45 : 0,
                  marginTop: Platform.OS === 'android' ? 0 : 5,
                }}
              />
            </View>
          </View>
          <Text style={{ color: 'white' }}>
            {user.perfil.nombre} {user.perfil.apellido}
          </Text>
          <Text style={{ color: '#9ca3af' }}>
            {user.rol}
          </Text>
        </ImageBackground>
        <View style={{ paddingBottom: 5 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{ marginBottom:15 ,padding: 20, borderTopWidth: 1, borderTopColor: '#ccc' }}>
        <TouchableOpacity onPress={() => handleLogout()}>
          <View style={{flexDirection:'row',alignItems:'center'}}>
          <Ionicons name="log-out-outline" size={22} color="white" style={{marginRight:30}} />
          <Text style={{ fontSize:16, color: 'white', fontWeight:'bold',lineHeight: 22}}>Cerrar Sesión</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default CustomDrawer;
