export interface MilestoneCelebration {
  milestone: number;
  title: string;
  message: string;
  trivia: string;
  link?: {
    text: string;
    url: string;
    context?: string;
  };
}

export const MILESTONES: MilestoneCelebration[] = [
  {
    milestone: 1,
    title: "🎉 First Question Mastered!",
    message: "Amazing start! You've mastered your first question. That's 4 correct answers in a row!",
    trivia: "Did you know? Amateur radio operators were critical in providing emergency communications during Hurricane Katrina when all other systems failed. Hams are often the lifeline during disasters.",
  },
  {
    milestone: 5,
    title: "🌟 5 Questions Mastered!",
    message: "You're building momentum! Keep up the excellent work.",
    trivia: "Fun fact: The International Space Station has an amateur radio station (NA1SS). Astronauts regularly make contacts with ham operators on Earth, and students worldwide can talk to astronauts through ham radio!",
  },
  {
    milestone: 10,
    title: "🚀 10 Questions Mastered!",
    message: "Double digits! You're really getting the hang of this.",
    trivia: "Ready to protect your privacy? The FCC makes all ham radio licenses public, including your home address. Many hams use a virtual mailbox service to keep their home address private.",
    link: {
      text: "Learn About iPostal1 Virtual Mailboxes",
      url: "https://ipostal1.com/?ref=6716",
      context: "Protect your privacy while pursuing your ham radio license."
    }
  },
  {
    milestone: 25,
    title: "⚡ 25 Questions Mastered!",
    message: "You're a quarter of the way there! Your knowledge is growing rapidly.",
    trivia: "Did you know? Amateur radio operators have successfully bounced signals off the Moon (called EME - Earth-Moon-Earth). This technique allows hams to communicate across the entire planet!",
  },
  {
    milestone: 50,
    title: "🎯 Halfway to Your Goal!",
    message: "50 questions mastered! You're well on your way to exam readiness.",
    trivia: "Interesting fact: During the 9/11 attacks, when phone systems were overwhelmed, amateur radio operators in New York helped coordinate rescue efforts and maintained communications for the Red Cross.",
  },
  {
    milestone: 75,
    title: "💪 75 Questions Mastered!",
    message: "Three quarters there! Your dedication is impressive.",
    trivia: "Cool fact: The Apollo astronauts used amateur radio frequencies for their private communications. Neil Armstrong and Buzz Aldrin were both licensed amateur radio operators!",
  },
  {
    milestone: 100,
    title: "🏆 Century Club!",
    message: "100 questions mastered! You've joined the century club!",
    trivia: "Did you know? Amateur radio operators provide critical support for CERT (Community Emergency Response Teams) and ARES (Amateur Radio Emergency Service), helping communities prepare for and respond to emergencies.",
    link: {
      text: "Learn About CERT Volunteering",
      url: "https://community.fema.gov/PreparednessCommunity/s/cert",
      context: "Join thousands of hams who volunteer their skills to help their communities."
    }
  },
  {
    milestone: 150,
    title: "🌍 Global Communicator!",
    message: "150 questions mastered! You're building serious expertise.",
    trivia: "Amazing fact: During emergencies, amateur radio is often the ONLY communication system that works. Hams don't rely on internet, cell towers, or power grids - just radios and emergency power!",
  },
  {
    milestone: 200,
    title: "📡 Master Operator in Training!",
    message: "200 questions mastered! You're approaching expert level.",
    trivia: "Did you know? Amateur radio operators can communicate with the International Space Station when it passes overhead. Many schools coordinate ISS contacts for students to talk directly with astronauts!",
  },
  {
    milestone: 300,
    title: "🎓 Almost There!",
    message: "300 questions mastered! The finish line is in sight!",
    trivia: "Impressive fact: The Amateur Radio Service is one of the oldest continuously operating radio services in the world, dating back to the early 1900s. You're joining over a century of tradition!",
  },
  {
    milestone: 411,
    title: "🏅 Complete Mastery!",
    message: "You've mastered ALL 411 questions! You're absolutely ready for the exam!",
    trivia: "Congratulations! You've joined an elite community of amateur radio operators who serve their communities during emergencies, push the boundaries of technology, and connect people across the world. Welcome to ham radio! 73 (best regards)!",
    link: {
      text: "Find Your Local Exam Session",
      url: "https://www.arrl.org/find-an-amateur-radio-license-exam-session",
      context: "You're ready - go take that exam!"
    }
  }
];

export function getMilestoneForCount(masteredCount: number): MilestoneCelebration | null {
  // Find the exact milestone match
  const milestone = MILESTONES.find(m => m.milestone === masteredCount);
  return milestone || null;
}
