// contar el total de respuestas haciendo un group by de una pregunta obligatoria + count

/* QUESTION TYPES */
export enum QuestionTypes {
  EMAIL = 'email',
  MULTIPLE_CHOICE = 'multiple_choice',
  OPINION_SCALE = 'opinion_scale',
  SHORT_TEXT = 'short_text',
}

/* QUESTIONS */

export const NAME = {
  q: 'Antes de empezar, ¿podemos saber tu *nombre*?',
  type: QuestionTypes.SHORT_TEXT,
};

export const ADRESS = {
  q: '¿Y tu dirección de *email laboral*?',
  type: QuestionTypes.EMAIL,
};

export const AVREAGE_TIME_WORKING_FROM_OFFICE = {
  q: 'En promedio, ¿cuántos días a la semana has trabajado desde la oficina en los últimos 2 meses?',
  type: QuestionTypes.MULTIPLE_CHOICE,
  options: ['1', '2', '3', '4', '5', 'menos de una vez por semana', 'Nunca'],
};

export const AVREAGE_TIME_WORKING_FROM_HOME = {
  q: 'En promedio, ¿cuántos días a la semana has trabajado desde tu casa en los últimos 2 meses?',
  type: QuestionTypes.MULTIPLE_CHOICE,
  options: ['1', '2', '3', '4', '5', 'menos de una vez por semana', 'Nunca'],
};

export const AVREAGE_TIME_WORKING_FROM_ANYWHERE = {
  q: 'En promedio, ¿cuántos días a la semana has trabajado desde algún lugar que no sea tu casa o la oficina en los últimos 2 meses?',
  type: QuestionTypes.MULTIPLE_CHOICE,
  options: ['1', '2', '3', '4', '5', 'menos de una vez por semana', 'Nunca'],
};

export const MISS_FROM_OFFICE_WHEN_WORKING_FROM_HOME = {
  q: 'Como rara vez o nunca trabajas desde la oficina de tu empresa, ¿hay algo que extrañes cuando trabajas desde casa o en otro lugar?',
  type: QuestionTypes.MULTIPLE_CHOICE,
  options: [
    'Salas de reuniones',
    'Phone booths',
    'Restaurantes y locales de cercanía',
    'Confort',
    'Eventos y charlas',
    'Espacios para trabajar de manera concentrada',
    'Networking',
    'Acceso a terrazas, jardines',
    'No hay nada que extrañe',
    'Otro',
  ],
};

export const LIKE_ABOUT_WORKING_FROM_OFFICE = {
  q: '¿Qué es lo que más te gusta de trabajar en la oficina?',
  type: QuestionTypes.MULTIPLE_CHOICE,
  options: [
    'Salas de reuniones',
    'Phone booths',
    'Restaurantes y locales de cercanía',
    'Comfort',
    'Eventos y charlas',
    'Espacios para trabajar de manera concentrada',
    'Networking',
    'Acceso a terrazas, jardines',
    'No hay nada que me gusta',
    'Otro',
  ],
};

export const NOT_LIKE_ABOUT_WORKING_FROM_OFFICE = {
  q: '¿Qué es lo que menos te gusta, si es que hay algo, de trabajar desde la oficina de tu compañía?  ',
  type: QuestionTypes.MULTIPLE_CHOICE,
  options: [
    'El viaje',
    'Falta de productividad',
    'Impacto ambiental',
    'Impacto financiero',
    'Menos flexibilidad',
    'Impacto en salud mental',
    'No hay nada que no me guste',
    'Otro',
  ],
};

export const LIKE_ABOUT_WORKING_HOME = {
  q: '¿Qué es lo que más te gusta de trabajar en tu casa?',
  type: QuestionTypes.MULTIPLE_CHOICE,
  options: [
    'No viajar',
    'Mayor productividad y concentración',
    'Poco impacto ambiental',
    'Impacto financiero',
    'Compartir tiempo con familia y seres queridos',
    'Más flexibilidad en el cuidado de niños y cuidado personal',
    'Más flexibilidad en la vida personal en general',
    'Impacto en salud mental',
    'Impacto en salud física',
    'No hay nada que me guste',
    'Otro',
  ],
};

export const NOT_LIKE_ABOUT_WORKING_HOME = {
  q: '¿Qué es lo que menos te gusta de trabajar en tu casa?',
  type: QuestionTypes.MULTIPLE_CHOICE,
  options: [
    'Falta de interacción social',
    'Internet y problemas de tecnología',
    'Falta de equipamiento (Monitores, impresoras, etc)',
    'Ausencia de balance entre vida y trabajo',
    'Distracciones',
    'Mala comunicación con el equipo',
    'Impacto en salud mental',
    'Impacto en salud física',
    'No hay nada que no me guste',
    'Otro',
  ],
};

export const WHY_CHOSE_WORK_FROM_OTHER_PLACE = {
  q: '¿Por qué a veces trabajas en lugares que no son ni la oficina ni tu hogar?',
  type: QuestionTypes.MULTIPLE_CHOICE,
  options: [
    'Para salir de casa',
    'Para estar con mi equipo',
    'Para reunirme con clientes',
    'Para acceder a salas de reuniones y otras facilidades',
    'Para cambiar de escenario',
    'Otro',
  ],
};

export const SATISFACTION_OF_WORKING_SPACES = {
  q: 'Teniendo en cuenta todos los espacios en los que trabajas hoy en día, ¿cuán satisfecho estás en general?',
  type: QuestionTypes.OPINION_SCALE,
};

export const COMPANY_SHOULD_HAVE_AN_OFFICE = {
  q: '¿Crees que tu compañía debería tener una oficina de algún tipo?',
  type: QuestionTypes.MULTIPLE_CHOICE,
};

export const WHY_COMPANY_SHOULD_NOT_HAVE_AN_OFFICE = {
  q: '¿Por qué no?',
  type: QuestionTypes.SHORT_TEXT,
};

export const WHAT_WOULD_YOU_LIKE_AN_OFFICE_FOR = {
  q: '¿Para qué te gustaría una oficina?',
  type: QuestionTypes.MULTIPLE_CHOICE,
  options: [
    'Para llevar a cabo tareas regulares',
    'Recibir clientes',
    'Reuniones internas',
    'Hacer sociales con el equipo',
    'Eventos',
    'Cultura',
    'Colaboración',
  ],
};

export const DAYS_PER_WEEK_WOULD_LIKE_TO_WORK_FROM_OFFICE = {
  q: '¿Cuántos días por semana te gustaría trabajar desde la oficina?',
  type: QuestionTypes.MULTIPLE_CHOICE,
  options: ['1', '2', '3', '4', '5', 'menos de una vez por semana', 'Solo cuando me necesiten'],
};

export const ITEMS_WOULD_LIKE_TO_HAVE_IN_OFFICE = {
  q: '¿Cuáles de todos estos items te gustaría tener en la oficina de tu empresa? ',
  type: QuestionTypes.MULTIPLE_CHOICE,
  options: [
    'Guardería',
    'Lockers',
    'Fruta y snacks gratis',
    'Duchas',
    'Luz natural',
    'Estacionamiento de bicicletas',
    'Gimnasio',
    'Terraza',
    'Acceso 24hs',
    'Salón para eventos',
    'Pet Friendly',
    'Salas de reuniones',
    'Cafe',
    'Otros',
  ],
};

export const MIND_IF_OFFICE_IS_SHARED = {
  q: '¿Te molestaría que tu espacio en la oficina sea compartido con otras empresas?',
  type: QuestionTypes.MULTIPLE_CHOICE,
};

export const WOULD_LIKE_COMPANY_HAS_PART_TIME_OFFICE = {
  q: '¿Te gustaria que tu empresa tenga una oficina part time?',
  type: QuestionTypes.MULTIPLE_CHOICE,
};

export const WOULD_NOT_LIKE_HOT_DESK_MODE = {
  q: '¿Tendrías algún problema en tener la modalidad "hot desk" , en el cual no tengas un escritorio exclusivo?',
  type: QuestionTypes.MULTIPLE_CHOICE,
};

export const IDEAL_NUMBER_OF_DAYS_WORK_FROM_HOME = {
  q: 'Idealmente ¿Cuántos días por semana te gustaría trabajar desde casa?',
  type: QuestionTypes.MULTIPLE_CHOICE,
  options: ['1', '2', '3', '4', '5', 'menos de una vez por semana', 'Nunca'],
};

export const WORK_FROM_HOME_WHITHOUT_MAKING_CHANGES = {
  q: '¿Crees que podrías continuar trabajando desde casa indefinidamente sin hacer ningún cambio en tu equipamiento y ambiente?',
  type: QuestionTypes.MULTIPLE_CHOICE,
};

export const WORK_FROM_ANYWHERE_IF_COMPANY_PAYS = {
  q: 'Si tu compañía se hiciera cargo, te gustaría trabajar desde un espacio de cowork que no sea la oficina central?',
  type: QuestionTypes.MULTIPLE_CHOICE,
};

export const HOW_MANY_DAYS_WORK_FROM_ANYWHERE = {
  q: '¿Cuántos días por semana te gustaría trabajar desde algún lugar que no sea ni la oficina ni tu casa?',
  type: QuestionTypes.MULTIPLE_CHOICE,
  options: ['1', '2', '3', '4', '5', 'menos de una vez por semana', 'Nunca'],
};

export const WHERE_WOULD_YOU_LIKE_COWORK_SPACE_TO_BE_LOCATED = {
  q: '¿Dónde te gustaría que fuera este espacio de cowork?',
  type: QuestionTypes.MULTIPLE_CHOICE,
  options: [
    'Cerca de casa',
    'Cerca de donde necesite estar determinado día',
    'En cualquier lugar de fácil acceso',
    'Otro',
  ],
};

export const SOMETHING_TO_SHARE = {
  q: 'Por último, ¿hay algo más que te gustaría compartirnos sobre tu escenario ideal de trabajo?',
  type: QuestionTypes.SHORT_TEXT,
};
