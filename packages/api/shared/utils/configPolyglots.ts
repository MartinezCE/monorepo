import Polyglot from 'node-polyglot';
import { DEFAULT_LOCALE } from '../config/locale';

export const configPolyglots = (app, messages) => {
  const polyglots = Object.entries(messages).reduce((acc, [locale, phrases]) => {
    acc[locale] = new Polyglot({ phrases, locale });
    return acc;
  }, {} as { [k in keyof typeof messages]: Polyglot });

  app.use((req, _, next) => {
    req.polyglots = polyglots;
    req.lang = DEFAULT_LOCALE;
    next();
  });
};
