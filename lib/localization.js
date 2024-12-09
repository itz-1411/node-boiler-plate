import fs          from "fs";
import { getPath } from "#lib/utils";


const languageStore    = {};
export const init = async ({ languages = ['en'] } = {}) => {
    for (const lang of languages) {
        try {
            const path  = getPath(`app/lang/${lang}.json`);
            languageStore[lang] = JSON.parse(fs.readFileSync(path, 'utf8'));
        } catch (error) {
            throw error;
        }
    }
}

const select = (lang) => languageStore[lang];
const defaultLang = 'en';

init();

export const translate = (message, params, language = defaultLang) => {
    if (message instanceof Function) {
        try{
            message = message(select(language));
        } catch(error){
            throw Error('Invalid localization key')
        }
    }

    if (!message) {
        throw Error('Invalid localization key')
    }

    for (const key in params) {
        if (Object.hasOwnProperty.call(params, key)) {
            message = message.replace(`[${key}]`, params[key])
        }
    }
    return message;
}


export default { translate, init }
