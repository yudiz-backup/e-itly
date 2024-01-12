// ES6 module syntax
import LocalizedStrings from 'react-localization';
import English from './languages/english.js';
const Strings = new LocalizedStrings({
  en: English,
});
export { Strings };