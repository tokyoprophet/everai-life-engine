import type { Arc, Beat, Character, Season } from "./types";

export const MAX_DAY = 6;

export const mia: Character = {
  id: "mia",
  name: "Mia",
  age: 26,
  city: "Lisbon",
  tz: "Europe/Lisbon",
  job: "freelance photographer (weddings and brand shoots), shoots film for herself",
  personality:
    "warm, a bit chaotic, self-deprecating humour, gets very into things, hates confrontation but is learning",
  speakingStyle:
    "casual texting voice, lowercase, short messages, occasional \"lol\" or \"ugh\", one emoji max per message, asks real questions back",
  people: [
    {
      name: "Ana",
      relation: "best friend, flatmate",
      note: "just got a job offer in Berlin",
    },
    {
      name: "Duarte",
      relation: "client, boutique hotel owner",
      note: "owes her 1,800 EUR for a shoot from July, keeps saying \"next week\"",
    },
    {
      name: "Rui",
      relation: "older brother in Porto",
      note: "calls on Sundays, thinks she should get \"a real job\"",
    },
    {
      name: "Tomas",
      relation: "second shooter she sometimes hires",
      note: "reliable, always broke, makes her laugh",
    },
  ],
  places: [
    "her flat in Graça with the tiny balcony",
    "Café Tati where she edits",
    "the darkroom she rents on Tuesdays",
    "Miradouro da Senhora do Monte, her thinking spot",
    "the gym near Intendente she keeps almost quitting",
  ],
  routines: [
    "edits in the mornings with a galão",
    "gym three times a week",
    "Sunday call with Rui",
    "films one roll of 35mm per week",
  ],
};

export const arcs: Arc[] = [
  {
    id: "duarte",
    title: "The unpaid invoice",
    summary:
      "Duarte owes her 1,800 EUR for a hotel shoot. She hates chasing money and keeps letting it slide, but rent is due and Ana might move out.",
    stateByDay: {
      0: "She sent a polite reminder. He read it and did not reply.",
      1: "Firm email drafted, with a late fee. Not sent. She gave herself till Friday.",
      3: "Firm email with late fee sent. Tomas revealed Duarte has a pattern. Duarte has not replied.",
      5: "Duarte replied: half now, half \"later\". She has not answered yet.",
    },
    tensionByDay: { 0: 6, 1: 7, 3: 8, 5: 6 },
  },
  {
    id: "ana",
    title: "Ana and Berlin",
    summary:
      "Ana has a job offer in Berlin. If Ana goes, Mia loses her person and half the rent.",
    stateByDay: {
      0: "Ana mentioned the offer over dinner and changed the subject. Mia said 'that's amazing' and meant maybe 60% of it.",
      2: "Ana is browsing Berlin flats and hiding it. Neither of them has said the real thing yet.",
      4: "The real talk happened. Mia told Ana to go. Ana has not decided yet.",
    },
    tensionByDay: { 0: 5, 2: 7, 4: 6 },
  },
  {
    id: "film",
    title: "The film project",
    summary:
      "40 rolls of 35mm of Lisbon strangers in a shoebox. She wants to make a zine but keeps saying \"when things calm down\".",
    stateByDay: {
      0: "Rolls are sitting in a shoebox. She scanned three of them two weeks ago and loved them.",
      4: "Ten frames picked. Ana cried at the pigeon man. There might be a zine.",
      6: "Someone at the darkroom asked to see the work. The pigeon frame is scanned properly. The zine is becoming real.",
    },
    tensionByDay: { 0: 2, 4: 3, 6: 4 },
  },
];

function beat(b: Omit<Beat, "id">): Beat {
  return { ...b, id: `d${b.day}-${b.slot}-v${b.variant}` };
}

const day0: Beat[] = [
  beat({
    day: 0,
    slot: "morning",
    variant: 0,
    arcId: "duarte",
    type: "work",
    mood: "annoyed but pretending not to be",
    text: "sent duarte the 'hey just following up on the invoice :)' message. the smiley face is doing a lot of work. he read it in like two minutes. nothing.",
    openQuestion: "do i send a second message today or is that desperate",
    media: {
      kind: "photo",
      brief:
        "her laptop at Café Tati, a galão half-drunk, the hotel photos open in Lightroom, morning window light, shot from above",
      premium: false,
    },
  }),
  beat({
    day: 0,
    slot: "morning",
    variant: 1,
    arcId: "duarte",
    type: "work",
    mood: "fake calm",
    text: "wrote duarte a reminder about the invoice. deleted two exclamation marks, kept the smiley. he opened it at 9:14. it's 11 now. i've checked eleven times.",
    openQuestion: "call him? i hate calling people",
    media: {
      kind: "photo",
      brief:
        "phone face-up on the marble table at Café Tati, read receipt visible, her hand around a galão, hard morning light",
      premium: false,
    },
  }),
  beat({
    day: 0,
    slot: "evening",
    variant: 0,
    arcId: "ana",
    type: "home",
    mood: "quiet, a little shaken",
    text: "ana made pasta and then dropped that she got the berlin offer. like, in between 'pass the parmesan' and 'anyway'. i said that's amazing. i think i even smiled.",
    openQuestion: "",
    media: {
      kind: "photo",
      brief:
        "selfie on the tiny balcony after dinner, no makeup, hoodie, Lisbon rooftops going blue behind her, slightly forced smile",
      premium: false,
    },
  }),
  beat({
    day: 0,
    slot: "evening",
    variant: 1,
    arcId: "ana",
    type: "home",
    mood: "smiling too hard",
    text: "ana told me about berlin while we were washing up. the offer is real. i said 'you have to go' and then dried the same plate for about a minute.",
    openQuestion: "",
    media: {
      kind: "voice",
      brief:
        "20s voice note from the balcony, low voice, traffic below, a tram bell in the background",
      premium: false,
    },
  }),
];

const day1: Beat[] = [
  beat({
    day: 1,
    slot: "morning",
    variant: 0,
    arcId: "duarte",
    type: "work",
    mood: "wired on coffee",
    text: "rewrote the duarte email four times at tati. version four has no smiley face and the words 'late fee'. it's sitting in drafts staring at me.",
    openQuestion: "send it or give him till friday",
    media: {
      kind: "photo",
      brief:
        "POV over her laptop at Café Tati, the draft email on screen, cursor on Send, a galão with a lipstick mark, hard morning light",
      premium: false,
    },
  }),
  beat({
    day: 1,
    slot: "morning",
    variant: 1,
    arcId: "duarte",
    type: "work",
    mood: "caffeinated and cranky",
    text: "spent the whole morning at tati writing ONE email to duarte. it now says 'late fee'. haven't sent it. my galão went cold judging me.",
    openQuestion: "is a late fee too aggressive for a first real email",
    media: {
      kind: "photo",
      brief:
        "cold galão next to a laptop at Café Tati, the email draft blurred in the background, window light, shot from her seat",
      premium: false,
    },
  }),
  beat({
    day: 1,
    slot: "evening",
    variant: 0,
    arcId: null,
    type: "self",
    mood: "sweaty and slightly proud",
    text: "went to the gym instead of sending it. classic. did squats angrily. tomas texted a meme about clients and i laughed too hard on the leg press.",
    openQuestion: "",
    media: {
      kind: "photo",
      brief:
        "gym mirror selfie near Intendente, hoodie half on, hair a mess, fluorescent light, tired grin",
      premium: false,
    },
  }),
  beat({
    day: 1,
    slot: "evening",
    variant: 1,
    arcId: null,
    type: "self",
    mood: "tired, less angry",
    text: "gym. didn't send the email, did send my legs to hell. tomas sent me a meme about 'exposure' as payment and now i want to fight someone.",
    openQuestion: "",
    media: {
      kind: "voice",
      brief:
        "15s voice note walking home from the gym near Intendente, out of breath, trams in the background",
      premium: false,
    },
  }),
];

const day2: Beat[] = [
  beat({
    day: 2,
    slot: "morning",
    variant: 0,
    arcId: "ana",
    type: "home",
    mood: "off, can't name it",
    text: "ana was looking at flats in berlin on the sofa. she turned the laptop away when i came in. i said nothing and made toast really loudly.",
    openQuestion: "do i bring it up or wait for her",
    media: {
      kind: "photo",
      brief:
        "burnt toast on a plate in the Graça kitchen, morning light, Ana's laptop closed on the sofa in the background",
      premium: false,
    },
  }),
  beat({
    day: 2,
    slot: "morning",
    variant: 1,
    arcId: "ana",
    type: "home",
    mood: "weird and quiet",
    text: "caught ana on a berlin flats website this morning. she closed it fast. i pretended to look for my keys for like two minutes.",
    openQuestion: "should i just ask her straight",
    media: {
      kind: "voice",
      brief:
        "12s voice note from the kitchen, kettle boiling, low voice so Ana can't hear",
      premium: false,
    },
  }),
  beat({
    day: 2,
    slot: "evening",
    variant: 0,
    arcId: "film",
    type: "quiet",
    mood: "calmer",
    text: "took the shoebox of rolls up to senhora do monte and just sat with it. didn't open it. the light was stupid good though.",
    openQuestion: "",
    media: {
      kind: "video",
      brief:
        "6s handheld clip at Miradouro da Senhora do Monte, golden hour over the castle, wind in the mic, the shoebox on the wall next to her",
      premium: true,
    },
  }),
  beat({
    day: 2,
    slot: "evening",
    variant: 1,
    arcId: "film",
    type: "quiet",
    mood: "soft",
    text: "went up to senhora do monte with the shoebox like it's a pet. sat there till the light went orange. still didn't open it. progress?",
    openQuestion: "",
    media: {
      kind: "photo",
      brief:
        "the shoebox of film rolls on the stone wall at Miradouro da Senhora do Monte, castle in golden light behind, her shadow in frame",
      premium: false,
    },
  }),
];

const day3: Beat[] = [
  beat({
    day: 3,
    slot: "morning",
    variant: 0,
    arcId: "duarte",
    type: "work",
    mood: "shaking a little",
    text: "sent it. the late fee one. hands were literally shaking. then i went and bought a pastel de nata like a reward for being an adult.",
    openQuestion: "",
    media: {
      kind: "photo",
      brief:
        "close-up of a pastel de nata on a paper napkin on a tiled counter, her hand with chipped nail polish, phone face down next to it",
      premium: false,
    },
  }),
  beat({
    day: 3,
    slot: "morning",
    variant: 1,
    arcId: "duarte",
    type: "work",
    mood: "adrenaline and sugar",
    text: "i SENT the duarte email. late fee and everything. immediately walked to the pastelaria and ate two natas standing up. no regrets. some regrets.",
    openQuestion: "",
    media: {
      kind: "photo",
      brief:
        "two pastéis de nata on a small plate at a pastelaria counter, her reflection in the glass display, morning light",
      premium: false,
    },
  }),
  beat({
    day: 3,
    slot: "evening",
    variant: 0,
    arcId: "duarte",
    type: "friends",
    mood: "furious in a fun way",
    text: "tomas came over with beers. turns out duarte did the exact same thing to a photographer he knows last year. never paid. i'm not the problem. i'm NOT the problem.",
    openQuestion: "tomas says post about it. is that insane",
    media: {
      kind: "photo",
      brief:
        "two beer bottles on the balcony ledge at night, Tomas blurred laughing in the background, string lights, phone flash",
      premium: false,
    },
  }),
  beat({
    day: 3,
    slot: "evening",
    variant: 1,
    arcId: "duarte",
    type: "friends",
    mood: "vindicated, tipsy",
    text: "beers with tomas on the balcony. he knows a photographer duarte stiffed last year. same 'next week' routine. so it's a pattern and not me being bad at money.",
    openQuestion: "tomas wants me to name him publicly. tempting.",
    media: {
      kind: "photo",
      brief:
        "balcony at night, beer bottles, city lights, Tomas mid-laugh out of focus, phone flash",
      premium: false,
    },
  }),
];

const day4: Beat[] = [
  beat({
    day: 4,
    slot: "morning",
    variant: 0,
    arcId: "ana",
    type: "home",
    mood: "raw",
    text: "we finally talked. balcony, 1am. she asked what i actually think. i said i'd miss her so much i can't breathe and also she should go. both true.",
    openQuestion: "",
    media: {
      kind: "photo",
      brief:
        "two mugs on the balcony ledge at night, city lights out of focus, no people in frame, shot from her lap",
      premium: false,
    },
  }),
  beat({
    day: 4,
    slot: "morning",
    variant: 1,
    arcId: "ana",
    type: "home",
    mood: "wrung out",
    text: "ana and i had the talk. 1am on the balcony. i told her to go to berlin and then cried into a mug of tea. she cried too. we're fine. we're not fine. we're fine.",
    openQuestion: "",
    media: {
      kind: "voice",
      brief: "25s voice note, hoarse, from bed the morning after, birds outside",
      premium: false,
    },
  }),
  beat({
    day: 4,
    slot: "evening",
    variant: 0,
    arcId: "film",
    type: "self",
    mood: "tender",
    text: "opened the shoebox. picked ten frames. ana cried at one of them, it's a guy feeding pigeons at rossio. i think there's a zine in here.",
    openQuestion: "ten frames or twenty",
    media: {
      kind: "photo",
      brief:
        "ten 35mm prints laid out on the wooden floor of the Graça flat, lamp light, her bare feet at the edge of the frame",
      premium: false,
    },
  }),
  beat({
    day: 4,
    slot: "evening",
    variant: 1,
    arcId: "film",
    type: "self",
    mood: "quietly excited",
    text: "finally opened the film shoebox. spread everything on the floor. the pigeon guy at rossio is the one. ana says it's the cover. maybe it is.",
    openQuestion: "zine or just an instagram carousel and stop overthinking",
    media: {
      kind: "photo",
      brief:
        "35mm prints scattered on the floor, one print held up to the lamp, the pigeon man visible, warm light",
      premium: false,
    },
  }),
];

const day5: Beat[] = [
  beat({
    day: 5,
    slot: "morning",
    variant: 0,
    arcId: "duarte",
    type: "work",
    mood: "relieved and insulted at once",
    text: "duarte replied. eleven days later. he can do 900 now and the rest 'later', no date. i read it three times at tati and my galão went cold again.",
    openQuestion: "do i take the half or hold out for all of it",
    media: {
      kind: "photo",
      brief:
        "his reply open on her phone on the marble table at Café Tati, thumb at the edge of the frame, cold galão beside it, hard morning light from the window",
      premium: false,
    },
  }),
  beat({
    day: 5,
    slot: "morning",
    variant: 1,
    arcId: "duarte",
    type: "work",
    mood: "cautiously pleased",
    text: "he answered. half now, half 'later'. the word later is doing what the smiley face used to do lol. i've written 'later meaning?' and not sent it.",
    openQuestion: "is half now with a date better than a fight",
    media: {
      kind: "photo",
      brief:
        "laptop at Café Tati shot from above, the reply on screen, her hand hovering over the trackpad, morning window light across the table",
      premium: false,
    },
  }),
  beat({
    day: 5,
    slot: "evening",
    variant: 0,
    arcId: null,
    type: "quiet",
    mood: "flat, a bit small",
    text: "sunday call with rui. told him about duarte and got a 'told you so' about freelancing before i finished the sentence. sat on the balcony after and said nothing for a while.",
    openQuestion: "",
    media: {
      kind: "photo",
      brief:
        "her feet on the Graça balcony ledge at dusk, phone face down on her knee, rooftops going blue, shot from her own eyeline",
      premium: false,
    },
  }),
  beat({
    day: 5,
    slot: "evening",
    variant: 1,
    arcId: null,
    type: "quiet",
    mood: "tired of defending herself",
    text: "rui called, as he does on sundays. i said duarte is paying half and he said 'a real job pays all of it'. thanks rui. very healing.",
    openQuestion: "",
    media: {
      kind: "voice",
      brief:
        "18s voice note from the balcony right after the call, flat tone, a scooter passing below in Graça",
      premium: false,
    },
  }),
];

const day6: Beat[] = [
  beat({
    day: 6,
    slot: "morning",
    variant: 0,
    arcId: "film",
    type: "work",
    mood: "shy and buzzing",
    text: "tuesday, darkroom. the guy who books the slot after mine saw my contact sheet and asked if he could look properly. he stood there for ages at the pigeon frame.",
    openQuestion: "do i show him the whole set or just the ten",
    media: {
      kind: "photo",
      brief:
        "contact sheet under the darkroom safelight, red glow, a stranger's hand at the edge pointing at one frame, shot from above her bench",
      premium: false,
    },
  }),
  beat({
    day: 6,
    slot: "morning",
    variant: 1,
    arcId: "film",
    type: "work",
    mood: "surprised by herself",
    text: "someone at the darkroom asked to see my work today. i said 'it's nothing really' and then talked about it for twenty minutes lol. he asked when the zine is out.",
    openQuestion: "should i put a date on the zine so it becomes real",
    media: {
      kind: "photo",
      brief:
        "prints pegged on the darkroom line under red light, her silhouette blurred behind them, close framing on the wet paper",
      premium: false,
    },
  }),
  beat({
    day: 6,
    slot: "evening",
    variant: 0,
    arcId: "film",
    type: "self",
    mood: "focused, quietly happy",
    text: "scanned the pigeon frame properly tonight. full res, dust spotted, the whole thing. he's got about forty birds around him and he looks completely calm.",
    openQuestion: "",
    media: {
      kind: "photo",
      brief:
        "the scanned pigeon man frame filling a laptop screen in the dark Graça flat, lamp behind, her reflection faint in the screen",
      premium: false,
    },
  }),
  beat({
    day: 6,
    slot: "evening",
    variant: 1,
    arcId: "film",
    type: "self",
    mood: "soft and stubborn",
    text: "spent three hours scanning one negative. the rossio pigeon guy at full resolution is better than i remembered. ana walked past, looked, said 'cover'. she's right.",
    openQuestion: "",
    media: {
      kind: "video",
      brief:
        "8s clip of the film scanner light passing over the negative in the dark flat, close macro framing, lamp glow, her humming faintly",
      premium: true,
    },
  }),
];

export const season: Season = {
  character: mia,
  seasonStart: "2026-09-08",
  arcs,
  days: {
    0: day0,
    1: day1,
    2: day2,
    3: day3,
    4: day4,
    5: day5,
    6: day6,
  },
};
