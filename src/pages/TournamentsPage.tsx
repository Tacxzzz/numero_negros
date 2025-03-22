import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

type Tournament = {
  id: number;
  name: string;
  gameType: string;
  entryFee: number;
  prizePool: number;
  startDate: string;
  endDate: string;
  maxPlayers: number;
  currentPlayers: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  image: string;
  description: string;
  schedule?: TournamentSchedule[];
  leaderboard?: TournamentPlayer[];
};

type TournamentSchedule = {
  id: number;
  stage: string;
  date: string;
  time: string;
  description: string;
  completed: boolean;
};

type TournamentPlayer = {
  id: number;
  name: string;
  avatar: string;
  score: number;
  position: number;
  isUser?: boolean;
};

export function TournamentsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [gameTypeFilter, setGameTypeFilter] = useState('all');
  
  // Mock data for tournaments
  const tournaments: Tournament[] = [
    {
      id: 1,
      name: "Weekly Puzzle Masters",
      gameType: "Puzzle",
      entryFee: 25,
      prizePool: 5000,
      startDate: "2023-05-20",
      endDate: "2023-05-27",
      maxPlayers: 100,
      currentPlayers: 78,
      status: 'upcoming',
      image: "https://picsum.photos/id/237/400/200",
      description: "Compete against the best puzzle solvers in this week-long tournament. Daily challenges with increasing difficulty.",
      schedule: [
        { id: 1, stage: "Registration", date: "2023-05-18", time: "00:00", description: "Registration opens", completed: true },
        { id: 2, stage: "Qualification Round", date: "2023-05-20", time: "12:00", description: "Solve 5 puzzles to qualify", completed: false },
        { id: 3, stage: "Quarter Finals", date: "2023-05-22", time: "15:00", description: "Top 64 players advance", completed: false },
        { id: 4, stage: "Semi Finals", date: "2023-05-24", time: "15:00", description: "Top 16 players compete", completed: false },
        { id: 5, stage: "Finals", date: "2023-05-27", time: "18:00", description: "Top 4 players battle for the championship", completed: false }
      ]
    },
    {
      id: 2,
      name: "High Roller Casino Cup",
      gameType: "Casino",
      entryFee: 100,
      prizePool: 25000,
      startDate: "2023-05-15",
      endDate: "2023-05-22",
      maxPlayers: 50,
      currentPlayers: 50,
      status: 'ongoing',
      image: "https://picsum.photos/id/239/400/200",
      description: "VIP tournament for high rollers. Multiple casino games with accumulated points system.",
      schedule: [
        { id: 1, stage: "Registration", date: "2023-05-10", time: "00:00", description: "VIP registration", completed: true },
        { id: 2, stage: "Opening Round", date: "2023-05-15", time: "20:00", description: "Roulette championship", completed: true },
        { id: 3, stage: "Second Round", date: "2023-05-17", time: "20:00", description: "Blackjack tournament", completed: true },
        { id: 4, stage: "Third Round", date: "2023-05-19", time: "20:00", description: "Poker showdown", completed: false },
        { id: 5, stage: "Finals", date: "2023-05-22", time: "21:00", description: "Final table with top 6 players", completed: false }
      ],
      leaderboard: [
        { id: 1, name: "PokerKing", avatar: "https://picsum.photos/id/1001/40/40", score: 2450, position: 1 },
        { id: 2, name: "CasinoRoyal", avatar: "https://picsum.photos/id/1002/40/40", score: 2340, position: 2 },
        { id: 3, name: "LuckyAce", avatar: "https://picsum.photos/id/1003/40/40", score: 2210, position: 3 },
        { id: 4, name: "BlackjackPro", avatar: "https://picsum.photos/id/1004/40/40", score: 2150, position: 4 },
        { id: 5, name: "GamblerKing", avatar: "https://picsum.photos/id/1005/40/40", score: 1980, position: 5 },
        { id: 6, name: "PlayerOne", avatar: "https://picsum.photos/id/1006/40/40", score: 1850, position: 6, isUser: true },
      ]
    },
    {
      id: 3,
      name: "Arcade Champions League",
      gameType: "Arcade",
      entryFee: 10,
      prizePool: 2000,
      startDate: "2023-05-10",
      endDate: "2023-05-15",
      maxPlayers: 200,
      currentPlayers: 200,
      status: 'completed',
      image: "https://picsum.photos/id/240/400/200",
      description: "Fast-paced arcade tournament with multiple classic games. Highest combined score wins!",
      leaderboard: [
        { id: 1, name: "RetroGamer", avatar: "https://picsum.photos/id/1011/40/40", score: 9850, position: 1 },
        { id: 2, name: "ArcadeMaster", avatar: "https://picsum.photos/id/1012/40/40", score: 9720, position: 2 },
        { id: 3, name: "PixelHero", avatar: "https://picsum.photos/id/1013/40/40", score: 9580, position: 3 },
        { id: 4, name: "GameWizard", avatar: "https://picsum.photos/id/1014/40/40", score: 9320, position: 4 },
        { id: 5, name: "PlayerOne", avatar: "https://picsum.photos/id/1006/40/40", score: 8950, position: 5, isUser: true },
      ]
    },
    {
      id: 4,
      name: "Slots Spectacular",
      gameType: "Slots",
      entryFee: 50,
      prizePool: 10000,
      startDate: "2023-05-25",
      endDate: "2023-05-28",
      maxPlayers: 500,
      currentPlayers: 320,
      status: 'upcoming',
      image: "https://picsum.photos/id/241/400/200",
      description: "The biggest slots tournament of the month! Spin to win with progressive multipliers.",
      schedule: [
        { id: 1, stage: "Registration", date: "2023-05-20", time: "00:00", description: "Registration opens", completed: true },
        { id: 2, stage: "Qualification", date: "2023-05-25", time: "10:00", description: "Qualification rounds begin", completed: false },
        { id: 3, stage: "Wild Card Round", date: "2023-05-26", time: "15:00", description: "Last chance to qualify", completed: false },
        { id: 4, stage: "Semi Finals", date: "2023-05-27", time: "15:00", description: "Top 50 players compete", completed: false },
        { id: 5, stage: "Finals", date: "2023-05-28", time: "20:00", description: "Top 10 players in final showdown", completed: false }
      ]
    },
    {
      id: 5,
      name: "Sports Betting Championship",
      gameType: "Sports",
      entryFee: 75,
      prizePool: 15000,
      startDate: "2023-05-18",
      endDate: "2023-05-21",
      maxPlayers: 150,
      currentPlayers: 132,
      status: 'ongoing',
      image: "https://picsum.photos/id/242/400/200",
      description: "Test your sports prediction skills across multiple sports events. Daily leaderboards and final championship round.",
      schedule: [
        { id: 1, stage: "Registration", date: "2023-05-15", time: "00:00", description: "Registration opens", completed: true },
        { id: 2, stage: "Day 1: Soccer", date: "2023-05-18", time: "12:00", description: "Soccer predictions", completed: true },
        { id: 3, stage: "Day 2: Basketball", date: "2023-05-19", time: "12:00", description: "Basketball predictions", completed: true },
        { id: 4, stage: "Day 3: Tennis", date: "2023-05-20", time: "12:00", description: "Tennis predictions", completed: false },
        { id: 5, stage: "Finals: Mixed Sports", date: "2023-05-21", time: "15:00", description: "Final predictions across all sports", completed: false }
      ],
      leaderboard: [
        { id: 1, name: "SportsPro", avatar: "https://picsum.photos/id/1021/40/40", score: 580, position: 1 },
        { id: 2, name: "BettingKing", avatar: "https://picsum.photos/id/1022/40/40", score: 565, position: 2 },
        { id: 3, name: "PlayerOne", avatar: "https://picsum.photos/id/1006/40/40", score: 550, position: 3, isUser: true },
        { id: 4, name: "PredictionMaster", avatar: "https://picsum.photos/id/1024/40/40", score: 535, position: 4 },
        { id: 5, name: "SportsGuru", avatar: "https://picsum.photos/id/1025/40/40", score: 520, position: 5 },
      ]
    },
  ];
  
  // Filter tournaments based on status
  const filterTournamentsByStatus = (tournaments: Tournament[]) => {
    if (filter === 'all') return tournaments;
    return tournaments.filter(tournament => tournament.status === filter);
  };
  
  // Filter tournaments based on search query
  const filterTournamentsBySearch = (tournaments: Tournament[]) => {
    if (!searchQuery.trim()) return tournaments;
    const query = searchQuery.toLowerCase();
    return tournaments.filter(
      tournament => 
        tournament.name.toLowerCase().includes(query) ||
        tournament.description.toLowerCase().includes(query)
    );
  };
  
  // Filter tournaments based on game type
  const filterTournamentsByGameType = (tournaments: Tournament[]) => {
    if (gameTypeFilter === 'all') return tournaments;
    return tournaments.filter(tournament => tournament.gameType.toLowerCase() === gameTypeFilter.toLowerCase());
  };
  
  // Apply all filters
  const filteredTournaments = filterTournamentsByGameType(
    filterTournamentsBySearch(
      filterTournamentsByStatus(tournaments)
    )
  );
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Dashboard
          </button>
          
          <h1 className="text-xl font-bold text-center flex-1">Tournaments</h1>
          
          <div className="w-[60px]"></div> {/* Spacer for balance */}
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {/* Featured Tournament Banner */}
        <div className="relative rounded-xl overflow-hidden mb-6 bg-gradient-to-r from-purple-600 to-blue-600">
          <img 
            src="https://picsum.photos/id/237/1200/300" 
            alt="Featured Tournament" 
            className="w-full h-48 object-cover mix-blend-overlay opacity-50"
          />
          <div className="absolute inset-0 p-6 flex flex-col justify-center text-white">
            <Badge className="bg-yellow-500 text-white mb-2 w-fit">Featured</Badge>
            <h2 className="text-2xl font-bold mb-2">Weekly Puzzle Masters</h2>
            <p className="mb-4 max-w-lg">Join our biggest tournament of the month with a prize pool of $5,000!</p>
            <Button className="bg-white text-purple-700 hover:bg-gray-100 w-fit">
              Register Now
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Tournaments
              </label>
              <Input
                id="search"
                type="text"
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-48">
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tournaments</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-48">
              <label htmlFor="game-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Game Type
              </label>
              <Select value={gameTypeFilter} onValueChange={setGameTypeFilter}>
                <SelectTrigger id="game-filter">
                  <SelectValue placeholder="Filter by game" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Games</SelectItem>
                  <SelectItem value="puzzle">Puzzle</SelectItem>
                  <SelectItem value="casino">Casino</SelectItem>
                  <SelectItem value="arcade">Arcade</SelectItem>
                  <SelectItem value="slots">Slots</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
          <div className="flex justify-around items-center py-2">
              <Link to="/dashboard" className="flex flex-col items-center p-2 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  <span className="text-xs mt-1">Home</span>
              </Link>
              <Link to="/my-bets" className="flex flex-col items-center p-2 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <ellipse cx="12" cy="5" rx="8" ry="3"></ellipse>
                    <path d="M4 5v6a8 3 0 0 0 16 0V5"></path>
                    <path d="M4 11v6a8 3 0 0 0 16 0v-6"></path>
                    </svg>
                    <span className="text-xs mt-1">My Bets</span>
              </Link>
              <Link to="/tournaments" className="flex flex-col items-center p-2 text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                      <path d="M4 22h16"></path>
                      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                    </svg>
                    <span className="text-xs mt-1">Tournaments</span>
              </Link>
              <Link to="/support" className="flex flex-col items-center p-2 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 17h.01"></path>
                <path d="M12 13a3 3 0 1 0-3-3"></path>
                </svg>
                <span className="text-xs mt-1">Support</span>
              </Link>
          </div>
        </div>
        
        {/* Tournaments List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredTournaments.length > 0 ? (
            filteredTournaments.map(tournament => (
              <Card key={tournament.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={tournament.image} 
                    alt={tournament.name} 
                    className="w-full h-40 object-cover"
                  />
                  <Badge 
                    className={
                      tournament.status === 'upcoming' 
                        ? 'bg-blue-500 hover:bg-blue-600 absolute top-2 right-2' 
                        : tournament.status === 'ongoing'
                        ? 'bg-green-500 hover:bg-green-600 absolute top-2 right-2'
                        : 'bg-gray-500 hover:bg-gray-600 absolute top-2 right-2'
                    }
                  >
                    {tournament.status === 'upcoming' ? 'Upcoming' : tournament.status === 'ongoing' ? 'Live' : 'Completed'}
                  </Badge>
                </div>
                
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{tournament.name}</CardTitle>
                      <CardDescription>{tournament.gameType}</CardDescription>
                    </div>
                    <Badge variant="outline" className="border-purple-300 text-purple-700">
                      ${tournament.entryFee}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-2">{tournament.description}</p>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Prize Pool:</span>
                      <span className="font-medium text-green-600">${tournament.prizePool.toLocaleString()}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Players:</span>
                        <span className="font-medium">{tournament.currentPlayers}/{tournament.maxPlayers}</span>
                      </div>
                      <Progress value={(tournament.currentPlayers / tournament.maxPlayers) * 100} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Dates:</span>
                      <span className="font-medium">
                        {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full"
                    variant={tournament.status === 'completed' ? 'outline' : 'default'}
                    onClick={() => navigate(`/tournaments/${tournament.id}`)}
                  >
                    {tournament.status === 'upcoming' ? 'Register' : tournament.status === 'ongoing' ? 'View Live' : 'View Results'}
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400 mb-4">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <path d="M12 12h.01" />
                <path d="M17 12h.01" />
                <path d="M7 12h.01" />
              </svg>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No tournaments found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters to find tournaments</p>
              <Button onClick={() => {
                setFilter('all');
                setGameTypeFilter('all');
                setSearchQuery('');
              }}>Reset Filters</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}