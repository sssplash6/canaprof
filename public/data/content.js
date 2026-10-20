// Report copy for the career orientation test. Every human-readable string is { ru, en }.

// Holland RIASEC types. keys R I A S E C
export const TYPES = {
  R: {
    name: { ru: 'Реалистичный', en: 'Realistic' },
    tagline: { ru: 'Техника, руки, результат, который можно потрогать', en: 'Tools, hands-on work and results you can touch' },
    hero: {
      ru: 'Ты лучше всего думаешь руками: тебе нравится собирать, чинить и видеть, как работает то, что сделано тобой.',
      en: 'You think best with your hands: you like building, fixing and seeing something you made actually work.',
    },
    blend: {
      ru: 'К этому добавляется практичность: идея для тебя ценна, когда её можно проверить на деле.',
      en: 'Add to that a practical streak: an idea matters to you once it can be tested for real.',
    },
    strengths: [
      { ru: 'Практичность', en: 'Practicality' },
      { ru: 'Работа с техникой', en: 'Technical skill' },
      { ru: 'Пространственное мышление', en: 'Spatial thinking' },
    ],
    fuel: {
      title: { ru: 'осязаемый результат', en: 'tangible results' },
      detail: { ru: 'Когда к концу дня есть вещь, которая работает, а не только план.', en: 'Ending the day with something that works, not just a plan.' },
    },
    drain: {
      title: { ru: 'долгая ручная работа', en: 'hours of manual work' },
      detail: { ru: 'Сборка, ремонт и настройка техники отнимают у тебя больше сил, чем у других.', en: 'Assembling, repairing and tuning equipment takes more out of you than most.' },
    },
  },
  I: {
    name: { ru: 'Исследовательский', en: 'Investigative' },
    tagline: { ru: 'Вопросы, факты и поиск того, как всё устроено', en: 'Questions, evidence and figuring out how things work' },
    hero: {
      ru: 'Тебе важно докопаться до сути: ты спрашиваешь «почему» и не успокаиваешься, пока ответ не выдержит проверку.',
      en: 'You want to get to the bottom of things: you keep asking why until you find an answer that holds up.',
    },
    blend: {
      ru: 'Плюс к этому в тебе живёт исследователь: мало знать, что работает, хочется понять почему.',
      en: 'There is also a researcher in you: knowing that something works is not enough, you want to know why.',
    },
    strengths: [
      { ru: 'Анализ', en: 'Analysis' },
      { ru: 'Критическое мышление', en: 'Critical thinking' },
      { ru: 'Любознательность', en: 'Curiosity' },
    ],
    fuel: {
      title: { ru: 'задачи без готового ответа', en: 'hard open problems' },
      detail: { ru: 'Когда нужно разобраться самостоятельно, а не повторить по образцу.', en: 'Working it out on your own instead of following a template.' },
    },
    drain: {
      title: { ru: 'долгий анализ без практики', en: 'theory with no practice' },
      detail: { ru: 'Часы над теорией и данными без видимого применения быстро гасят интерес.', en: 'Hours of theory and data with no visible use quickly wear down your interest.' },
    },
  },
  A: {
    name: { ru: 'Артистический', en: 'Artistic' },
    tagline: { ru: 'Идеи, образы и свобода делать по-своему', en: 'Ideas, images and the freedom to do it your way' },
    hero: {
      ru: 'Ты видишь мир через образы и идеи: тебе важно создавать что-то своё и выражать то, что трудно сказать прямо.',
      en: 'You see the world through images and ideas: you want to make things of your own and say what is hard to put plainly.',
    },
    blend: {
      ru: 'Ещё в тебе есть творческая жилка: ты ищешь неожиданный ход там, где другие идут привычным путём.',
      en: 'You also have a creative streak: you look for an unexpected angle where others take the usual route.',
    },
    strengths: [
      { ru: 'Воображение', en: 'Imagination' },
      { ru: 'Оригинальность', en: 'Originality' },
      { ru: 'Чувство стиля', en: 'Sense of style' },
    ],
    fuel: {
      title: { ru: 'свобода в подходе', en: 'creative freedom' },
      detail: { ru: 'Когда задача задаёт цель, но не диктует, как именно к ней прийти.', en: 'A brief that sets the goal but leaves the route up to you.' },
    },
    drain: {
      title: { ru: 'работа без чётких рамок', en: 'work without clear structure' },
      detail: { ru: 'Задания вида «придумай что-нибудь» без примеров и критериев выбивают из колеи.', en: 'Open "come up with something" tasks with no examples or criteria throw you off.' },
    },
  },
  S: {
    name: { ru: 'Социальный', en: 'Social' },
    tagline: { ru: 'Люди, общение и помощь, которая что-то меняет', en: 'People, conversation and help that makes a difference' },
    hero: {
      ru: 'Ты замечаешь, что чувствуют другие, и тебе по-настоящему важно, чтобы людям рядом с тобой становилось лучше.',
      en: 'You notice how other people feel, and you genuinely care that the people around you end up better off.',
    },
    blend: {
      ru: 'Кроме того, ты умеешь слышать людей: рядом с тобой команда легче договаривается и реже ссорится.',
      en: 'Beyond that, you know how to listen: teams around you talk more openly and argue less.',
    },
    strengths: [
      { ru: 'Эмпатия', en: 'Empathy' },
      { ru: 'Умение объяснять', en: 'Explaining clearly' },
      { ru: 'Работа в команде', en: 'Teamwork' },
    ],
    fuel: {
      title: { ru: 'прямая помощь людям', en: 'helping people directly' },
      detail: { ru: 'Когда видно, что твоя помощь или объяснение кому-то правда пригодились.', en: 'Seeing that your help or explanation actually made a difference to someone.' },
    },
    drain: {
      title: { ru: 'постоянная поддержка других', en: 'being everyone\'s support' },
      detail: { ru: 'Выслушивать, утешать и мотивировать других весь день тебе тяжелее, чем многим.', en: 'Listening to, comforting and motivating others all day tires you faster than most.' },
    },
  },
  E: {
    name: { ru: 'Предприимчивый', en: 'Enterprising' },
    tagline: { ru: 'Цели, влияние и идеи, доведённые до дела', en: 'Goals, influence and ideas turned into action' },
    hero: {
      ru: 'Ты любишь двигать дело вперёд: ставить цель, убеждать людей и принимать решение, когда другие сомневаются.',
      en: 'You like moving things forward: setting a goal, persuading people and making the call when others hesitate.',
    },
    blend: {
      ru: 'Вдобавок у тебя есть деловая хватка: тебе хватает решимости взять инициативу и увлечь других.',
      en: 'On top of that comes drive: you are willing to take the lead and bring others along.',
    },
    strengths: [
      { ru: 'Убеждение', en: 'Persuasion' },
      { ru: 'Инициатива', en: 'Initiative' },
      { ru: 'Решительность', en: 'Decisiveness' },
    ],
    fuel: {
      title: { ru: 'ответственность за результат', en: 'owning the outcome' },
      detail: { ru: 'Когда решение за тобой и видно, как твои шаги двигают проект.', en: 'When the call is yours and you can see your moves pushing the project ahead.' },
    },
    drain: {
      title: { ru: 'продажи и публичное убеждение', en: 'selling and persuading' },
      detail: { ru: 'Уговаривать, торговаться и выступать перед незнакомыми людьми тебе тяжело.', en: 'Pitching, negotiating and winning over strangers takes a lot out of you.' },
    },
  },
  C: {
    name: { ru: 'Конвенциональный', en: 'Conventional' },
    tagline: { ru: 'Порядок, точность и системы, которые работают', en: 'Order, accuracy and systems that run smoothly' },
    hero: {
      ru: 'Ты наводишь порядок там, где другие теряются: тебе нравятся понятные правила, точные цифры и дела, доведённые до конца.',
      en: 'You bring order where others get lost: you like clear rules, accurate numbers and tasks that are properly finished.',
    },
    blend: {
      ru: 'К тому же в тебе есть организованность: ты держишь в голове детали и сроки, о которых другие забывают.',
      en: 'Alongside this, you are organised: you keep track of the details and deadlines others forget.',
    },
    strengths: [
      { ru: 'Аккуратность', en: 'Accuracy' },
      { ru: 'Организованность', en: 'Organisation' },
      { ru: 'Надёжность', en: 'Reliability' },
    ],
    fuel: {
      title: { ru: 'понятная структура', en: 'clear structure' },
      detail: { ru: 'Когда есть план, правила и ясно, что считать хорошо сделанной работой.', en: 'Having a plan, clear rules and a shared idea of what good work looks like.' },
    },
    drain: {
      title: { ru: 'рутина и мелкие детали', en: 'routine and fine detail' },
      detail: { ru: 'Сверять таблицы, заполнять формы и следить за мелочами тебе скучно и тяжело.', en: 'Checking spreadsheets, filling in forms and tracking small details feels heavy to you.' },
    },
  },
};

// Archetype name = adjective of the SECOND type + noun of the FIRST type.
export const ARCHETYPE = {
  noun: { R: { ru: 'мастер', en: 'builder' }, I: { ru: 'аналитик', en: 'analyst' }, A: { ru: 'творец', en: 'creator' }, S: { ru: 'наставник', en: 'mentor' }, E: { ru: 'лидер', en: 'leader' }, C: { ru: 'организатор', en: 'organiser' } },
  adj:  { R: { ru: 'Практичный', en: 'Hands-on' }, I: { ru: 'Вдумчивый', en: 'Analytical' }, A: { ru: 'Творческий', en: 'Imaginative' }, S: { ru: 'Чуткий', en: 'Caring' }, E: { ru: 'Смелый', en: 'Bold' }, C: { ru: 'Точный', en: 'Precise' } },
};

// Big Five. keys O C E A N. Levels: low (<40%), mid (40-60%), high (>60%).
export const TRAITS = {
  O: {
    name: { ru: 'Открытость опыту', en: 'Openness' },
    low: { ru: 'Практик', en: 'Practical' },
    high: { ru: 'Мечтатель', en: 'Dreamer' },
    text: {
      low: {
        ru: 'Тебе ближе проверенные способы и понятная польза. Это помогает доводить дела до конца, а иногда пробуй один новый метод, чтобы сохранять гибкость.',
        en: 'You prefer proven methods and clear, practical value. That helps you finish what you start; now and then, try one new approach to stay flexible.',
      },
      mid: {
        ru: 'Ты можешь работать по проверенной схеме и пробовать новое, когда в этом есть смысл. Выбирай подход под задачу, а не по привычке.',
        en: 'You can follow a proven method or try something new when it makes sense. Choose the approach to fit the task, not out of habit.',
      },
      high: {
        ru: 'Тебя тянет к новым идеям, темам и способам. Это питает творчество и учёбу, а чтобы идеи не терялись, записывай их и доводи хотя бы одну до результата.',
        en: 'New ideas, subjects and methods pull you in. That feeds creativity and learning; write ideas down and pick one to see through to the end.',
      },
    },
    fuel: {
      high: {
        title: { ru: 'новые темы и идеи', en: 'new ideas to explore' },
        detail: { ru: 'Курсы, проекты и задачи, где можно попробовать что-то впервые.', en: 'Courses and projects where you get to try something for the first time.' },
      },
      low: {
        title: { ru: 'проверенные рабочие методы', en: 'proven, practical methods' },
        detail: { ru: 'Задачи, где понятно, как действовать и зачем это нужно.', en: 'Tasks where it is clear what to do and why it matters.' },
      },
    },
    drain: {
      high: {
        title: { ru: 'однообразная рутина', en: 'repetitive routine' },
        detail: { ru: 'Одни и те же действия неделями без новизны быстро гасят интерес.', en: 'Doing the same steps for weeks with nothing new quickly kills your interest.' },
      },
      low: {
        title: { ru: 'постоянная смена курса', en: 'constant changes of direction' },
        detail: { ru: 'Когда цели и правила меняются каждую неделю, трудно сосредоточиться.', en: 'When goals and rules shift every week, it is hard to settle and focus.' },
      },
    },
  },
  C: {
    name: { ru: 'Добросовестность', en: 'Conscientiousness' },
    low: { ru: 'Гибкий', en: 'Flexible' },
    high: { ru: 'Методичный', en: 'Methodical' },
    text: {
      low: {
        ru: 'Ты легко подстраиваешься и не теряешься, когда планы меняются. Чтобы сроки не ускользали, держи один простой список дел на неделю.',
        en: 'You adapt easily and stay calm when plans change. To keep deadlines from slipping, keep one simple to-do list for the week.',
      },
      mid: {
        ru: 'Ты умеешь планировать, но не держишься за план любой ценой. Для больших задач заранее ставь себе промежуточные сроки.',
        en: 'You can plan, but you do not cling to the plan at any cost. For big tasks, set yourself checkpoints in advance.',
      },
      high: {
        ru: 'Ты доводишь дела до конца и любишь, когда всё идёт по плану. Это надёжная опора в учёбе, только оставляй в расписании запас на неожиданное.',
        en: 'You finish what you start and like things to go to plan. That is a solid base for study; just leave some slack in your schedule for the unexpected.',
      },
    },
    fuel: {
      high: {
        title: { ru: 'чёткий план и сроки', en: 'clear plans and deadlines' },
        detail: { ru: 'Когда видно, что сделано, что осталось и к какому дню.', en: 'Seeing what is done, what is left and when it is due.' },
      },
      low: {
        title: { ru: 'гибкий график', en: 'a flexible schedule' },
        detail: { ru: 'Свобода решать, когда и в каком порядке браться за задачи.', en: 'The freedom to decide when and in what order to tackle tasks.' },
      },
    },
    drain: {
      high: {
        title: { ru: 'хаос и сорванные планы', en: 'chaos and broken plans' },
        detail: { ru: 'Когда всё решается в последний момент и никто не держит слово.', en: 'Last-minute decisions and people who do not do what they said.' },
      },
      low: {
        title: { ru: 'жёсткий контроль и отчёты', en: 'tight control and paperwork' },
        detail: { ru: 'Ежедневные отчёты и проверка каждого шага сковывают и утомляют.', en: 'Daily reports and checks on every step feel confining and tiring.' },
      },
    },
  },
  E: {
    name: { ru: 'Экстраверсия', en: 'Extraversion' },
    low: { ru: 'Интроверт', en: 'Introvert' },
    high: { ru: 'Экстраверт', en: 'Extravert' },
    text: {
      low: {
        ru: 'Ты восстанавливаешь силы в тишине и лучше думаешь наедине с собой. После насыщенных дней планируй время без людей: это не лень, а перезарядка.',
        en: 'You recharge in quiet and think best on your own. After busy social days, plan some time alone: it is recharging, not laziness.',
      },
      mid: {
        ru: 'Тебе хорошо и в компании, и в тишине, смотря по задаче. Замечай, что тебе нужно сейчас, и не бойся менять формат работы.',
        en: 'You are comfortable with people and on your own, depending on the task. Notice which one you need right now and switch when it helps.',
      },
      high: {
        ru: 'Ты заряжаешься от общения и хорошо думаешь вслух. Это помогает в команде и на выступлениях, а для сложных заданий выделяй время на тихую работу.',
        en: 'Being around people gives you energy, and you think well out loud. That helps in teams and presentations; for hard assignments, block out quiet time.',
      },
    },
    fuel: {
      high: {
        title: { ru: 'общение и командная работа', en: 'working with people' },
        detail: { ru: 'Обсуждения, выступления и задачи, где нужно договариваться вживую.', en: 'Discussions, presentations and tasks where you sort things out face to face.' },
      },
      low: {
        title: { ru: 'тишина для глубокой работы', en: 'quiet, focused time' },
        detail: { ru: 'Несколько часов без звонков и чатов, чтобы спокойно вникнуть в задачу.', en: 'A few hours with no calls or chats to really sink into a task.' },
      },
    },
    drain: {
      high: {
        title: { ru: 'долгая работа в одиночку', en: 'long stretches alone' },
        detail: { ru: 'Дни без общения и обратной связи быстро снижают твою энергию.', en: 'Days with no one to talk to or get feedback from drain your energy fast.' },
      },
      low: {
        title: { ru: 'целый день на людях', en: 'all day around people' },
        detail: { ru: 'Встречи подряд, шум и необходимость всё время говорить выматывают.', en: 'Back-to-back meetings, noise and having to talk all the time wear you down.' },
      },
    },
  },
  A: {
    name: { ru: 'Доброжелательность', en: 'Agreeableness' },
    low: { ru: 'Независимый', en: 'Independent' },
    high: { ru: 'Командный', en: 'Team player' },
    text: {
      low: {
        ru: 'Ты говоришь прямо и умеешь отстаивать своё мнение. Это ценно в спорах и переговорах, а перед критикой отмечай, что в чужой идее удачно.',
        en: 'You speak plainly and can stand your ground. That is useful in debates and negotiations; before you criticise, name what works in the other idea.',
      },
      mid: {
        ru: 'Ты умеешь и поддержать других, и возразить, когда это нужно. Опирайся на факты, тогда твоё несогласие легко услышать.',
        en: 'You can back others up and also push back when needed. Lean on facts, and your disagreement will be easy to hear.',
      },
      high: {
        ru: 'Тебе важно, чтобы людям рядом было хорошо, и ты легко находишь общий язык. Учись спокойно говорить «нет»: это тоже забота о себе и о деле.',
        en: 'You care that the people around you are okay, and you find common ground easily. Practise saying no calmly: it protects you and the work.',
      },
    },
    fuel: {
      high: {
        title: { ru: 'дружная команда', en: 'a supportive team' },
        detail: { ru: 'Работа, где помогают друг другу и общий успех важнее личного.', en: 'Work where people help each other and shared success matters most.' },
      },
      low: {
        title: { ru: 'право на своё мнение', en: 'room to disagree' },
        detail: { ru: 'Среда, где можно спорить по делу и прямо говорить, что не так.', en: 'A setting where you can argue the point and say plainly what is wrong.' },
      },
    },
    drain: {
      high: {
        title: { ru: 'постоянные споры и соперничество', en: 'constant rivalry and arguments' },
        detail: { ru: 'Атмосфера, где каждый сам за себя, отнимает у тебя много сил.', en: 'An every-person-for-themselves atmosphere takes a lot out of you.' },
      },
      low: {
        title: { ru: 'обязательное согласие со всеми', en: 'pressure to always agree' },
        detail: { ru: 'Когда возражать не принято и решения принимаются ради мира в группе.', en: 'When disagreeing is off limits and every decision is made to keep the peace.' },
      },
    },
  },
  N: {
    name: { ru: 'Эмоциональная чувствительность', en: 'Emotional sensitivity' },
    low: { ru: 'Устойчивый', en: 'Steady' },
    high: { ru: 'Чувствительный', en: 'Sensitive' },
    text: {
      low: {
        ru: 'Ты сохраняешь спокойствие под давлением и быстро приходишь в себя после неудач. Не забывай замечать, как дела у других: им может быть тяжелее.',
        en: 'You stay calm under pressure and bounce back quickly after setbacks. Remember to check in on others: they may find it harder than you do.',
      },
      mid: {
        ru: 'Обычно ты держишься ровно, но сильный стресс тоже чувствуешь. Заранее знай, что помогает тебе успокоиться перед экзаменом или важным днём.',
        en: 'You usually stay even, but heavy stress still gets to you. Know in advance what helps you settle before an exam or a big day.',
      },
      high: {
        ru: 'Ты остро чувствуешь эмоции, свои и чужие, и замечаешь то, что другие пропускают. К стрессовым событиям готовься заранее и оставляй время на отдых.',
        en: "You feel emotions strongly, your own and other people's, and notice what others miss. Prepare early for stressful events and leave time to rest.",
      },
    },
    fuel: {
      high: {
        title: { ru: 'спокойная поддерживающая среда', en: 'a calm, supportive setting' },
        detail: { ru: 'Место, где можно задать вопрос и ошибиться без страха.', en: 'A place where you can ask questions and make mistakes without fear.' },
      },
      low: {
        title: { ru: 'ситуации, где нужна выдержка', en: 'high-pressure situations' },
        detail: { ru: 'Дедлайны, соревнования и моменты, когда другие нервничают, а ты нет.', en: 'Deadlines, competitions and moments when others get nervous and you stay calm.' },
      },
    },
    drain: {
      high: {
        title: { ru: 'постоянное давление и конфликты', en: 'constant pressure and conflict' },
        detail: { ru: 'Жёсткие сроки, крики и напряжение в команде отнимают много сил.', en: 'Tight deadlines, raised voices and tension in a team cost you a lot.' },
      },
      low: null,
    },
  },
};

// Work values (O*NET's six).
export const VALUES = {
  achievement: {
    name: { ru: 'Достижения', en: 'Achievement' },
    fuel: {
      title: { ru: 'видимый прогресс', en: 'visible progress' },
      detail: { ru: 'Задачи, где ты используешь свои сильные стороны и видишь результат.', en: 'Tasks that use your strengths and let you see what you achieved.' },
    },
  },
  independence: {
    name: { ru: 'Самостоятельность', en: 'Independence' },
    fuel: {
      title: { ru: 'свобода принимать решения', en: 'freedom to decide' },
      detail: { ru: 'Когда тебе доверяют задачу и не контролируют каждый шаг.', en: 'Being trusted with a task without someone checking every step.' },
    },
  },
  recognition: {
    name: { ru: 'Признание', en: 'Recognition' },
    fuel: {
      title: { ru: 'признание и рост', en: 'recognition and growth' },
      detail: { ru: 'Когда твой вклад замечают, а впереди есть понятные ступени роста.', en: 'When your work gets noticed and there is a clear path to move up.' },
    },
  },
  relationships: {
    name: { ru: 'Отношения', en: 'Relationships' },
    fuel: {
      title: { ru: 'хорошие отношения в команде', en: 'good relationships at work' },
      detail: { ru: 'Коллеги, с которыми приятно работать, и дело, полезное людям.', en: 'Colleagues you enjoy working with and work that is useful to others.' },
    },
  },
  support: {
    name: { ru: 'Поддержка', en: 'Support' },
    fuel: {
      title: { ru: 'надёжная поддержка', en: 'reliable backing' },
      detail: { ru: 'Руководитель, который объясняет, помогает и стоит за командой.', en: 'A manager who explains, helps out and stands behind the team.' },
    },
  },
  conditions: {
    name: { ru: 'Условия работы', en: 'Working conditions' },
    fuel: {
      title: { ru: 'стабильность и хорошие условия', en: 'stability and good conditions' },
      detail: { ru: 'Надёжное место, честная оплата и достаточно дел, чтобы не скучать.', en: 'A secure job, fair pay and enough to do that you never feel idle.' },
    },
  },
};

// Working styles from situational questions.
export const STYLES = {
  lead: {
    name: { ru: 'Лидерство', en: 'Leading' },
    text: {
      ru: 'В группе ты задаёшь направление: предлагаешь план, распределяешь роли и следишь, чтобы дело двигалось.',
      en: 'In a group you set the direction: you suggest a plan, share out roles and keep things moving.',
    },
    fuel: {
      title: { ru: 'роль ведущего', en: 'leading the way' },
      detail: { ru: 'Когда можно собрать команду и отвечать за общий результат.', en: 'Getting to bring a team together and own the shared result.' },
    },
  },
  collab: {
    name: { ru: 'Сотрудничество', en: 'Collaborating' },
    text: {
      ru: 'Ты связываешь людей: слушаешь разные мнения, помогаешь договориться и поддерживаешь тех, кто отстаёт.',
      en: 'You connect people: you hear out different views, help the group agree and support anyone falling behind.',
    },
    fuel: {
      title: { ru: 'совместная работа', en: 'working together' },
      detail: { ru: 'Обсуждения и проекты, где результат рождается из общих идей.', en: 'Discussions and projects where the result grows out of shared ideas.' },
    },
  },
  plan: {
    name: { ru: 'Планирование', en: 'Planning' },
    text: {
      ru: 'Ты сначала продумываешь шаги: разбиваешь задачу на части, считаешь сроки и заранее видишь риски.',
      en: 'You think the steps through first: you break the task down, work out timings and spot risks early.',
    },
    fuel: {
      title: { ru: 'время на подготовку', en: 'time to prepare' },
      detail: { ru: 'Когда можно спокойно всё продумать до старта, а не решать на бегу.', en: 'Being able to think it through before you start, not on the run.' },
    },
  },
  solo: {
    name: { ru: 'Автономия', en: 'Working solo' },
    text: {
      ru: 'Ты лучше всего работаешь, когда берёшь свою часть и спокойно делаешь её без лишних обсуждений.',
      en: 'You work best when you can take your own part and get it done without lots of discussion.',
    },
    fuel: {
      title: { ru: 'своя зона ответственности', en: 'your own piece' },
      detail: { ru: 'Отдельная задача, где способ и темп выбираешь ты.', en: 'A clear piece of work where you choose the method and the pace.' },
    },
  },
};

// General tips for managing your energy.
export const TIPS = [
  {
    title: { ru: 'Одно главное дело', en: 'One main task' },
    detail: { ru: 'Каждое утро выбирай одно дело важнее остальных и делай его первым.', en: 'Each morning, pick the one task that matters most and do it first.' },
  },
  {
    title: { ru: 'Смена формата', en: 'Switch the mode' },
    detail: { ru: 'Когда внимание падает, смени вид занятия: экран на бумагу или стол на прогулку.', en: 'When focus fades, change the mode: screen to paper, or desk to a short walk.' },
  },
  {
    title: { ru: 'Сон в расписании', en: 'Schedule your sleep' },
    detail: { ru: 'Вписывай время сна в план так же серьёзно, как уроки и тренировки.', en: 'Put sleep in your plan as seriously as classes and training.' },
  },
];

// Roadmap. stages: 'early' (grades 7-9), '10', '11', 'uni'.
export const ROADMAP = {
  base: [
    {
      stage: 'early', priority: 'critical',
      title: { ru: 'Системно учить английский', en: 'Build your English steadily' },
      detail: { ru: 'Занимайся каждую неделю чтением, аудированием и разговором, чтобы к 10 классу уверенно выйти на B1-B2.', en: 'Work on reading, listening and speaking every week so you reach a solid B1-B2 by grade 10.' },
      duration: { ru: 'весь год', en: 'all year' },
    },
    {
      stage: 'early', priority: 'recommended',
      title: { ru: 'Попробовать олимпиады', en: 'Try subject olympiads' },
      detail: { ru: 'Участвуй в школьных и районных этапах, чтобы проверить себя и найти предмет, в который захочется углубиться.', en: 'Enter school and district rounds to test yourself and find a subject you want to go deeper into.' },
      duration: { ru: 'учебный год', en: 'school year' },
    },
    {
      stage: 'early', priority: 'recommended',
      title: { ru: 'Найти одно занятие вне уроков', en: 'Find one activity outside class' },
      detail: { ru: 'Выбери кружок, секцию или проект и держись за него хотя бы год, чтобы был виден рост.', en: 'Pick a club, sport or project and stick with it for at least a year so your progress shows.' },
      duration: { ru: 'от года', en: '1 year or more' },
    },
    {
      stage: 'early', priority: 'optional',
      title: { ru: 'Читать на английском для себя', en: 'Read in English for fun' },
      detail: { ru: 'Книги, статьи и видео на интересные тебе темы расширяют словарь быстрее, чем одни учебники.', en: 'Books, articles and videos on topics you like build vocabulary faster than textbooks alone.' },
      duration: { ru: '20 минут в день', en: '20 min a day' },
    },
    {
      stage: '10', priority: 'critical',
      title: { ru: 'Начать подготовку к SAT или IELTS', en: 'Start SAT or IELTS prep' },
      detail: { ru: 'Сдай пробный тест, оцени свой уровень и составь план занятий на год вперёд.', en: 'Take a practice test, see where you stand and plan your study for the year ahead.' },
      duration: { ru: 'весь год', en: 'all year' },
    },
    {
      stage: '10', priority: 'recommended',
      title: { ru: 'Пройти летнюю программу', en: 'Do a summer programme' },
      detail: { ru: 'Подай заявку в летнюю школу, лагерь или онлайн-курс университета: это опыт и строчка в резюме.', en: 'Apply to a summer school, camp or university online course for experience and a line on your CV.' },
      duration: { ru: '2-4 недели', en: '2-4 weeks' },
    },
    {
      stage: '10', priority: 'recommended',
      title: { ru: 'Составить список вузов', en: 'Build a university shortlist' },
      detail: { ru: 'Собери 8-12 вузов дома и за рубежом: несколько амбициозных, основную часть реальных и пару надёжных.', en: 'Pick 8-12 universities at home and abroad: a few reach, mostly target and a couple of safety options.' },
      duration: { ru: '1 месяц', en: '1 month' },
    },
    {
      stage: '11', priority: 'critical',
      title: { ru: 'Сдать SAT или IELTS на нужный балл', en: 'Sit SAT or IELTS for your target score' },
      detail: { ru: 'Запишись на экзамен заранее, оставь время на пересдачу и ориентируйся на баллы из своего списка вузов.', en: 'Book the test early, leave room for a retake and aim for the scores your universities expect.' },
      duration: { ru: '3-6 месяцев', en: '3-6 months' },
    },
    {
      stage: '11', priority: 'critical',
      title: { ru: 'Написать мотивационные эссе', en: 'Write your application essays' },
      detail: { ru: 'Начни летом перед 11 классом, пиши о реальном опыте и сделай несколько черновиков с обратной связью.', en: 'Start the summer before grade 11, write about real experiences and revise through several drafts with feedback.' },
      duration: { ru: '2-3 месяца', en: '2-3 months' },
    },
    {
      stage: '11', priority: 'recommended',
      title: { ru: 'Попросить рекомендательные письма', en: 'Ask for recommendation letters' },
      detail: { ru: 'Обратись к двум-трём учителям за один-два месяца до дедлайна и дай им краткую справку о своих делах.', en: 'Ask two or three teachers a month or two before the deadline and give them a short summary of your work.' },
      duration: { ru: '1-2 месяца', en: '1-2 months' },
    },
    {
      stage: '11', priority: 'critical',
      title: { ru: 'Подать заявки вовремя', en: 'Submit applications on time' },
      detail: { ru: 'Сведи все дедлайны в одну таблицу и отправляй документы хотя бы за неделю до срока.', en: 'Put every deadline in one table and send each application at least a week early.' },
      duration: { ru: 'осень-зима', en: 'autumn-winter' },
    },
    {
      stage: 'uni', priority: 'critical',
      title: { ru: 'Найти первую стажировку', en: 'Land your first internship' },
      detail: { ru: 'С первого курса ходи на ярмарки вакансий и откликайся на стажировки, даже короткие.', en: 'From your first year, go to career fairs and apply for internships, even short ones.' },
      duration: { ru: 'лето', en: 'summer' },
    },
    {
      stage: 'uni', priority: 'recommended',
      title: { ru: 'Найти наставника', en: 'Find a mentor' },
      detail: { ru: 'Познакомься с преподавателем или выпускником из своей сферы и встречайся с ним раз в месяц-два.', en: 'Get to know a lecturer or graduate in your field and meet them every month or two.' },
      duration: { ru: 'весь год', en: 'all year' },
    },
    {
      stage: 'uni', priority: 'optional',
      title: { ru: 'Поехать на семестр по обмену', en: 'Go on an exchange semester' },
      detail: { ru: 'Узнай об обменных программах своего вуза заранее: отбор обычно проходит за год до поездки.', en: 'Look into your university exchange schemes early: selection usually happens a year ahead.' },
      duration: { ru: '1 семестр', en: '1 semester' },
    },
  ],
  byType: {
    R: [
      {
        stage: 'early', priority: 'recommended',
        title: { ru: 'Записаться в кружок робототехники', en: 'Join a robotics or maker club' },
        detail: { ru: 'Робототехника, моделирование или столярное дело: важно регулярно собирать что-то своими руками.', en: 'Robotics, model making or woodwork: what matters is building things with your hands regularly.' },
        duration: { ru: 'учебный год', en: 'school year' },
      },
      {
        stage: '10', priority: 'critical',
        title: { ru: 'Довести свой проект до конца', en: 'Build one real project end to end' },
        detail: { ru: 'Сделай работающее устройство, модель или ремонт и задокументируй процесс фото и заметками.', en: 'Make a device, model or repair that works, and record the process with photos and notes.' },
        duration: { ru: '3-4 месяца', en: '3-4 months' },
      },
      {
        stage: '11', priority: 'recommended',
        title: { ru: 'Показать проект на конкурсе', en: 'Enter an engineering contest' },
        detail: { ru: 'Подай свой проект на инженерный конкурс или выставку и расскажи о нём в эссе.', en: 'Submit your project to an engineering fair or contest and mention it in your essays.' },
        duration: { ru: '2 месяца', en: '2 months' },
      },
      {
        stage: 'uni', priority: 'optional',
        title: { ru: 'Попасть в лабораторию или мастерскую', en: 'Get into a lab or workshop' },
        detail: { ru: 'Уже на первом курсе найди студенческое конструкторское бюро, лабораторию или практику на производстве.', en: 'Join a student engineering team, a lab or an industry placement in your first year.' },
        duration: { ru: '1 семестр', en: '1 semester' },
      },
    ],
    I: [
      {
        stage: 'early', priority: 'recommended',
        title: { ru: 'Решать задачи сверх программы', en: 'Solve problems beyond the syllabus' },
        detail: { ru: 'Раз в неделю бери задачи олимпиадного уровня по математике или естественным наукам.', en: 'Once a week, take on olympiad-style problems in maths or science.' },
        duration: { ru: 'весь год', en: 'all year' },
      },
      {
        stage: '10', priority: 'critical',
        title: { ru: 'Выйти на региональный этап олимпиады', en: 'Reach the regional olympiad round' },
        detail: { ru: 'Выбери один предмет и готовься по задачам прошлых лет, чтобы пройти дальше школьного этапа.', en: 'Pick one subject and train on past papers to get beyond the school round.' },
        duration: { ru: 'учебный год', en: 'school year' },
      },
      {
        stage: '11', priority: 'recommended',
        title: { ru: 'Сделать исследовательский проект', en: 'Do a small research project' },
        detail: { ru: 'Возьми вопрос, собери данные или проведи эксперимент и оформи выводы как короткую статью.', en: 'Pick a question, gather data or run an experiment, and write up your findings as a short paper.' },
        duration: { ru: '3-4 месяца', en: '3-4 months' },
      },
      {
        stage: 'uni', priority: 'optional',
        title: { ru: 'Присоединиться к научной группе', en: 'Join a research group' },
        detail: { ru: 'Напиши преподавателю, чьи работы тебе интересны, и предложи помогать в исследовании.', en: 'Email a lecturer whose work interests you and offer to help with their research.' },
        duration: { ru: '1 семестр', en: '1 semester' },
      },
    ],
    A: [
      {
        stage: 'early', priority: 'recommended',
        title: { ru: 'Вести творческий дневник', en: 'Keep a sketchbook or idea journal' },
        detail: { ru: 'Рисунки, тексты, фото или музыка: создавай что-то каждую неделю и храни всё в одном месте.', en: 'Drawings, writing, photos or music: make something each week and keep it all in one place.' },
        duration: { ru: 'весь год', en: 'all year' },
      },
      {
        stage: '10', priority: 'critical',
        title: { ru: 'Собрать портфолио', en: 'Start a portfolio' },
        detail: { ru: 'Отбери 10-15 лучших работ и выложи их онлайн с коротким описанием идеи каждой.', en: 'Pick your 10-15 best pieces and put them online with a short note on the idea behind each.' },
        duration: { ru: '2-3 месяца', en: '2-3 months' },
      },
      {
        stage: '11', priority: 'critical',
        title: { ru: 'Подготовить портфолио к поступлению', en: 'Tailor your portfolio for applications' },
        detail: { ru: 'Проверь требования творческих программ и подгони портфолио под каждую, добавив свежие работы.', en: 'Check what each creative programme asks for and adjust your portfolio, adding recent work.' },
        duration: { ru: '2 месяца', en: '2 months' },
      },
      {
        stage: 'uni', priority: 'optional',
        title: { ru: 'Брать реальные заказы', en: 'Take on real commissions' },
        detail: { ru: 'Делай проекты для студенческих клубов, фестивалей или небольших компаний, чтобы научиться работать с заказчиком.', en: 'Work on projects for student clubs, festivals or small businesses to learn how to work with clients.' },
        duration: { ru: 'весь год', en: 'all year' },
      },
    ],
    S: [
      {
        stage: 'early', priority: 'recommended',
        title: { ru: 'Стать волонтёром', en: 'Start volunteering' },
        detail: { ru: 'Найди регулярное волонтёрство: помощь младшим, приют для животных или городской проект.', en: 'Find a regular volunteering role: helping younger children, an animal shelter or a city project.' },
        duration: { ru: 'от полугода', en: '6 months or more' },
      },
      {
        stage: '10', priority: 'recommended',
        title: { ru: 'Заниматься с младшими учениками', en: 'Tutor younger students' },
        detail: { ru: 'Помогай младшеклассникам с предметом, который хорошо знаешь, раз или два в неделю.', en: 'Help younger students with a subject you know well once or twice a week.' },
        duration: { ru: 'учебный год', en: 'school year' },
      },
      {
        stage: '11', priority: 'critical',
        title: { ru: 'Запустить социальный проект', en: 'Launch a community project' },
        detail: { ru: 'Найди реальную проблему в школе или районе, собери команду и посчитай, скольким людям помог проект.', en: 'Spot a real problem in your school or area, gather a team and track how many people it helped.' },
        duration: { ru: '3-6 месяцев', en: '3-6 months' },
      },
      {
        stage: 'uni', priority: 'optional',
        title: { ru: 'Получить опыт работы с людьми', en: 'Get people-facing experience' },
        detail: { ru: 'Попробуй себя в студенческом совете, кураторстве первокурсников или практике в некоммерческой организации.', en: 'Try the student council, mentoring first-years or a placement with a non-profit.' },
        duration: { ru: '1 семестр', en: '1 semester' },
      },
    ],
    E: [
      {
        stage: 'early', priority: 'recommended',
        title: { ru: 'Организовать школьное мероприятие', en: 'Organise a school event' },
        detail: { ru: 'Возьми на себя ярмарку, турнир или концерт: от идеи и бюджета до подведения итогов.', en: 'Take charge of a fair, tournament or concert, from the idea and budget to the wrap-up.' },
        duration: { ru: '1-2 месяца', en: '1-2 months' },
      },
      {
        stage: '10', priority: 'critical',
        title: { ru: 'Запустить школьный бизнес-проект', en: 'Run a school business project' },
        detail: { ru: 'Продавай что-то полезное одноклассникам, веди учёт доходов и расходов и разбери, что сработало.', en: 'Sell something useful to classmates, track income and costs and review what worked.' },
        duration: { ru: '3-4 месяца', en: '3-4 months' },
      },
      {
        stage: '11', priority: 'recommended',
        title: { ru: 'Выступить на конкурсе или дебатах', en: 'Pitch at a contest or debate' },
        detail: { ru: 'Представь свой проект жюри или участвуй в дебатах, чтобы научиться убеждать под давлением.', en: 'Present your project to judges or join debates to learn to persuade under pressure.' },
        duration: { ru: '1-2 месяца', en: '1-2 months' },
      },
      {
        stage: 'uni', priority: 'optional',
        title: { ru: 'Вступить в предпринимательский клуб', en: 'Join an entrepreneurship club' },
        detail: { ru: 'Найди бизнес-клуб, инкубатор или кейс-чемпионат и собери вокруг себя команду.', en: 'Find a business club, an incubator or a case competition and build a team around you.' },
        duration: { ru: 'весь год', en: 'all year' },
      },
    ],
    C: [
      {
        stage: 'early', priority: 'recommended',
        title: { ru: 'Вести учёт в кружке или классе', en: 'Keep records for a club or class' },
        detail: { ru: 'Стань тем, кто ведёт расписание, списки и сборы: это хорошая тренировка организованности.', en: 'Be the one who handles schedules, lists and collections: good practice in organisation.' },
        duration: { ru: 'учебный год', en: 'school year' },
      },
      {
        stage: '10', priority: 'critical',
        title: { ru: 'Отвечать за бюджет клуба', en: 'Own a club budget' },
        detail: { ru: 'Возьми на себя деньги, закупки или логистику школьного клуба и отчитывайся по итогам.', en: 'Take over the money, purchasing or logistics for a school club and report back on the results.' },
        duration: { ru: 'учебный год', en: 'school year' },
      },
      {
        stage: '11', priority: 'recommended',
        title: { ru: 'Освоить таблицы и данные', en: 'Get good at spreadsheets' },
        detail: { ru: 'Разберись с формулами, сводными таблицами и графиками в Excel или Google Sheets на реальной задаче.', en: 'Learn formulas, pivot tables and charts in Excel or Google Sheets on a real task.' },
        duration: { ru: '1-2 месяца', en: '1-2 months' },
      },
      {
        stage: 'uni', priority: 'optional',
        title: { ru: 'Пройти стажировку в операционной роли', en: 'Intern in operations or finance' },
        detail: { ru: 'Ищи практику в финансах, аудите, логистике или управлении проектами уже со второго семестра.', en: 'Look for placements in finance, audit, logistics or project management from your second semester.' },
        duration: { ru: 'лето', en: 'summer' },
      },
    ],
  },
};
