
import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ChatBot from "../components/home/ChatBot";
import { Gamepad2, Joystick, Timer, Gamepad, Trophy, Puzzle, Zap, Brain, ScanSearch } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import AnimatedCard from "@/components/shared/AnimatedCard";

const Games = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 8;
  const totalPages = 3;

  useEffect(() => {
    // Scroll to top when component mounts or page changes
    window.scrollTo(0, 0);
    
    // Set page title
    document.title = "Re-Games | Mobile & Web Gaming Experiences";
  }, [currentPage]);

  const handlePlayNow = (gameName: string) => {
    toast.success(`Loading ${gameName}... Get ready to play!`);
  };

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
    
    if (emailInput && emailInput.value) {
      toast.success(`Thanks for subscribing! We'll notify you about our upcoming games.`);
      emailInput.value = '';
    } else {
      toast.error("Please enter a valid email address");
    }
  };

  // All games data
  const allGames = [
    // Adding Sudoku Sensei as the first game
    {
      id: 0,
      name: "Sudoku Sensei",
      description: "Master Sudoku with AI & Japanese Wisdom. Experience Sudoku like never before with AI solver, 30 levels of strategy, soothing aesthetics, and OCR magic.",
      tags: ["Puzzle", "Strategy", "AI"],
      icon: <Brain className="w-12 h-12" />,
      featured: true,
      features: [
        "AI Solver: Snap a pic of any puzzle and let our smart solver guide you",
        "30 Levels of Strategy: Progress from Beginner to Master",
        "Soothing Japanese Aesthetics: Sakura animations and tranquil tunes",
        "Smart Play Tools: Hints, real-time error checks, dark/offline modes",
        "OCR Magic: Convert printed puzzles into digital form"
      ]
    },
    // Page 1
    {
      id: 1,
      name: "Cyber Racers",
      description: "A high-speed racing game set in a futuristic cyberpunk world. Customize your vehicle and compete against AI or human players.",
      tags: ["Racing", "Multiplayer"],
      icon: <Gamepad2 className="w-12 h-12" />
    },
    {
      id: 2,
      name: "Cosmic Defenders",
      description: "An epic space adventure game where you defend your galaxy against alien invaders. Upgrade your weapons and unlock new abilities.",
      tags: ["Action", "Strategy"],
      icon: <Joystick className="w-12 h-12" />
    },
    {
      id: 3,
      name: "Puzzle Master",
      description: "Challenge your brain with hundreds of unique puzzles. From simple to mind-bending, there's something for everyone.",
      tags: ["Puzzle", "Casual"],
      icon: <Puzzle className="w-12 h-12" />
    },
    {
      id: 4,
      name: "Speed Legends",
      description: "Become the fastest driver in this adrenaline-pumping racing simulator with realistic physics and stunning environments.",
      tags: ["Racing", "Simulation"],
      icon: <Zap className="w-12 h-12" />
    },
    {
      id: 5,
      name: "Battle Arena",
      description: "Enter the arena and fight your way to glory in this competitive multiplayer battle game with unique character abilities.",
      tags: ["Action", "PvP"],
      icon: <Trophy className="w-12 h-12" />
    },
    {
      id: 6,
      name: "Mystery Manor",
      description: "Solve the mystery of the abandoned manor by finding clues, solving puzzles, and uncovering the dark secrets within.",
      tags: ["Adventure", "Mystery"],
      icon: <Gamepad className="w-12 h-12" />
    },
    {
      id: 7,
      name: "Rhythm Master",
      description: "Test your musical timing and reflexes in this addictive rhythm game featuring tracks from popular artists.",
      tags: ["Rhythm", "Music"],
      icon: <Gamepad2 className="w-12 h-12" />
    },
    {
      id: 8,
      name: "Fantasy Kingdoms",
      description: "Build and expand your medieval kingdom, form alliances, and conquer rival territories in this strategy game.",
      tags: ["Strategy", "MMO"],
      icon: <Gamepad className="w-12 h-12" />
    },
    // Page 2
    {
      id: 9,
      name: "Ninja Warrior",
      description: "Master the art of stealth and combat as a ninja warrior on a mission to defeat evil forces threatening your clan.",
      tags: ["Action", "Adventure"],
      icon: <Gamepad2 className="w-12 h-12" />
    },
    {
      id: 10,
      name: "Space Explorers",
      description: "Embark on an interstellar journey to explore uncharted planets, discover alien species, and collect valuable resources.",
      tags: ["Exploration", "Sci-Fi"],
      icon: <Joystick className="w-12 h-12" />
    },
    // Add more games for page 2 (IDs 11-16)
    {
      id: 11,
      name: "Word Wizards",
      description: "Put your vocabulary to the test in this word puzzle game with multiple challenging modes and daily competitions.",
      tags: ["Word", "Puzzle"],
      icon: <Puzzle className="w-12 h-12" />
    },
    {
      id: 12,
      name: "Football Champions",
      description: "Lead your team to victory in this realistic football simulation game with authentic teams and strategic gameplay.",
      tags: ["Sports", "Simulation"],
      icon: <Trophy className="w-12 h-12" />
    },
    {
      id: 13,
      name: "Monster Hunter",
      description: "Track and hunt legendary monsters across vast landscapes while upgrading your gear and mastering different weapons.",
      tags: ["RPG", "Action"],
      icon: <Gamepad className="w-12 h-12" />
    },
    {
      id: 14,
      name: "City Builder",
      description: "Design and develop your dream city, manage resources, and keep your citizens happy in this immersive simulation.",
      tags: ["Simulation", "Strategy"],
      icon: <Joystick className="w-12 h-12" />
    },
    {
      id: 15,
      name: "Dungeon Delver",
      description: "Explore randomly generated dungeons, fight monsters, and collect treasure in this roguelike adventure.",
      tags: ["Roguelike", "RPG"],
      icon: <Gamepad2 className="w-12 h-12" />
    },
    {
      id: 16,
      name: "Cooking Master",
      description: "Test your culinary skills in fast-paced cooking challenges against the clock or other players online.",
      tags: ["Casual", "Multiplayer"],
      icon: <Zap className="w-12 h-12" />
    },
    // Page 3
    {
      id: 17,
      name: "Zombie Survival",
      description: "Survive in a post-apocalyptic world overrun by zombies. Scavenge for supplies and build defenses to stay alive.",
      tags: ["Survival", "Horror"],
      icon: <Gamepad className="w-12 h-12" />
    },
    {
      id: 18,
      name: "Card Kingdom",
      description: "Collect cards, build powerful decks, and battle against other players in this strategic card game.",
      tags: ["Card Game", "Strategy"],
      icon: <Trophy className="w-12 h-12" />
    },
    {
      id: 19,
      name: "Astro Golf",
      description: "Play golf across the galaxy on planets with different gravity, obstacles, and environments.",
      tags: ["Sports", "Casual"],
      icon: <Puzzle className="w-12 h-12" />
    },
    {
      id: 20,
      name: "Pirate Adventures",
      description: "Set sail on the high seas, discover treasure islands, engage in ship battles, and become the most feared pirate.",
      tags: ["Adventure", "Open World"],
      icon: <Gamepad2 className="w-12 h-12" />
    },
    {
      id: 21,
      name: "Robot Wars",
      description: "Build and customize battle robots, then fight in arena competitions against other robot engineers.",
      tags: ["Action", "Building"],
      icon: <Joystick className="w-12 h-12" />
    },
    {
      id: 22,
      name: "Fashion Designer",
      description: "Create trendy fashion designs, run your own boutique, and become a famous fashion designer.",
      tags: ["Simulation", "Casual"],
      icon: <Zap className="w-12 h-12" />
    },
    {
      id: 23,
      name: "Desert Racing",
      description: "Race through challenging desert terrain in powerful off-road vehicles under extreme weather conditions.",
      tags: ["Racing", "Extreme"],
      icon: <Gamepad className="w-12 h-12" />
    },
    {
      id: 24,
      name: "Magic Academy",
      description: "Attend a school of magic, learn spells, brew potions, and compete in magical tournaments.",
      tags: ["Fantasy", "RPG"],
      icon: <Puzzle className="w-12 h-12" />
    }
  ];

  // Get current page games
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = allGames.slice(indexOfFirstGame, indexOfLastGame);

  // Find featured game (Sudoku Sensei)
  const featuredGame = allGames.find(game => game.featured);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-review-darkblue">
      {/* Gaming animation elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Controller animation */}
        <div className="absolute top-1/4 left-20 opacity-10 animate-float" style={{ animationDuration: "15s" }}>
          <Gamepad2 size={120} className="text-review-cyan" />
        </div>
        
        {/* Console animation */}
        <div className="absolute bottom-1/4 right-20 opacity-10 animate-float" style={{ animationDuration: "18s", animationDelay: "2s" }}>
          <Joystick size={100} className="text-review-cyan" />
        </div>
        
        {/* Timer animation */}
        <div className="absolute top-1/3 right-1/4 opacity-10 animate-float" style={{ animationDuration: "12s", animationDelay: "1s" }}>
          <Timer size={80} className="text-review-cyan" />
        </div>
        
        {/* Gaming pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#0AFFFF_1px,transparent_1px)] opacity-5" style={{ backgroundSize: "30px 30px" }}></div>
      </div>
      
      <Navbar />
      <main className="flex-grow pt-24 relative z-10">
        <section className="section">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-review-cyan">
                Re-Games
              </h1>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Our collection of immersive gaming experiences powered by cutting-edge AI technology.
              </p>
            </div>
            
            {/* Featured Game - Sudoku Sensei */}
            {featuredGame && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold text-review-cyan mb-6">Featured Game</h2>
                <AnimatedCard delay={0} className="h-full">
                  <Card className="border-review-cyan/20 shadow-md bg-review-black/30 hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-2/5 bg-gradient-to-br from-purple-900 to-blue-800 p-6 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-review-cyan mx-auto mb-4">
                            <Brain className="w-24 h-24 md:w-32 md:h-32 mx-auto" />
                          </div>
                          <h3 className="text-3xl font-bold text-white mb-2">{featuredGame.name}</h3>
                          <div className="flex gap-2 mb-4 flex-wrap justify-center">
                            {featuredGame.tags.map((tag, i) => (
                              <span key={i} className="bg-review-cyan/10 text-review-cyan text-xs font-medium px-2.5 py-0.5 rounded">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="md:w-3/5 p-6">
                        <p className="text-gray-300 mb-4">
                          {featuredGame.description}
                        </p>
                        <h4 className="text-review-cyan font-semibold mb-2">✨ Features You'll Love:</h4>
                        <ul className="space-y-2 mb-6">
                          {featuredGame.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-review-cyan">•</span>
                              <span className="text-gray-300 text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex gap-4 flex-wrap">
                          <Button 
                            className="bg-review-black hover:bg-gray-900 text-review-cyan border border-review-cyan/30"
                            onClick={() => handlePlayNow(featuredGame.name)}
                          >
                            Play on Web
                          </Button>
                          <Button
                            variant="outline"
                            className="text-white border-review-cyan/30 hover:bg-review-cyan/10"
                            onClick={() => toast.success(`Downloading ${featuredGame.name}... Please check your downloads.`)}
                          >
                            Download APK
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </AnimatedCard>
              </div>
            )}
            
            {/* Game list in Cards */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-review-cyan mb-6">All Games</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {currentGames.map((game, index) => (
                  <AnimatedCard key={game.id} delay={index * 100} className="h-full">
                    <Card className="border-review-cyan/20 shadow-md bg-review-black/30 hover:shadow-lg transition-shadow h-full">
                      <CardHeader>
                        <div className="mb-4 text-review-cyan">
                          {game.icon}
                        </div>
                        <CardTitle className="text-review-cyan">{game.name}</CardTitle>
                        <CardDescription className="text-gray-300">
                          {game.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2 mb-2">
                          {game.tags.map((tag, i) => (
                            <span key={i} className="bg-review-cyan/10 text-review-cyan text-xs font-medium px-2.5 py-0.5 rounded">{tag}</span>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full bg-review-black hover:bg-gray-900 text-review-cyan border border-review-cyan/30"
                          onClick={() => handlePlayNow(game.name)}
                        >
                          Play Now
                        </Button>
                      </CardFooter>
                    </Card>
                  </AnimatedCard>
                ))}
              </div>
              
              {/* Pagination */}
              <div className="mt-12 mb-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} text-review-cyan border border-review-cyan/30`}
                      />
                    </PaginationItem>
                    {[1, 2, 3].map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => handlePageChange(page)}
                          className={`cursor-pointer ${
                            currentPage === page
                              ? 'bg-review-cyan text-review-black border border-review-cyan'
                              : 'text-review-cyan border border-review-cyan/30'
                          }`}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'} text-review-cyan border border-review-cyan/30`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
            
            {/* Upcoming Games Section */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-review-cyan mb-6">Upcoming Releases</h2>
              
              <Card className="border-review-cyan/20 shadow-md bg-review-black/30 p-6">
                <div className="text-center">
                  <p className="text-gray-300 mb-6">
                    We're constantly developing new gaming experiences. Check back soon for our upcoming releases!
                  </p>
                  
                  <h3 className="text-review-cyan text-lg font-semibold mb-2">Want to be notified about new games?</h3>
                  
                  {/* Email signup form */}
                  <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input 
                        type="email" 
                        name="email"
                        placeholder="Your email address" 
                        className="bg-review-black/50 border border-review-cyan/20 rounded px-4 py-2 text-gray-200 flex-grow"
                      />
                      <Button 
                        type="submit"
                        className="bg-review-black hover:bg-gray-900 text-review-cyan border border-review-cyan/30"
                      >
                        Subscribe
                      </Button>
                    </div>
                  </form>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Games;
