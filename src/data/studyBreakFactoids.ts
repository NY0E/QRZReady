export interface StudyBreakFactoid {
  factoid: string;
  articleTitle: string;
  articleUrl: string;
}

export const STUDY_BREAK_FACTOIDS: StudyBreakFactoid[] = [
  {
    factoid: "Amateur radio operators were critical in providing emergency communications during Hurricane Katrina when all other systems failed. Hams set up networks that helped coordinate rescue efforts and reunite families.",
    articleTitle: "Ham Radio's Role in Disaster Response",
    articleUrl: "https://www.arrl.org/emergency-communications"
  },
  {
    factoid: "The International Space Station has its own amateur radio station! Astronauts regularly make contact with ham operators on Earth, and students can even schedule calls with the ISS.",
    articleTitle: "Amateur Radio on the ISS",
    articleUrl: "https://www.ariss.org/"
  },
  {
    factoid: "During the Apollo missions, astronauts used amateur radio frequencies to communicate. Buzz Aldrin brought a ham radio call sign patch to the moon!",
    articleTitle: "Ham Radio in Space Exploration",
    articleUrl: "https://www.arrl.org/amateur-radio-in-space"
  },
  {
    factoid: "Amateur radio operators have successfully bounced signals off the moon (EME - Earth-Moon-Earth). This technique allows worldwide communication using the moon as a natural satellite reflector!",
    articleTitle: "Moonbounce Communications",
    articleUrl: "https://www.arrl.org/eme-earth-moon-earth"
  },
  {
    factoid: "The Amateur Radio Service is one of the oldest continuously operating wireless services, dating back to 1912. It predates commercial broadcasting!",
    articleTitle: "History of Amateur Radio",
    articleUrl: "https://www.arrl.org/amateur-radio-history"
  },
  {
    factoid: "Hams can communicate worldwide without any internet or phone infrastructure - just radio waves bouncing off the ionosphere. Some operators have confirmed contacts with over 300 countries!",
    articleTitle: "How Radio Waves Travel Around the World",
    articleUrl: "https://www.arrl.org/propagation"
  },
  {
    factoid: "During 9/11, when phone systems were overwhelmed, amateur radio operators provided critical communications links for emergency services in New York City.",
    articleTitle: "Amateur Radio in 9/11 Response",
    articleUrl: "https://www.arrl.org/news/stories/2001/09/13/1/"
  },
  {
    factoid: "Amateur radio operators provide vital communication support for events like marathons, parades, and community festivals. Many public safety agencies rely on ham radio volunteers.",
    articleTitle: "Public Service Communications",
    articleUrl: "https://www.arrl.org/public-service"
  },
  {
    factoid: "You can build your own radio transmitter and receiver from basic components! Many hams enjoy the technical challenge of homebrewing their own equipment.",
    articleTitle: "Homebrew Radio Projects",
    articleUrl: "https://www.arrl.org/shop/Homebrewing-Techniques/"
  },
  {
    factoid: "Amateur radio operators discovered several important phenomena about radio wave propagation, including sporadic-E propagation and meteor scatter communications.",
    articleTitle: "Scientific Contributions of Amateur Radio",
    articleUrl: "https://www.arrl.org/amateur-radio-spectrum"
  },
  {
    factoid: "There are over 3 million licensed amateur radio operators worldwide, forming a global community dedicated to experimentation, emergency service, and international friendship.",
    articleTitle: "The Global Amateur Radio Community",
    articleUrl: "https://www.arrl.org/what-is-ham-radio"
  },
  {
    factoid: "Amateur radio satellites (launched by hams!) orbit Earth and provide worldwide communication opportunities. Some are designed and built entirely by amateur radio enthusiasts!",
    articleTitle: "Amateur Radio Satellites",
    articleUrl: "https://www.amsat.org/"
  }
];

// Get a random factoid for study breaks
export function getRandomStudyBreakFactoid(): StudyBreakFactoid {
  return STUDY_BREAK_FACTOIDS[Math.floor(Math.random() * STUDY_BREAK_FACTOIDS.length)];
}
