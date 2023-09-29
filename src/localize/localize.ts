import * as en from './languages/en.json';
import * as nb from './languages/nb.json';
import * as es from './languages/es.json';
import * as de from './languages/de.json';
import * as sk from './languages/sk.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const languages: any = {
  en: en,
  es: es,
  nb: nb,
  de: de,
  sk: sk,
};

// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export function localize(string: string, search: string = '', replace: string = ''): string {
  const lang = (localStorage.getItem('selectedLanguage') || 'en').replace(/['"]+/g, '').replace('-', '_');

  let translated: string;

  try {
    translated = string.split('.').reduce((o, i) => o[i], languages[lang]);
  } catch (e) {
    translated = string.split('.').reduce((o, i) => o[i], languages['en']);
  }

  if (translated === undefined) translated = string.split('.').reduce((o, i) => o[i], languages['en']);

  if (search !== '' && replace !== '') {
    translated = translated.replace(search, replace);
  }
  return translated;
}
