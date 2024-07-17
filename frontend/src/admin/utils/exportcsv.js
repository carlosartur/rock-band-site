import api from '../api/api';

export const handleCsvExport = async (
  formData,
  lauchToast,
  setCsvLoading,
  urlCsv
) => {
  try {
    setCsvLoading(true);

    const response = await api.get(urlCsv, {
      params: formData,
    });
    
    const dispositionHeader = response.headers['content-disposition'];

    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.download = 'exported_data.csv';

    if (dispositionHeader) {
      const filenameMatch = dispositionHeader.match(/(?<=(filename\=))(.*)\.csv/);

      if (filenameMatch && filenameMatch[0]) {
        a.download = filenameMatch[0];
      }
    }

    a.href = url;
    a.click();
    window.URL.revokeObjectURL(url);

    setCsvLoading(false);
    lauchToast({
      message: 'Consulta exportada com sucesso!',
      color: 'success',
      visible: true,
    });
  } catch (error) {
    setCsvLoading(false);

    console.error('Erro ao buscar resultados:', error);
    lauchToast({
      message: 'Erro ao exportar consulta!',
      color: 'danger',
      visible: true,
    });
  }
};
