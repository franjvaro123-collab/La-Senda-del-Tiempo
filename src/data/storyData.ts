export type StorySpeakerId =
  | 'ejecutor'
  | 'viajero'
  | 'valkiria'
  | 'faraon'
  | 'centauro'
  | 'mago'
  | 'samurai'
  | 'druida';

export interface StoryDialogueLine {
  speakerId: StorySpeakerId;
  speakerName: string;
  roleTag: string;
  side: 'left' | 'right';
  text: string;
  lightning?: boolean;
}

export interface ChapterStoryBeat {
  key: string;
  chapterId: number;
  stageNum: number;
  title: string;
  lines: StoryDialogueLine[];
}

export const CAMPAIGN_STORY_BEATS: ChapterStoryBeat[] = [
  /* ===================== CAPÍTULO 1 ===================== */
  {
    key: 'ch1_s1',
    chapterId: 1,
    stageNum: 1,
    title: 'Los Portales Infinitos',
    lines: [
      {
        speakerId: 'ejecutor',
        speakerName: 'El Ejecutor',
        roleTag: 'Manipulador de los Portales',
        side: 'right',
        lightning: true,
        text: 'El tiempo jamás os perteneció. He quebrado el Nexo y abierto los portales infinitos para reescribir cada era bajo mi voluntad.',
      },
      {
        speakerId: 'viajero',
        speakerName: 'El Viajero',
        roleTag: 'Portador de la Senda',
        side: 'left',
        text: '¡Detente! Si sigues manipulando los portales, los siglos chocarán entre sí y desaparecerá todo lo que conocemos.',
      },
      {
        speakerId: 'ejecutor',
        speakerName: 'El Ejecutor',
        roleTag: 'Manipulador de los Portales',
        side: 'right',
        text: 'Entonces atraviesa este primer portal si te atreves. He corrompido a la guardiana de este cielo para que selle tu destino.',
      },
    ],
  },
  {
    key: 'ch1_s6',
    chapterId: 1,
    stageNum: 6,
    title: 'Ecos del Bastión',
    lines: [
      {
        speakerId: 'viajero',
        speakerName: 'El Viajero',
        roleTag: 'Portador de la Senda',
        side: 'left',
        text: 'La energía carmesí del Ejecutor se intensifica. Cada portal abierto alimenta una grieta aún mayor sobre la fortaleza.',
      },
      {
        speakerId: 'valkiria',
        speakerName: 'La Valkiria',
        roleTag: 'Guardiana Corrompida',
        side: 'right',
        text: 'El Ejecutor prometió una era eterna sin derrotas... Ningún viajero cruzará mi santuario con vida.',
      },
    ],
  },
  {
    key: 'ch1_boss',
    chapterId: 1,
    stageNum: 12,
    title: 'Juicio de la Valkiria',
    lines: [
      {
        speakerId: 'valkiria',
        speakerName: 'La Valkiria',
        roleTag: 'Jefe del Capítulo 1',
        side: 'right',
        lightning: true,
        text: 'Las cadenas del portal arden en mis alas. Demuéstrame si tu acero puede romper el hechizo del Ejecutor.',
      },
      {
        speakerId: 'viajero',
        speakerName: 'El Viajero',
        roleTag: 'Portador de la Senda',
        side: 'left',
        text: 'Te liberaremos de su control, Valkiria. ¡Cerraremos este primer portal ahora mismo!',
      },
    ],
  },

  /* ===================== CAPÍTULO 2 ===================== */
  {
    key: 'ch2_s1',
    chapterId: 2,
    stageNum: 1,
    title: 'Arenas Alteradas',
    lines: [
      {
        speakerId: 'ejecutor',
        speakerName: 'El Ejecutor',
        roleTag: 'Manipulador de los Portales',
        side: 'right',
        lightning: true,
        text: 'Impresionante... Pero solo cerraste una hebra. Mis portales infinitos ya devoran el reino del desierto eterno.',
      },
      {
        speakerId: 'viajero',
        speakerName: 'El Viajero',
        roleTag: 'Portador de la Senda',
        side: 'left',
        text: 'Las pirámides están suspendidas entre dos épocas. El Ejecutor está extrayendo el poder solar del antiguo Faraón.',
      },
    ],
  },
  {
    key: 'ch2_s8',
    chapterId: 2,
    stageNum: 8,
    title: 'Espejismo del Tiempo',
    lines: [
      {
        speakerId: 'faraon',
        speakerName: 'Faraón',
        roleTag: 'Soberano de las Dunas',
        side: 'right',
        text: 'El extranjero de la máscara oscura me mostró un imperio inmortal a través de los portales infinitos.',
      },
      {
        speakerId: 'viajero',
        speakerName: 'El Viajero',
        roleTag: 'Portador de la Senda',
        side: 'left',
        text: 'Te ha engañado, Faraón. El Ejecutor solo busca consumir tu reino para abrir el siguiente portal.',
      },
    ],
  },
  {
    key: 'ch2_boss',
    chapterId: 2,
    stageNum: 15,
    title: 'Trono del Sol Fracturado',
    lines: [
      {
        speakerId: 'faraon',
        speakerName: 'Faraón',
        roleTag: 'Jefe del Capítulo 2',
        side: 'right',
        lightning: true,
        text: 'Si mis arenas han de desvanecerse, que sea ante un digno rival. ¡Siente el peso de la pirámide eterna!',
      },
      {
        speakerId: 'viajero',
        speakerName: 'El Viajero',
        roleTag: 'Portador de la Senda',
        side: 'left',
        text: 'Resistiremos tu tormenta y romperemos el sello que el Ejecutor colocó sobre ti.',
      },
    ],
  },

  /* ===================== CAPÍTULO 3 ===================== */
  {
    key: 'ch3_s1',
    chapterId: 3,
    stageNum: 1,
    title: 'Bosque de Grietas',
    lines: [
      {
        speakerId: 'viajero',
        speakerName: 'El Viajero',
        roleTag: 'Portador de la Senda',
        side: 'left',
        text: 'Las llanuras salvajes están rodeadas de fisuras azules y carmesíes. El Ejecutor pasó por aquí hace apenas instantes.',
      },
      {
        speakerId: 'ejecutor',
        speakerName: 'El Ejecutor',
        roleTag: 'Manipulador de los Portales',
        side: 'right',
        lightning: true,
        text: 'Cada portal que destruyes abre dos más en las eras lejanas. Aquí la furia del Centauro aplastará tu esperanza.',
      },
    ],
  },
  {
    key: 'ch3_boss',
    chapterId: 3,
    stageNum: 11,
    title: 'Carga del Centauro',
    lines: [
      {
        speakerId: 'centauro',
        speakerName: 'Centauro',
        roleTag: 'Jefe del Capítulo 3',
        side: 'right',
        lightning: true,
        text: '¡La tormenta del Ejecutor ruge en mis venas! Nadie detendrá mi galope por estas tierras.',
      },
      {
        speakerId: 'viajero',
        speakerName: 'El Viajero',
        roleTag: 'Portador de la Senda',
        side: 'left',
        text: '¡Escuadrón, aguantad la embestida! Debemos despejar el portal hacia la Torre Astral.',
      },
    ],
  },

  /* ===================== CAPÍTULO 4 ===================== */
  {
    key: 'ch4_s1',
    chapterId: 4,
    stageNum: 1,
    title: 'La Torre Distorsionada',
    lines: [
      {
        speakerId: 'mago',
        speakerName: 'Mago',
        roleTag: 'Archimago de la Grieta',
        side: 'right',
        text: 'Fascinante... El Ejecutor ha enlazado los portales infinitos como un astrolabio viviente. ¡El fuego arcano jamás había ardido tan fuerte!',
      },
      {
        speakerId: 'viajero',
        speakerName: 'El Viajero',
        roleTag: 'Portador de la Senda',
        side: 'left',
        text: 'Esa energía está devorando la torre desde dentro. ¡No dejes que el Ejecutor use tu magia para abrir la brecha definitiva!',
      },
    ],
  },
  {
    key: 'ch4_s9',
    chapterId: 4,
    stageNum: 9,
    title: 'Núcleo de Tormenta',
    lines: [
      {
        speakerId: 'ejecutor',
        speakerName: 'El Ejecutor',
        roleTag: 'Manipulador de los Portales',
        side: 'right',
        lightning: true,
        text: 'Aún no comprendes la magnitud de los portales infinitos. Con el poder del Archimago, ninguna era volverá a conocer el amanecer.',
      },
      {
        speakerId: 'viajero',
        speakerName: 'El Viajero',
        roleTag: 'Portador de la Senda',
        side: 'left',
        text: 'No importa cuántos portales manipules, te perseguiremos hasta el último rincón del tiempo.',
      },
    ],
  },
  {
    key: 'ch4_boss',
    chapterId: 4,
    stageNum: 17,
    title: 'Cúspide del Archimago',
    lines: [
      {
        speakerId: 'mago',
        speakerName: 'Mago',
        roleTag: 'Jefe del Capítulo 4',
        side: 'right',
        lightning: true,
        text: '¡Contempla la llama de mil eras reunidas en un solo hechizo! Si sobrevives, el portal será tuyo.',
      },
      {
        speakerId: 'viajero',
        speakerName: 'El Viajero',
        roleTag: 'Portador de la Senda',
        side: 'left',
        text: '¡Rompamos el círculo arcano y avancemos tras el Ejecutor!',
      },
    ],
  },

  /* ===================== CAPÍTULO 5 ===================== */
  {
    key: 'ch5_s1',
    chapterId: 5,
    stageNum: 1,
    title: 'Luna sobre el Santuario',
    lines: [
      {
        speakerId: 'ejecutor',
        speakerName: 'El Ejecutor',
        roleTag: 'Manipulador de los Portales',
        side: 'right',
        lightning: true,
        text: 'Llegaste más lejos de lo previsto. Pero aquí aguarda el filo más letal que he rescatado de los portales infinitos: el Samurái.',
      },
      {
        speakerId: 'viajero',
        speakerName: 'El Viajero',
        roleTag: 'Portador de la Senda',
        side: 'left',
        text: 'Incluso bajo tu sombra, percibo su honor. Si logramos purificar su hoja, luchará a nuestro lado contra ti.',
      },
    ],
  },
  {
    key: 'ch5_boss',
    chapterId: 5,
    stageNum: 16,
    title: 'Filo del Honor',
    lines: [
      {
        speakerId: 'samurai',
        speakerName: 'Samurái',
        roleTag: 'Jefe del Capítulo 5',
        side: 'right',
        lightning: true,
        text: 'El Ejecutor ató mi alma a este portal carmesí. Desenvaina tu valor y corta las cadenas que me apresan.',
      },
      {
        speakerId: 'viajero',
        speakerName: 'El Viajero',
        roleTag: 'Portador de la Senda',
        side: 'left',
        text: '¡Con honor, Samurái! Liberaremos tu espíritu y marcharemos hacia el corazón del Nexo.',
      },
    ],
  },

  /* ===================== CAPÍTULO 6 ===================== */
  {
    key: 'ch6_s1',
    chapterId: 6,
    stageNum: 1,
    title: 'El Corazón del Nexo',
    lines: [
      {
        speakerId: 'ejecutor',
        speakerName: 'El Ejecutor',
        roleTag: 'Manipulador de los Portales',
        side: 'right',
        lightning: true,
        text: '¡Por fin ante el umbral de todos los portales infinitos! Desde este bosque ancestral colapsaré las seis eras en una sola corona oscura.',
      },
      {
        speakerId: 'viajero',
        speakerName: 'El Viajero',
        roleTag: 'Portador de la Senda',
        side: 'left',
        text: 'Tus manipulaciones terminan hoy, Ejecutor. Cada héroe que hemos liberado nos ha traído hasta aquí.',
      },
    ],
  },
  {
    key: 'ch6_s10',
    chapterId: 6,
    stageNum: 10,
    title: 'Raíces del Infinito',
    lines: [
      {
        speakerId: 'druida',
        speakerName: 'Druida',
        roleTag: 'Custodio del Nexo',
        side: 'right',
        text: 'El Ejecutor ha envenenado las raíces del tiempo. Solo quien supere mi prueba podrá sellar los portales infinitos.',
      },
      {
        speakerId: 'viajero',
        speakerName: 'El Viajero',
        roleTag: 'Portador de la Senda',
        side: 'left',
        text: 'No retrocederemos ahora. ¡Llevaremos el equilibrio de vuelta a la Senda del Tiempo!',
      },
    ],
  },
  {
    key: 'ch6_boss',
    chapterId: 6,
    stageNum: 20,
    title: 'El Último Portal',
    lines: [
      {
        speakerId: 'ejecutor',
        speakerName: 'El Ejecutor',
        roleTag: 'Manipulador de los Portales',
        side: 'right',
        lightning: true,
        text: '¡Aunque derrotes al Druida, los portales infinitos ya laten con mi oscuridad! ¡Veamos si tu escuadrón resiste el fin de las eras!',
      },
      {
        speakerId: 'druida',
        speakerName: 'Druida',
        roleTag: 'Jefe del Capítulo 6',
        side: 'right',
        text: 'El destino del Nexo se decide en este combate. ¡Desata toda tu fuerza, Viajero!',
      },
      {
        speakerId: 'viajero',
        speakerName: 'El Viajero',
        roleTag: 'Portador de la Senda',
        side: 'left',
        text: '¡Por todas las eras y por el futuro de la Senda, a la batalla final!',
      },
    ],
  },
];

export function getStoryBeatForStage(
  chapterId: number,
  stageNum: number
): ChapterStoryBeat | null {
  return (
    CAMPAIGN_STORY_BEATS.find(
      (b) => b.chapterId === chapterId && b.stageNum === stageNum
    ) || null
  );
}

export function getStoryBeatsForChapter(chapterId: number): ChapterStoryBeat[] {
  return CAMPAIGN_STORY_BEATS.filter((b) => b.chapterId === chapterId);
}
