import { COUNTRY_CURRENCY_MAP, TIMEZONE_COUNTRY_MAP, LOCALE_COUNTRY_MAP, LANGUAGE_COUNTRY_MAP } from "./maps.js";

const ext = globalThis.browser ?? globalThis.chrome;

// Função para detectar o país do usuário usando apenas recursos do navegador
function detectUserCountry() {
    try {
        // Método 1: Usar timezone do navegador (mais preciso)
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        if (TIMEZONE_COUNTRY_MAP[timezone]) {
            return TIMEZONE_COUNTRY_MAP[timezone];
        }
    } catch (error) {
        console.log("Erro ao detectar país via timezone:", error);
    }

    try {
        // Método 2: Usar o locale do navegador
        const locale = Intl.DateTimeFormat().resolvedOptions().locale;

        if (LOCALE_COUNTRY_MAP[locale]) {
            return LOCALE_COUNTRY_MAP[locale];
        }
    } catch (error) {
        console.log("Erro ao detectar país via locale:", error);
    }

    try {
        // Método 3: Usar navigator.language como fallback
        const language = navigator.language || navigator.userLanguage;
        if (language.includes("-")) {
            const countryCode = language.split("-")[1].toUpperCase();
            // Verificar se o código de país existe no nosso mapeamento
            if (COUNTRY_CURRENCY_MAP[countryCode]) {
                return countryCode;
            }
        }

        const languageCode = language.split("-")[0].toLowerCase();
        if (LANGUAGE_COUNTRY_MAP[languageCode]) {
            return LANGUAGE_COUNTRY_MAP[languageCode];
        }
    } catch (error) {
        console.log("Erro ao detectar país via language:", error);
    }

    // Fallback final: US como padrão
    return "US";
}

// Função para abrir doação do PayPal
function openDonation() {
    const countryCode = detectUserCountry();
    const currencyCode = COUNTRY_CURRENCY_MAP[countryCode] || "USD";

    const donationUrl = `https://www.paypal.com/donate/?cmd=_donations&business=S34UMJ23659VY&currency_code=${currencyCode}`;

    ext.tabs.create({ url: donationUrl });
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("startButton").addEventListener("click", function () {
        ext.runtime.sendMessage({ action: "removeFavoriteVideos" });
    });

    // Adicionar event listener para o botão de doação
    document.getElementById("donateButton").addEventListener("click", function () {
        openDonation();
    });
});
