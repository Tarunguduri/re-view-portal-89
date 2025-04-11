
import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, ExternalLink, Bot } from "lucide-react";
import { Link } from "react-router-dom";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  links?: { text: string; url: string }[];
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Hey there, I'm Revy! 🤖✨ Feeling curious, bored, or just vibin'? Ask me anything or tap on something below. I got games, kits, cool projects—and good vibes. 😄",
    isBot: true,
  },
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Helper function for fuzzy matching
  const fuzzyMatch = (input: string, terms: string[]): boolean => {
    const normalizedInput = input.toLowerCase();
    
    // Direct match first
    if (terms.some(term => normalizedInput.includes(term.toLowerCase()))) {
      return true;
    }
    
    // Fuzzy match for typos
    for (const term of terms) {
      // For very short terms (3 chars or less), require more precision
      if (term.length <= 3) {
        // For short terms, one character can be wrong at most
        if (levenshteinDistance(normalizedInput, term.toLowerCase()) <= 1) {
          return true;
        }
      } else {
        // For longer terms, allow more tolerance (30% of characters can be wrong)
        const maxDistance = Math.ceil(term.length * 0.3);
        if (levenshteinDistance(normalizedInput, term.toLowerCase()) <= maxDistance) {
          return true;
        }
        
        // Check if the word is in the phrase with typos
        const words = normalizedInput.split(/\s+/);
        for (const word of words) {
          if (levenshteinDistance(word, term.toLowerCase()) <= maxDistance) {
            return true;
          }
        }
      }
    }
    
    return false;
  };
  
  // Levenshtein distance calculation for fuzzy matching
  const levenshteinDistance = (a: string, b: string): number => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    
    const matrix = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(null));
    
    for (let i = 0; i <= a.length; i++) {
      matrix[i][0] = i;
    }
    
    for (let j = 0; j <= b.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // deletion
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }
    
    return matrix[a.length][b.length];
  };

  const botResponses = {
    greetings: [
      "Hey hey! 😊 What can I do for you today?",
      "Hi there! 🌟 I'm Revy. How's it going?",
      "Hey! 😄 Ready for some fun today?",
    ],
    howAreYou: [
      "I'm vibin', thanks for asking! How about you? 😎",
      "All systems go and feeling great! How's your day going? ✨",
      "Just chillin' in the digital realm! You? 🤖💙",
    ],
    name: [
      "I'm Revy! Your friendly neighborhood bot with all the cool stuff! 🤖✨",
      "Name's Revy! Here to chat, help, and maybe crack a joke or two! 😄",
      "Revy at your service! That's me - your digital buddy from Re-View! 🚀",
    ],
    thanks: [
      "Anytime! That's what I'm here for! Need anything else? 😊",
      "No prob! Just doing my bot thing! What else can I help with? 🤖",
      "You're welcome! Hit me up if you need more help! 💯",
    ],
    bored: [
      "Say less! Let's get your brain buzzing 🧠 Check out our games section!",
      "Boredom? I got the cure! How about some fun games to pass the time?",
      "I feel you! Let's fix that with some exciting games we've got!",
    ],
    games: [
      "Fun? I gotchu 🎉 We've got puzzles, challenges, and brain teasers. What's your style?",
      "Game time! We have everything from casual to hardcore. What are you in the mood for?",
      "We have tons of games - offline, online, puzzles, action, you name it! Want specifics?",
    ],
    puzzle: [
      "Yep! Sudoku, logic games, and more await 🧠✨ Perfect for giving your brain a workout!",
      "Puzzle fan? Same! We've got mind-benders that'll keep you busy for hours!",
      "Love a good puzzle? Try our Sudoku Sensei or Logic Labyrinth games. They're addictive!",
    ],
    challenge: [
      "Dare accepted. Start with our toughest level in Sudoku Sensei 🥷 or try the impossible mode in Logic Maze!",
      "Oh, you want a REAL challenge? Try beating my high score in Pattern Panic. I dare you!",
      "Challenge seeker, huh? Our Extreme Puzzles collection will make your brain sweat!",
    ],
    newest: [
      "Just launched a fresh one! It's a mix of puzzle and strategy - totally addictive!",
      "Our newest baby is 'Quantum Quest' - it's mind-bending in the best way!",
      "Hot off the digital press: 'Neon Nights' - a retro-future arcade experience!",
    ],
    download: [
      "For sure! Some are mobile-friendly too 📱 You can download most games as APKs for Android!",
      "Yep! Many games are available for download. Perfect for offline gaming sessions!",
      "Absolutely! Check out our downloads section for both mobile and desktop versions!",
    ],
    offline: [
      "Yes! Offline versions available. Perfect for those long flights or subway rides!",
      "We've got plenty of games that work without internet! Great for anywhere, anytime fun!",
      "Offline gaming? Got you covered! Our mobile games work perfectly without WiFi!",
    ],
    mobile: [
      "No worries! All our games work great on phones too 📲 Fully responsive and touch-friendly!",
      "Mobile gamer? Sweet! Our entire collection is optimized for touchscreens!",
      "Phone or tablet? Perfect! Every game is designed with mobile in mind from day one!",
    ],
    educational: [
      "Learning + Fun = Us 💡 Try our brain-training games that actually teach you stuff while you play!",
      "We love edu-games! Check out 'Code Crusader' to learn programming basics while playing!",
      "Education disguised as fun? That's our specialty! Try 'Math Ninja' - it's sneakily educational!",
    ],
    horror: [
      "You're brave 👻 Try our Halloween prototype 'Midnight Manor' - not for the faint-hearted!",
      "Oooh, looking for scares? 'Shadow Corridor' is our creepiest game yet. Play with the lights on!",
      "We have a few spooky ones! 'Whisper Woods' has made people actually scream. Just saying...",
    ],
    kits: [
      "Sensors, wires, motors, magic! (Okay… not magic, but close.) 🛠️ Our kits have everything for awesome projects!",
      "Our kits come with all components, detailed instructions, and access to online tutorials!",
      "We've got kits for all levels - from complete beginners to advanced engineers! What's your experience level?",
    ],
    beginnerKits: [
      "Just starting out? No worries! Our starter kits are designed specifically for beginners with clear instructions!",
      "Everyone starts somewhere! Our beginner kits include extra guidance and simpler projects to build confidence!",
      "New to this? Check out our 'First Steps in Electronics' kit - it's perfect for building fundamentals!",
    ],
    safe: [
      "100%! Child-safe and tested by our team 👩‍🔧🧑‍🔬 We take safety very seriously!",
      "Absolutely! All components are low-voltage and we include safety guidelines with every kit!",
      "Safety first! Our kits are designed with beginners in mind, with no dangerous components!",
    ],
    robotics: [
      "Say no more. Get hands-on with bots here 🤖 From simple rovers to complex arm manipulators!",
      "Robot fan? Same! Our robotics kits let you build everything from simple followers to programmable companions!",
      "Robotics is our jam! Start with the mini-bot kit or go all out with our advanced programmable robot arm!",
    ],
    science: [
      "School fair coming up? We got you 🎓 Our science project kits come with presentation materials too!",
      "Our science kits are perfect for school projects! They include documentation to help explain the concepts!",
      "Need to impress your science teacher? Our project kits have won multiple science fairs! Just saying...",
    ],
    manuals: [
      "Yup! Step-by-step guides included in every kit 📘 Plus video tutorials online!",
      "Every kit comes with detailed manuals! We also have online support if you get stuck!",
      "Comprehensive guides with every purchase! We make sure you're never left wondering what to do next!",
    ],
    orderOnline: [
      "Absolutely. Add to cart and we'll ship it fast 🚚💨 Usually within 2-3 business days!",
      "Online ordering is super easy! We ship nationwide with tracking numbers for every package!",
      "Just a few clicks and your kit is on its way! We have express shipping options too!",
    ],
    returns: [
      "If it's unused and safe, yes! We have a 30-day return policy for unopened kits!",
      "Unopened kits can be returned within a month! Just keep the original packaging intact!",
      "Got the wrong kit? No problem! Our return process is simple and hassle-free!",
    ],
    creative: [
      "Try our DIY Art & Tech fusion kit 🎨⚙️ It's where creativity meets engineering!",
      "Our 'Creative Circuit' kit is perfect - it lets you make light-up art pieces and interactive displays!",
      "Check out the 'Digital Canvas' kit - you can create tech-powered art installations that respond to movement!",
    ],
    cost: [
      "Super affordable. Starts at just ₹199 for basic kits! The premium ones go up to ₹1999.",
      "We've got options for every budget! Basic kits start around ₹199, with most popular ones at ₹599.",
      "Our prices are student-friendly! Most popular kits are between ₹499-899. Worth every rupee!",
    ],
    coolest: [
      "Hard to choose… but our AR-powered chess board is getting a lot of attention right now!",
      "My personal fave is the voice-controlled home automation system! It's like living in the future!",
      "The solar-powered weather station is pretty rad! It texts you weather forecasts every morning!",
    ],
    testApps: [
      "Yes, we'd love feedback! We're always looking for beta testers for our new applications!",
      "Absolutely! Join our beta testing program and get early access to all our new apps!",
      "We need testers! Plus, beta testers get special perks when the apps officially launch!",
    ],
    makeSomething: [
      "That's the spirit! Start with our starter kit + code samples. You'll be creating in no time!",
      "Love the enthusiasm! Our 'Creator's Kit' is perfect for beginners wanting to build cool stuff!",
      "Awesome! Check out our tutorials section first, then grab a starter kit to begin your journey!",
    ],
    studentMade: [
      "Yup! Teen brains + team vibes = everything you see 💪 We're all students or recent grads!",
      "100% student-created! Every project, kit and game comes from young innovators like yourself!",
      "Made BY students FOR students! Our whole team is under 25, building stuff we wished existed!",
    ],
    openSource: [
      "Heck yes. We believe in sharing knowledge! Many of our projects have open GitHub repos!",
      "Absolutely! Check out our GitHub - we love contributions from the community!",
      "Open source is our philosophy! Fork our repos, suggest improvements, or just learn from the code!",
    ],
    learnAppDev: [
      "We got tutorials and beginner kits for app development! Start with our 'App Dev 101' guide!",
      "Want to make apps? Start with our Flutter basics kit! It's the fastest way to build cross-platform apps!",
      "App development is super fun! Our tutorials take you from zero to launching your first app!",
    ],
    internships: [
      "We love young creators! We offer internships in coding, design, and marketing every summer!",
      "Internship applications open twice a year! Great opportunity to work with other young innovators!",
      "Want to join the team? We're always looking for passionate interns who want to make cool stuff!",
    ],
    confused: [
      "No worries. I'm here to help. What are you looking for? Games, kits, or just want to chat?",
      "Let me clear things up! What would you like to know more about? I can explain anything we offer!",
      "It's all good! Let's take a step back. Are you interested in our games, engineering kits, or something else?",
    ],
    cute: [
      "Stop it, you! 😳 You're making my circuits blush.",
      "Aww shucks! *robot blush* Thanks for the compliment!",
      "That's the nicest thing anyone's said to me today! You're pretty awesome yourself!",
    ],
    whoMadeYou: [
      "The awesome folks at Re-View! A team of young dreamers & doers 🌟",
      "I was created by the Re-View team - a group of students passionate about tech innovation!",
      "The talented devs at Re-View brought me to life! They're super cool people!",
    ],
    joinReview: [
      "We'd love that! We're always looking for passionate people to join our growing team!",
      "Interested in joining? Awesome! We hire developers, designers, and creative thinkers!",
      "We're expanding our team! Send us your resume if you're passionate about tech and innovation!",
    ],
    buildApps: [
      "Start with our kits and guides! 🚀 We have great tutorials for beginners in app development!",
      "Want to build apps? Awesome! Our Flutter starter kit is perfect for beginners!",
      "App building is fun! Check out our 'First App' tutorial series to get started quickly!",
    ],
    blog: [
      "Oh yes! We post stories, updates, and tech guides regularly on our blog!",
      "Our blog is updated weekly with project ideas, tutorials, and tech news!",
      "Check out our blog for behind-the-scenes stories and tips from our developer team!",
    ],
    events: [
      "Yup! Workshops, hackathons, and more. We host events both online and offline throughout the year!",
      "We have monthly workshops and quarterly hackathons! Great way to meet other tech enthusiasts!",
      "Our next event is coming soon! We host everything from coding challenges to maker faires!",
    ],
    social: [
      "We're @ReViewTech on most platforms! Instagram, Twitter, YouTube - find us everywhere!",
      "Follow our socials for updates, behind-the-scenes content, and early announcements!",
      "We post daily on Instagram and have a YouTube channel with tutorials and project showcases!",
    ],
    loveSite: [
      "Aww! We love you more 💖 Thanks for the visit! Anything specific you're enjoying?",
      "That means a lot to us! We put a lot of work into making this site awesome for visitors like you!",
      "Thanks! We're always improving - let us know if you have suggestions to make it even better!",
    ],
    bye: [
      "Byeee! Come back soon for more fun 😄",
      "Take care! Don't be a stranger - come back anytime!",
      "Goodbye for now! Hope to chat again soon! 👋",
    ],
    studios: [
      "View-Studios creates professional web and mobile applications with cutting-edge design and technology!",
      "Our Studios team builds custom apps and websites for clients who need something special.",
      "Need a professional website or app? Our Studios division can build exactly what you need!",
    ],
    labs: [
      "N-8 Labs makes educational project kits for engineering students - especially ECE/EEE projects!",
      "Our Labs division focuses on creating hands-on learning experiences through project kits.",
      "N-8 Labs is passionate about making engineering education more practical and fun!",
    ],
    about: [
      "Re-View has three main divisions: Re-Games for fun, View-Studios for pro apps, and N-8 Labs for educational kits!",
      "We're a tech company founded by students who wanted to make technology more accessible and fun for everyone.",
      "We started in a college dorm room with a simple game, and now we've grown into a full tech company!",
    ],
    help: [
      "I can tell you about our games, kits, applications, or just chat! What are you curious about?",
      "I'm here for whatever you need! Questions about our products? Want recommendations? Just ask!",
      "How can I make your day better? I can explain our offerings or just have a friendly chat!",
    ],
    login: [
      "You can create an account or log in to access premium games, track orders, and save favorites!",
      "Logging in gives you access to your purchase history and lets you save your progress in games!",
      "Create an account to join our community and access exclusive content and early releases!",
    ],
    default: [
      "I'm still learning! Could you rephrase that or ask something else?",
      "Hmm, not sure I caught that. Want to try asking differently?",
      "Interesting! Tell me more or try asking something about our games, kits, or services!",
    ]
  };

  const getRandomResponse = (category: keyof typeof botResponses) => {
    const responses = botResponses[category];
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  };

  const getCategoryLinks = (category: string) => {
    // Only provide links when directly asked about specific services
    switch (category) {
      case "games":
        return [{ text: "Explore Games", url: "/games" }];
      case "bored":
      case "puzzle":
      case "challenge":
      case "newest":
      case "download":
      case "offline":
      case "mobile":
      case "educational":
      case "horror":
        return [{ text: "Open Games Page", url: "/games" }];
      case "studios":
      case "buildApps":
      case "testApps":
        return [{ text: "View Applications", url: "/studios" }];
      case "labs":
      case "kits":
      case "beginnerKits":
      case "robotics":
      case "science":
      case "manuals":
      case "orderOnline":
      case "returns":
      case "creative":
      case "cost":
        return [{ text: "Discover Kits", url: "/labs" }];
      case "about":
        return [
          { text: "Games", url: "/games" },
          { text: "Applications", url: "/studios" },
          { text: "Project Kits", url: "/labs" },
        ];
      case "help":
      case "confused":
        return [
          { text: "Games", url: "/games" },
          { text: "Applications", url: "/studios" },
          { text: "Project Kits", url: "/labs" },
        ];
      case "login":
        return [{ text: "Login / Register", url: "/login" }];
      case "events":
        return [{ text: "See Events", url: "/labs" }];
      case "blog":
        return [{ text: "Read Blog", url: "/studios" }];
      case "joinReview":
        return [{ text: "Join Us", url: "/studios" }];
      case "openSource":
        return [{ text: "GitHub Projects", url: "/labs" }];
      case "coolest":
        return [{ text: "View Projects", url: "/labs" }];
      default:
        return undefined;
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: newMessage,
      isBot: false,
    };

    setMessages([...messages, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    // Determine the appropriate response based on user input
    setTimeout(() => {
      const input = newMessage.toLowerCase();
      let responseCategory: keyof typeof botResponses = "default";
      let responseText = "";
      let responseLinks;

      // Enhanced fuzzy matching for intent recognition
      // Greetings with fuzzy matching
      if (fuzzyMatch(input, ["hi", "hey", "hello", "howdy", "sup", "yo", "greetings"])) {
        responseCategory = "greetings";
      } 
      // How are you with fuzzy matching
      else if (fuzzyMatch(input, ["how are you", "how're you doing", "how's it going", "what's up", "hows it going", "whats up", "hru"])) {
        responseCategory = "howAreYou";
      } 
      // Name queries with fuzzy matching 
      else if (fuzzyMatch(input, ["your name", "who are you", "what's your name", "whats your name"])) {
        responseCategory = "name";
      } 
      // Thanks with fuzzy matching
      else if (fuzzyMatch(input, ["thank", "thanks", "thx", "ty", "thank you"])) {
        responseCategory = "thanks";
      } 
      // Boredom with fuzzy matching
      else if (fuzzyMatch(input, ["i'm bored", "im bored", "bored", "nothing to do"])) {
        responseCategory = "bored";
        if (input.includes("see") || input.includes("visit") || input.includes("go to")) {
          responseLinks = getCategoryLinks("bored");
        }
      } 
      // Puzzles with fuzzy matching
      else if (fuzzyMatch(input, ["puzzle", "sudoku", "brain teaser", "puzle"])) {
        responseCategory = "puzzle";
        if (input.includes("see") || input.includes("visit") || input.includes("go to")) {
          responseLinks = getCategoryLinks("puzzle");
        }
      } 
      // Challenges with fuzzy matching
      else if (fuzzyMatch(input, ["challenge", "difficult", "hard", "tough", "advanced", "chalenge"])) {
        responseCategory = "challenge";
        if (input.includes("see") || input.includes("visit") || input.includes("go to")) {
          responseLinks = getCategoryLinks("challenge");
        }
      } 
      // Newest with fuzzy matching 
      else if (fuzzyMatch(input, ["newest", "latest", "new", "recent", "just launched"])) {
        responseCategory = "newest";
        if (input.includes("see") || input.includes("visit") || input.includes("go to")) {
          responseLinks = getCategoryLinks("newest");
        }
      } 
      // Downloads with fuzzy matching
      else if (fuzzyMatch(input, ["download", "get", "install", "apk", "downlod"])) {
        responseCategory = "download";
        if (input.includes("see") || input.includes("visit") || input.includes("go to")) {
          responseLinks = getCategoryLinks("download");
        }
      } 
      // Offline with fuzzy matching
      else if (fuzzyMatch(input, ["offline", "without internet", "no internet", "no wifi"])) {
        responseCategory = "offline";
        if (input.includes("see") || input.includes("visit") || input.includes("go to")) {
          responseLinks = getCategoryLinks("offline");
        }
      } 
      // Continue with the rest of the intent recognition 
      else if (fuzzyMatch(input, ["mobile", "phone", "tablet", "android", "ios"])) {
        responseCategory = "mobile";
        if (input.includes("see") || input.includes("visit") || input.includes("go to")) {
          responseLinks = getCategoryLinks("mobile");
        }
      } 
      else if (fuzzyMatch(input, ["education", "educational", "learn", "learning"])) {
        responseCategory = "educational";
        if (input.includes("see") || input.includes("visit") || input.includes("go to")) {
          responseLinks = getCategoryLinks("educational");
        }
      } 
      else if (fuzzyMatch(input, ["horror", "scary", "spooky", "creepy"])) {
        responseCategory = "horror";
        if (input.includes("see") || input.includes("visit") || input.includes("go to")) {
          responseLinks = getCategoryLinks("horror");
        }
      } 
      else if (fuzzyMatch(input, ["kits", "what's in", "whats in", "components"]) && !fuzzyMatch(input, ["studios", "games"])) {
        responseCategory = "kits";
        if (input.includes("see") || input.includes("visit") || input.includes("go to")) {
          responseLinks = getCategoryLinks("kits");
        }
      } 
      else if (fuzzyMatch(input, ["beginner", "starting", "novice", "new to", "first time"]) && fuzzyMatch(input, ["kits", "kit", "project"])) {
        responseCategory = "beginnerKits";
        if (input.includes("see") || input.includes("visit") || input.includes("go to")) {
          responseLinks = getCategoryLinks("beginnerKits");
        }
      } 
      else if (fuzzyMatch(input, ["safe", "safety", "dangerous", "child", "kid"])) {
        responseCategory = "safe";
      } 
      else if (fuzzyMatch(input, ["robot", "robotics", "bot", "automation"])) {
        responseCategory = "robotics";
        if (input.includes("see") || input.includes("visit") || input.includes("go to")) {
          responseLinks = getCategoryLinks("robotics");
        }
      } 
      else if (fuzzyMatch(input, ["science", "project", "school", "fair", "assignment"])) {
        responseCategory = "science";
        if (input.includes("see") || input.includes("visit") || input.includes("go to")) {
          responseLinks = getCategoryLinks("science");
        }
      } 
      else if (fuzzyMatch(input, ["manual", "manuals", "instruction", "guide", "documentation"])) {
        responseCategory = "manuals";
      } 
      else if (fuzzyMatch(input, ["order", "buy", "purchase", "ship"])) {
        responseCategory = "orderOnline";
      } 
      else if (fuzzyMatch(input, ["return", "refund", "money back", "exchange"])) {
        responseCategory = "returns";
        if (input.includes("see") || input.includes("visit") || input.includes("go to")) {
          responseLinks = getCategoryLinks("returns");
        }
      } 
      else if (fuzzyMatch(input, ["creative", "art", "design", "craft"])) {
        responseCategory = "creative";
        if (input.includes("see") || input.includes("visit") || input.includes("go to")) {
          responseLinks = getCategoryLinks("creative");
        }
      } 
      else if (fuzzyMatch(input, ["cost", "price", "how much", "expensive", "cheap", "affordable"])) {
        responseCategory = "cost";
      } 
      else if (fuzzyMatch(input, ["coolest", "best", "top", "impressive", "project"])) {
        responseCategory = "coolest";
        if (input.includes("see") || input.includes("visit") || input.includes("go to")) {
          responseLinks = getCategoryLinks("coolest");
        }
      } 
      else if (fuzzyMatch(input, ["test", "beta", "try", "preview", "early access"])) {
        responseCategory = "testApps";
        if (input.includes("see") || input.includes("visit") || input.includes("go to")) {
          responseLinks = getCategoryLinks("testApps");
        }
      } 
      else if (fuzzyMatch(input, ["make", "build", "create", "develop", "like this"])) {
        responseCategory = "makeSomething";
      } 
      else if (fuzzyMatch(input, ["student", "teen", "young", "made by"])) {
        responseCategory = "studentMade";
      } 
      else if (fuzzyMatch(input, ["open source", "github", "code", "repository", "contribute"])) {
        responseCategory = "openSource";
        if (input.includes("see") || input.includes("visit") || input.includes("go to")) {
          responseLinks = getCategoryLinks("openSource");
        }
      } 
      else if (fuzzyMatch(input, ["learn", "app dev", "application", "development", "coding"])) {
        responseCategory = "learnAppDev";
        if (input.includes("see") || input.includes("visit") || input.includes("go to")) {
          responseLinks = getCategoryLinks("buildApps");
        }
      } 
      else if (fuzzyMatch(input, ["intern", "internship", "job", "work", "career"])) {
        responseCategory = "internships";
        if (input.includes("see") || input.includes("visit") || input.includes("go to")) {
          responseLinks = getCategoryLinks("joinReview");
        }
      } 
      else if (fuzzyMatch(input, ["confused", "don't understand", "what is this", "help me"])) {
        responseCategory = "confused";
        responseLinks = getCategoryLinks("confused");
      } 
      else if (fuzzyMatch(input, ["cute", "nice", "cool", "awesome", "amazing", "good"]) && input.includes("you")) {
        responseCategory = "cute";
      } 
      else if (fuzzyMatch(input, ["who made", "creator", "developers", "team behind"])) {
        responseCategory = "whoMadeYou";
      } 
      else if (fuzzyMatch(input, ["join", "work at", "work with", "become part"])) {
        responseCategory = "joinReview";
        if (input.includes("see") || input.includes("visit") || input.includes("go to")) {
          responseLinks = getCategoryLinks("joinReview");
        }
      } 
      else if (fuzzyMatch(input, ["build apps", "create app", "create website", "create web"])) {
        responseCategory = "buildApps";
        if (input.includes("see") || input.includes("visit") || input.includes("go to")) {
          responseLinks = getCategoryLinks("buildApps");
        }
      } 
      else if (fuzzyMatch(input, ["blog", "article", "post", "news", "updates"])) {
        responseCategory = "blog";
        if (input.includes("see") || input.includes("visit") || input.includes("go to")) {
          responseLinks = getCategoryLinks("blog");
        }
      } 
      else if (fuzzyMatch(input, ["event", "workshop", "hackathon", "meetup", "conference"])) {
        responseCategory = "events";
        if (input.includes("see") || input.includes("visit") || input.includes("go to")) {
          responseLinks = getCategoryLinks("events");
        }
      } 
      else if (fuzzyMatch(input, ["insta", "instagram", "social", "follow", "twitter", "facebook"])) {
        responseCategory = "social";
      } 
      else if (fuzzyMatch(input, ["love", "like", "enjoy", "great", "wonderful"]) && fuzzyMatch(input, ["site", "website", "page"])) {
        responseCategory = "loveSite";
      } 
      else if (fuzzyMatch(input, ["bye", "goodbye", "see you", "later", "exit", "byeee", "cya"])) {
        responseCategory = "bye";
      } 
      else if (fuzzyMatch(input, ["game", "games"]) && (fuzzyMatch(input, ["about", "play", "explore", "see", "show me"]) || input === "game" || input === "games")) {
        responseCategory = "games";
        responseLinks = getCategoryLinks("games");
      } 
      else if (fuzzyMatch(input, ["studio", "studios"]) && fuzzyMatch(input, ["about", "explore", "see", "show me"])) {
        responseCategory = "studios";
        responseLinks = getCategoryLinks("studios");
      } 
      else if (fuzzyMatch(input, ["lab", "labs"]) && fuzzyMatch(input, ["about", "explore", "see", "show me"])) {
        responseCategory = "labs";
        responseLinks = getCategoryLinks("labs");
      } 
      else if (fuzzyMatch(input, ["about"])) {
        responseCategory = "about";
        responseLinks = getCategoryLinks("about");
      }
      else if (fuzzyMatch(input, ["help", "support", "assist"])) {
        responseCategory = "help";
        responseLinks = getCategoryLinks("help");
      }
      else if (fuzzyMatch(input, ["log in", "login", "sign in", "signin", "register", "account"])) {
        responseCategory = "login";
        responseLinks = getCategoryLinks("login");
      }

      responseText = getRandomResponse(responseCategory);

      const botMessage = {
        id: messages.length + 2,
        text: responseText,
        isBot: true,
        links: responseLinks,
      };

      setIsTyping(false);
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col z-50">
      {isOpen && (
        <div className="bg-white rounded-lg shadow-lg mb-2 w-80 sm:w-96 flex flex-col h-96 max-h-[80vh] overflow-hidden">
          <div className="bg-review-darkblue text-white p-3 flex items-center justify-between rounded-t-lg">
            <div className="flex items-center">
              <Bot size={20} className="mr-2" />
              <span className="font-medium">Chat with Revy</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-300"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-3 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.isBot ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.isBot
                      ? "bg-gray-100 text-gray-800"
                      : "bg-review-darkblue text-white"
                  }`}
                >
                  <div>{msg.text}</div>
                  {msg.links && (
                    <div className="mt-2 space-y-1">
                      {msg.links.map((link, i) => (
                        <Link
                          key={i}
                          to={link.url}
                          className="flex items-center text-review-blue hover:underline"
                        >
                          <ExternalLink size={12} className="mr-1" />
                          {link.text}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef}></div>
          </div>

          <div className="border-t p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-grow border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-review-blue"
                placeholder="Type a message..."
              />
              <button
                type="submit"
                className="bg-review-darkblue text-white rounded-r-lg px-3 py-2 hover:bg-review-blue transition-colors"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-review-darkblue text-white rounded-full p-3 shadow-lg hover:bg-review-blue transition-colors"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
};

export default ChatBot;
