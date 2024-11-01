import { createContext, useState } from 'react';
import { getEstudiantesBySeccionRequest } from '../api/estudiantes';

export const EstudiantesContext = createContext();

export const EstudiantesProvider = ({ children }) => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getEstudiantesBySeccion = async (seccionId) => {
    setLoading(true);
    try {
      const { data } = await getEstudiantesBySeccionRequest(seccionId);
      const estudiantesOrdenados = data.sort((a, b) => 
        a.apellido.localeCompare(b.apellido)
      );
      setEstudiantes(estudiantesOrdenados);
    } catch (error) {
      console.log(error)
      setError(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <EstudiantesContext.Provider 
      value={{ 
        estudiantes, 
        getEstudiantesBySeccion, 
        loading, 
        error
      }}
    >
      {children}
    </EstudiantesContext.Provider>
  );
};