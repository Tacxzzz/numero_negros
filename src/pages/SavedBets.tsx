import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { addBetClients, addLog, confirmSavedBets, deleteSavedBets, getDrawsResults, getMyBetClients, getMySavedBets, updateBetClient } from '@/lib/apiCalls';
import { getTransCode } from '@/lib/utils';
import { useUser } from "./UserContext";
import { useClient } from "./ClientContext";
import useBrowserCheck from '@/components/WebBrowserChecker';
import OpenInExternalBrowser from '@/components/OpenInExternalBrowser';
import { Button } from '@/components/ui/button';

export function SavedBets() {
  const navigate = useNavigate();
  const { setUserID,userID,deviceID } = useUser();
  
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [savedBets, setSavedBets] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState<"delete" | "confirm" | null>(null);
  const [selectedDrawDateTimes, setSelectedDrawDateTimes] = useState<string[]>([]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const uniqueDrawDateTimes = [
    ...new Set(
        savedBets
        .filter((b) => !b.response || b.response.trim() === "" || b.response === "insufficient balance")
        .map((b) => `${b.draw_date} ${b.draw_time}`)
    ),
    ];

  const handleAction = (type: "delete" | "confirm") => {
    setActionType(type);
    setShowConfirmModal(true);
  };

  const handleModalConfirm = () => {
    if (actionType === "delete") {
      deleteSelected();
    } else if (actionType === "confirm") {
      confirmSelected();
    }
    setShowConfirmModal(false);
  };

  const handleModalCancel = () => {
    setShowConfirmModal(false);
  };
  
   useEffect(() => {
    const handleUpdate = async () => {

      const gameSaveBetData = await getMySavedBets(userID);
      setSavedBets(gameSaveBetData);

      const addViewLog = await addLog(userID, "visited Saved Bets");
      console.log(addViewLog.authenticated);
      };
      handleUpdate();
  }, [userID]);

  const filteredBets = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return savedBets.filter(
      (bet) =>
        bet.bets.toLowerCase().includes(lowerSearch) ||
        bet.game_name.toLowerCase().includes(lowerSearch) ||
        bet.bakas_full_name.toLowerCase().includes(lowerSearch)
    );
  }, [search, savedBets]);

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const currentIds = filteredBets.map((b) => b.id);
    const allSelected = currentIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...currentIds])));
    }
  };

  const confirmSelected = async () => {
    setLoading(true);
    const data = await confirmSavedBets(userID, selectedIds);

    if(data.authenticated)
      {
        alert(data.message);
        window.location.reload();
      }
      else
      {
        alert(data.message);
        setLoading(false);
      }
  };

  const deleteSelected = async () => {
    setLoading(true);
    const data = await deleteSavedBets(userID, selectedIds);

    if(data.authenticated)
      {
        alert(data.message);
        window.location.reload();
      }
      else
      {
        alert(data.message);
        setLoading(false);
      }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedBets = filteredBets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredBets.length / itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        if (currentPage > 4) pages.push("...");

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) pages.push(i);

        if (currentPage < totalPages - 3) pages.push("...");
        pages.push(totalPages);
    }

    return pages;
    };
  
    const totalBetAmount = filteredBets.reduce((sum, bet) => sum + parseFloat(bet.bet || 0), 0);
  
  if (loading) {
        return (
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-xl font-bold mb-4">Game Loading..</h2>
              <Button             
              onClick={e => {
              e.preventDefault();
              window.location.href = "/dashboard";
              }}>Back to Dashboard</Button>
            </div>
          </div>
        );
      }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <button
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/dashboard";
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-xl font-bold text-center flex-1">Saved Bets</h1>
          <div className="w-[60px]" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Search and Select All */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by Bet Number, Game or Client Name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIds([]); // reset selection on search
            }}
            className="border border-gray-300 rounded px-3 py-2 w-full max-w-xs"
          />
        </div>

        <div className="mb-4">
        <p className="font-medium mb-2">Select by Draw Date & Time:</p>
        <div className="flex flex-wrap gap-3">
        {uniqueDrawDateTimes.map((dt) => {
            // Calculate the total bet amount for this date-time
            const totalAmount = filteredBets
            .filter(
                (b) =>
                `${b.draw_date} ${b.draw_time}` === dt &&
                (!b.response || b.response.trim() === "" || b.response === "insufficient balance")
            )
            .reduce((sum, b) => sum + Number(b.bet || 0), 0);

            return (
            <label key={dt} className="flex items-center space-x-2">
                <input
                type="checkbox"
                checked={selectedDrawDateTimes.includes(dt)}
                onChange={() => {
                    const isSelected = selectedDrawDateTimes.includes(dt);
                    const newSelected = isSelected
                    ? selectedDrawDateTimes.filter((d) => d !== dt)
                    : [...selectedDrawDateTimes, dt];

                    setSelectedDrawDateTimes(newSelected);

                    const relatedIds = filteredBets
                    .filter(
                        (b) =>
                        `${b.draw_date} ${b.draw_time}` === dt &&
                        (!b.response || b.response.trim() === "" || b.response === "insufficient balance")
                    )
                    .map((b) => b.id);

                    setSelectedIds((prevSelected) =>
                    isSelected
                        ? prevSelected.filter((id) => !relatedIds.includes(id))
                        : Array.from(new Set([...prevSelected, ...relatedIds]))
                    );
                }}
                />
                <span className="text-sm text-gray-700">
                {dt} <span className="text-green-600 font-semibold">₱{totalAmount.toFixed(2)}</span>
                </span>
            </label>
            );
        })}
        </div>
        </div>

        {/* Bets List */}
        {filteredBets.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">No saved bets found.</p>
        ) : (
          <div className="grid gap-4">
            {paginatedBets.map((bet) => (
              <div
                key={bet.id}
                className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 flex items-start gap-4"
              >
                <input
                  type="checkbox"
                  disabled
                  checked={selectedIds.includes(bet.id)}
                  onChange={() => toggleSelection(bet.id)}
                  className="mt-1"
                />
                <div className="flex-1 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block">Bet Number</span>
                    <span className="font-medium">{bet.bets}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Game</span>
                    <span className="font-medium">{bet.game_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Game Type</span>
                    <span className="font-medium">{bet.game_type_name == "" ? "N/A" : bet.game_type_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Amount</span>
                    <span className="font-medium text-blue-600">₱{bet.bet}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Win Amount</span>
                    <span className="font-medium text-green-600">₱{bet.jackpot}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Client</span>
                    <span className="font-medium text-green-600">{bet.bakas_full_name}</span>
                  </div>
                  <div className='flex-1 col-span-3 grid grid-cols-2 gap-4'>
                    <div>
                        <span className="text-gray-500 block">Draw Date & Time</span>
                        <span className="font-medium text-green-600">{bet.draw_date} {bet.draw_time}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 block">Created Date & Time</span>
                        <span className="font-medium text-green-600">{bet.created_date} {bet.created_time}</span>
                    </div>
                  </div>
                  {bet.response !== "" && (
                    <div className='col-span-3'>
                        <span className="text-gray-500 block">Response</span>
                        <span className="font-medium text-red-600">{bet.response}</span>
                    </div>
                  )}
                  <div className='col-span-3'>
                    <Button
                      className="w-full sm:w-auto bg-blue-500 border-blue-500 text-white hover:bg-blue-500/20 hover:text-blue-700"
                      onClick={() => navigate('/ticketreceipt', { state: { betID: bet.id, from: 'My Bets', isSavedBet: true } })}
                    >
                      Receipt
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
            <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            disabled={currentPage === 1}
            >
            Prev
            </button>

            {getPageNumbers().map((page, idx) =>
            page === "..." ? (
                <span key={idx} className="px-3 py-1 text-gray-400">
                ...
                </span>
            ) : (
                <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded text-sm ${
                    currentPage === page ? "bg-blue-600 text-white" : "bg-white text-gray-700"
                }`}
                >
                {page}
                </button>
            )
            )}

            <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            disabled={currentPage === totalPages}
            >
            Next
            </button>
        </div>
        )}

        {/* Actions */}
      {filteredBets.length > 0 && (
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => handleAction("confirm")}
            disabled={selectedIds.length === 0}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Confirm Selected
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-6">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">
              {actionType === "delete" ? "Delete Confirmation" : "Confirm Bets"}
            </h2>
            <p className="mb-6">
              Are you sure you want to {actionType === "delete" ? "delete" : "confirm"} the selected bets?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleModalCancel}
                className="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleModalConfirm}
                className={`px-4 py-2 rounded text-white ${
                  actionType === "delete" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {actionType === "delete" ? "Delete" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}