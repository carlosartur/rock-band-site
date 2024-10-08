import axios from 'axios';

/**
 * Returns all configurations from backend
 * @returns {Object}
 */
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

/**
 * Returns a configuration by it's slug
 * @returns {Object}
 */
export const getOneConfiguration = async (slug) => {
    const configs = await getAllConfigurations();

    if (configs[slug]) {
        return configs[slug];
    }

    for (let config of configs) {
        if (config.slug === slug) {
            return config;
        }
    }

    console.log(`Configuration ${slug} not found.`);

    return  {
        "id": 0,
        "name": slug,
        "slug": slug,
        "value": "",
        "default_value": "",
        "type": "text",
        "value_translated": "",
        "default_value_translated": ""
    }
};

/**
 * Chunk a array in pieces of same size (or smaller if last piece haven't enought elements)
 * @param {Array} arr 
 * @param {Number} size 
 * @returns 
 */
export const chunk = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );

/**
 * Remove all html tags and limit length of a html
 * @param {String} html 
 * @param {Number} maxLength 
 * @returns 
 */
export const showDescriptionResume = (html, maxLength = 100) => {
    const tempElement = document.createElement('div');

    tempElement.innerHTML = html;

    const textWords = tempElement
        .textContent
        .replaceAll('\n', '')
        .replace(/\s{2,}/g, ' ')
        .trim();

    return stringLimit(textWords, maxLength);
}

/**
 * 
 * @param {String} str 
 * @param {Number} maxLength 
 * @returns 
 */
export const stringLimit = (str, maxLength = 100) => {
    if (!str.includes(" ")) {
        let suffix = "";

        if (str.length > maxLength) {
            suffix = " ...";
        }

        return str.substring(0, maxLength) + suffix;
    }

    const textWords = str.split(' ');
    
    let result = '';

    for (const word of textWords) {
        if (result.length > maxLength) {
            return result + ' ...';
        }

        result += word + ' ';
    }

    return result.trim();
}