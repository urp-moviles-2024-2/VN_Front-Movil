import React, { useState, useContext, useEffect } from 'react';
import { View, Text } from 'react-native';
import { AuthContext } from '../../../../core/context/authContext';
import { AsistenciaContext } from '../../../../core/context/asistenciaContext';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { CustomSelector } from '../../../../shared/components/custom/selector/index';
import { useTheme } from '../../../../core/context/themeContext';
import isMediumScreen from '../../../../shared/constants/screen-width/md';
import { ModalNuevaAsistencia } from '../../../../shared/components/modal/modal-asistencia/index';

export const GestionarAsistencia = () => {
  const [selectedSemana, setSelectedSemana] = useState();
  const { user } = useContext(AuthContext);
  const { semanas, fetchSemanas } = useContext(AsistenciaContext);
  const navigation = useNavigation();
  const { theme, themeType } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchSemanas();
  }, []);

  return (
    <View style={{ width: '100%', maxWidth: 1300, marginVertical: 15, marginHorizontal: 'auto' }}>
      <View
        style={{
          flexDirection: isMediumScreen ? 'row' : 'column',  
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 20,
          marginHorizontal: 20
        }}
      >
        <View style={{ display: 'flex', justifyContent: 'center', width: isMediumScreen ? '50%' : '100%'}}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: theme.colors.paperText }}>
            Sección: {user.perfil.seccion.nombre}
          </Text>
        </View>

        <CustomSelector
        
          opciones={semanas}
          selectedOption={selectedSemana}
          onSelect={(item) => setSelectedSemana(item)}
          placeholder="Semana"
          mobileWidth="20%"
        />

        <Button 
          icon="plus" 
          mode="contained" 
          style={{ width: isMediumScreen ? '25%' : '100%' }}
          buttonColor={theme.colors.primary}
          onPress={() => setModalVisible(true)}
        >
          Nueva Asistencia
        </Button>
      </View>

      <ModalNuevaAsistencia
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        seccion={user.perfil.seccion.nombre}
      />
    </View>
  );
};