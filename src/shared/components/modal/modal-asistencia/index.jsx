import { View, Text, Modal, ScrollView, SafeAreaView, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { useTheme } from '../../../../core/context/themeContext';
import { CustomSelector } from '../../custom/selector/index';
import { AsistenciaContext } from '../../../../core/context/asistenciaContext';
import { AuthContext } from '../../../../core/context/authContext';
import { Button, ProgressBar, DataTable } from 'react-native-paper';
import { EstudiantesContext } from '../../../../core/context/estudiantesContext';
import { CustomRadio } from '../../custom/radio-button/index';
import { CustomSnackbar } from '../../custom/snackbar/index'; 
import isMediumScreen from '../../../constants/screen-width/md';
import DatePicker from 'react-native-modern-datepicker';
import formatDate from '../../../constants/dates/format-date';
import formatMonth from '../../../constants/dates/format-month';

export const ModalNuevaAsistencia = ({ modalVisible, setModalVisible, seccion, dataType }) => {
  const { 
    semanas, 
    fetchSemanas, asistencias,
    loading, createAsistencia, 
    getResumenAsistencia, 
    resumenAsistencia,
    createResumenAsistencia,
    getAsistenciasBySeccionFecha,
  } = useContext(AsistenciaContext);

  const { user } = useContext(AuthContext);
  const { getEstudiantesBySeccion, estudiantes } = useContext(EstudiantesContext);
  const { theme, isDarkTheme } = useTheme();

  const [selectedSemana, setSelectedSemana] = useState();
  const [seccionId, setSeccionId] = useState(null);
  const [asistencia, setAsistencia] = useState([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false); 
  const [snackbarMessage, setSnackbarMessage] = useState(''); 
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    fetchSemanas();
    setSeccionId(user.perfil.seccion._id);
  }, [user]);

  useEffect(() => {
    if (seccionId) {
      getEstudiantesBySeccion(seccionId);
    }
  }, [seccionId]);

  useEffect(() => {
    if (dataType === 'edit') {
      console.log()
      getAsistenciasBySeccionFecha(resumenAsistencia.seccion._id, resumenAsistencia.fecha);
    }
  }, [dataType]);

  const handleRadioChange = (index, tipo) => {
    const newAsistencia = [...asistencia];
    newAsistencia[index] = tipo;
    setAsistencia(newAsistencia);
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(new Date(date));
    hideDatePicker();
  };

  const guardarInformacion = async () => {
    if (dataType === 'create') {
      if (!selectedSemana) {
        setSnackbarMessage('Por favor, selecciona una semana.');
        setSnackbarVisible(true);
        return;
      }

      const todosSeleccionados = asistencia.every(estado => estado !== "");
      if (!todosSeleccionados) {
        setSnackbarMessage('Debe seleccionar la asistencia de todos los estudiantes');
        setSnackbarVisible(true);
        return;
      }

      const promises = estudiantes.map(async (estudiante, index) => {
        const registro = {
          estudiante_id: estudiante._id,
          seccion_id: estudiante.seccion._id,
          grado_id: estudiante.grado._id,
          periodo_id: estudiante.periodo._id,
          semana_id: selectedSemana._id,
          fecha: formatDate(selectedDate),
          mes: formatMonth(selectedDate), 
          estado: asistencia[index]
        };

        const response = await createAsistencia(registro);

        if (index === 0) {
          const response2 = await getResumenAsistencia(response.data.seccion._id, response.data.fecha);
          data = {
            semana_id: response.data.semana._id,
            seccion_id: response.data.seccion._id,
            fecha: response2.data.fecha,
            presentes: response2.data.totalPresentes,
            faltas: response2.data.totalFaltas,
            justificadas: response2.data.totalJustificados,
          }
          createResumenAsistencia(data)
        }
      });

      setModalVisible(false);

      try {
        await Promise.all(promises);
        setSnackbarMessage("asistencia guardada :D");
        setSnackbarVisible(true);
      } catch (error) {
        console.error("Hubo un error al registrar la asistencia:", error);
      }
    }
    if (dataType === 'edit') {
      console.log('Editar asistencia');
    }
  };

  if (loading) {
    return <ProgressBar indeterminate />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <View
            style={{
              width: isMediumScreen ? '60%' : '90%',
              height: '82%',
              padding: 20,
              backgroundColor: theme.colors.modalBackground,
              borderRadius: 10,
            }}
          >
            <ScrollView style={{ flex: 1 }} vertical>
              <ScrollView horizontal>
                <View style={{ width: 940 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      marginBottom: 15,
                      fontWeight: '700',
                      color: theme.colors.paperText,
                    }}
                  >
                    Sección: {seccion}
                  </Text>
                <View style={{zIndex: 2}}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <Text style={{ color: theme.colors.paperText }}>Semana: </Text>
                      
                    <CustomSelector
                      opciones={semanas}
                      selectedOption={selectedSemana}
                      onSelect={(item) => setSelectedSemana(item)}
                      placeholder="Semana"
                      mobileWidth="20%"
                      isModal={true}
                    />

                    <TouchableOpacity 
                      onPress={showDatePicker} 
                      style={{ 
                        marginLeft: 10, 
                        zIndex: 25,
                        padding: 15,
                        backgroundColor: isDarkTheme ? '#363636' : '#E0E0E0', 
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: isDarkTheme ? '#777' : '#C0C0C0', 
                      }}
                    >
                      <Text style={{ color: theme.colors.paperText }}>
                      Fecha: {formatDate(selectedDate)}
                      </Text>
                    </TouchableOpacity>

                    {isDatePickerVisible && (
                      <Modal
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                        transparent={true}
                        animationType="fade"
                        visible={isDatePickerVisible}
                        onRequestClose={hideDatePicker}
                      >
                        <SafeAreaView 
                          style={{ 
                            flex: 1, 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            width: 400
                          }}
                        >
                          <TouchableWithoutFeedback>
                            <View 
                              style={{ 
                                backgroundColor: 'white', 
                                padding: 5, borderRadius: 10,
                                alignItems: 'center', 
                                width: '70%',
                                zIndex: 25 
                              }}
                            >
                              <DatePicker
                                selected={selectedDate.toISOString()}
                                onDateChange={handleDateChange}
                                mode="calendar"
                              />
                              <Button mode="contained" onPress={hideDatePicker}>
                                Cerrar
                              </Button>
                            </View>
                          </TouchableWithoutFeedback>
                        </SafeAreaView>
                      </Modal>
                    )} 
                    </View>
                  </View>

                  <View
                    style={{
                      backgroundColor: theme.colors.tableBackgroundColor,
                      borderWidth: 1,
                      borderColor: 'rgb(192, 192, 192)',
                      borderRadius: 8,
                      justifyContent: 'center',
                      marginTop: 25,
                      width: '100%',
                    }}
                  >
                    {estudiantes && estudiantes.length > 0 ? (
                      <DataTable>
                        <DataTable.Header>
                          <DataTable.Title style={{ flex: 2 }}>Apellidos y Nombres</DataTable.Title>
                          <DataTable.Title style={{ flex: 2, justifyContent: 'center' }}>Estado de Asistencia</DataTable.Title>
                        </DataTable.Header>
                        {estudiantes.map((item, index) => (
                          <DataTable.Row key={index}>
                            <DataTable.Cell style={{ flex: 2 }}>
                              {item.apellido}, {item.nombre}
                            </DataTable.Cell>
                            <DataTable.Cell style={{ flex: 2 }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                                <CustomRadio
                                  options={[
                                    { label: 'Presente', value: 'Presente' },
                                    { label: 'Falta', value: 'Falta' },
                                    { label: 'Justificado', value: 'Justificado' },
                                  ]}
                                  checkedValue={asistencia[index]}
                                  onChange={(value) => handleRadioChange(index, value)}
                                />
                              </View>
                            </DataTable.Cell>
                          </DataTable.Row>
                        ))}
                      </DataTable>
                    ) : (
                      <Text>No hay datos de asistencia.</Text>
                    )}
                  </View>

                  <View style={{ width: '100%', marginTop: 25 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                      <Button
                        mode="contained"
                        title="Registrar Asistencia"
                        onPress={() => {
                          guardarInformacion();
                        }}
                      >
                        Registrar Asistencia
                      </Button>
                      <Button
                        mode="contained"
                        title="Cerrar"
                        onPress={() => setModalVisible(false)}
                        style={{ marginRight: 10 }}
                      >
                        Cerrar
                      </Button>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </ScrollView>
            {snackbarVisible && (
              <View style={{ marginBottom: -20 }}>
                <CustomSnackbar
                  visible={snackbarVisible}
                  onDismiss={() => setSnackbarVisible(false)}
                  message={snackbarMessage}
                />
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};