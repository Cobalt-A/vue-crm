import store from '../store'
import ru from '../locales/ru.json'
import en from '../locales/en.json'

const locales = {
  'ru-RU': ru,
  'en-US': en
}

export default function localizeFilter(key) {
  let locale = store.getters.info.locale || 'ru-RU'
  const userLang = navigator.language || navigator.userLanguage;
  if ((userLang == "en" || userLang == "en-US") && !store.getters.info.locale) {
    locale = "en-US"
  }
  return locales[locale][key] || `[Localize error key [${key}] not found]`
}