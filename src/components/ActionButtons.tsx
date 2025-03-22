import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';

export function ActionButtons() {
  const [starModalOpen, setStarModalOpen] = useState(false);
  const [playModalOpen, setPlayModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [betAmount, setBetAmount] = useState(10);
  
  const favoriteGames = [
    { id: 1, name: "Bubble Pop", lastPlayed: "2 hours ago" },
    { id: 2, name: "Color Match", lastPlayed: "Yesterday" },
    { id: 3, name: "Number Crush", lastPlayed: "3 days ago" },
    { id: 4, name: "Star Collector", lastPlayed: "1 week ago" },
  ];

  return (
    <div className="relative z-10 p-4 flex flex-col items-center gap-4">
      <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-8 rounded-full shadow-md transition-transform hover:scale-105 active:scale-95 uppercase text-sm tracking-wider">
        Bet
      </button>
      
      <div className="flex items-center gap-4">
        {/* Star Button with Favorites Modal */}
        <button 
          className="w-10 h-10 rounded-full bg-blue-400 hover:bg-blue-500 flex items-center justify-center text-white shadow-md transition-transform hover:scale-105 active:scale-95"
          onClick={() => setStarModalOpen(true)}
        >
          <StarIcon />
        </button>
        
        <Dialog open={starModalOpen} onOpenChange={setStarModalOpen}>
          <DialogContent className="bg-gradient-to-b from-blue-100 to-purple-100 border-2 border-yellow-300 rounded-xl max-w-xs sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold text-purple-700 flex items-center justify-center gap-2">
                <StarIcon className="text-yellow-500" /> Favorite Games
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 my-2">
              {favoriteGames.map(game => (
                <div 
                  key={game.id} 
                  className="bg-white/70 backdrop-blur-sm p-3 rounded-lg flex justify-between items-center hover:bg-white/90 transition-colors cursor-pointer"
                >
                  <div>
                    <h3 className="font-medium text-purple-800">{game.name}</h3>
                    <p className="text-xs text-gray-500">{game.lastPlayed}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="text-yellow-500 hover:text-yellow-600 hover:bg-yellow-100">
                    <PlaySmallIcon />
                  </Button>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button 
                onClick={() => setStarModalOpen(false)}
                className="w-full bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white rounded-full"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Play Button with Game Start Modal */}
        <button 
          className="w-14 h-14 rounded-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center text-white shadow-md transition-transform hover:scale-105 active:scale-95"
          onClick={() => setPlayModalOpen(true)}
        >
          <PlayIcon />
        </button>
        
        <Dialog open={playModalOpen} onOpenChange={setPlayModalOpen}>
          <DialogContent className="bg-gradient-to-b from-pink-100 to-orange-100 border-2 border-pink-300 rounded-xl max-w-xs sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold text-pink-700">
                Start Game
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 my-2">
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg">
                <Label htmlFor="bet" className="text-pink-800 font-medium block mb-2">
                  Your Bet
                </Label>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={() => setBetAmount(Math.max(5, betAmount - 5))}
                  >
                    -
                  </Button>
                  <Input 
                    id="bet"
                    type="number" 
                    value={betAmount} 
                    onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)}
                    className="text-center font-bold text-pink-700"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={() => setBetAmount(betAmount + 5)}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white rounded-full py-6 text-lg font-bold"
              >
                START
              </Button>
            </div>
            <DialogFooter>
              <Button 
                onClick={() => setPlayModalOpen(false)}
                variant="outline"
                className="w-full border-pink-300 text-pink-700 rounded-full"
              >
                Back
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Settings Button with Settings Modal */}
        <button 
          className="w-10 h-10 rounded-full bg-blue-400 hover:bg-blue-500 flex items-center justify-center text-white shadow-md transition-transform hover:scale-105 active:scale-95"
          onClick={() => setSettingsModalOpen(true)}
        >
          <SettingsIcon />
        </button>
        
        <Dialog open={settingsModalOpen} onOpenChange={setSettingsModalOpen}>
          <DialogContent className="bg-gradient-to-b from-blue-100 to-green-100 border-2 border-blue-300 rounded-xl max-w-xs sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold text-blue-700 flex items-center justify-center gap-2">
                <SettingsIcon className="text-blue-500" /> Game Settings
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 my-2">
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sound" className="text-blue-800 font-medium">
                    Sound
                  </Label>
                  <Switch id="sound" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="music" className="text-blue-800 font-medium">
                      Music Volume
                    </Label>
                    <span className="text-sm text-blue-600 font-medium">75%</span>
                  </div>
                  <Slider id="music" defaultValue={[75]} max={100} step={1} />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="vibration" className="text-blue-800 font-medium">
                    Vibration
                  </Label>
                  <Switch id="vibration" />
                </div>
              </div>
              
              <Button 
                variant="destructive"
                className="w-full rounded-full"
              >
                Exit Game
              </Button>
            </div>
            <DialogFooter>
              <Button 
                onClick={() => setSettingsModalOpen(false)}
                className="w-full bg-gradient-to-r from-blue-400 to-green-400 hover:from-blue-500 hover:to-green-500 text-white rounded-full"
              >
                Save Settings
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function StarIcon({ className = "" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M8 5V19L19 12L8 5Z" />
    </svg>
  );
}

function PlaySmallIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M8 5V19L19 12L8 5Z" />
    </svg>
  );
}

function SettingsIcon({ className = "" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}