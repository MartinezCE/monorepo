import { format } from 'date-fns';
import { toDate } from 'date-fns-tz';
import { es } from 'date-fns/locale';
import { toast } from 'react-toastify';

export const surveyDateToString = (date: Date) => {
  const parsedDate = toDate(date);
  const [day, month, year] = format(parsedDate, 'dd MMMM yyyy', { locale: es }).split(' ');
  return `${day} de ${month} ${year}`;
};

export const copyLinkToClipboard = (link: string) =>
  navigator.clipboard.writeText(link).then(() => toast.success('Link copiado al portapapeles'));
