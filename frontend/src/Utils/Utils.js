import axios from 'axios';

export const getAllConfigurations = async () => {

    const domain = window.location.origin.split("//")[1];

    const cacheKey = `${domain}-configurations`;
    const cacheTimestampKey = `${domain}-configurationsTimestamp`;

    // Verifica se os dados estão em cache e se o cache ainda é válido (1 hora)
    const cachedData = localStorage.getItem(cacheKey);
    const cachedTimestamp = localStorage.getItem(cacheTimestampKey);

    if (cachedData && cachedTimestamp && Date.now() - parseInt(cachedTimestamp, 10) < 3600000) {
        return JSON.parse(cachedData);
    }

    // Se o cache estiver inválido, faz a solicitação ao servidor usando Axios
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/config/get-all`);
        const data = response.data.data;

        // Atualiza o cache com os novos dados e o carimbo de data/hora
        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(cacheTimestampKey, Date.now().toString());

        return data;
    } catch (error) {
        console.error('Erro ao obter configurações:', error);
        throw error;
    }
};

export const chunk = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );