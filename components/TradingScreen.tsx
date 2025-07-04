import React, { useState, useEffect, useCallback } from 'react';
import { TradingMissionData, Reward } from '../types';
import { ALL_ARTIFACTS_MAP } from '../constants';
import { playSound } from '../utils/audio';

interface TradingScreenProps {
  missionData: TradingMissionData;
  onReturnToMuseum: () => void;
  onComplete: (reward: Reward) => void;
}

const TradingScreen: React.FC<TradingScreenProps> = ({ missionData, onReturnToMuseum, onComplete }) => {
  const [capital, setCapital] = useState(missionData.initialCapital);
  const [currentDay, setCurrentDay] = useState(1);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [marketPrices, setMarketPrices] = useState<Record<string, number>>({});
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [isMissionOver, setIsMissionOver] = useState(false);
  const [gameOutcome, setGameOutcome] = useState<'win' | 'loss' | null>(null);

  const [rewardImageUrl, setRewardImageUrl] = useState('');

  const updateMarketPrices = useCallback((eventModifier?: { goodId: string; multiplier: number }) => {
    const newPrices: Record<string, number> = {};
    missionData.goods.forEach(good => {
      let basePrice = good.basePrice;
      if (eventModifier && eventModifier.goodId === good.id) {
        basePrice *= eventModifier.multiplier;
      }
      const fluctuation = (Math.random() - 0.5) * 0.4; // +/- 20%
      newPrices[good.id] = Math.max(1, Math.round(basePrice * (1 + fluctuation)));
    });
    setMarketPrices(newPrices);
  }, [missionData.goods]);

  useEffect(() => {
    // Initial setup
    setCapital(missionData.initialCapital);
    setCurrentDay(1);
    setInventory({});
    setIsMissionOver(false);
    setGameOutcome(null);

    const initialPrices: Record<string, number> = {};
    missionData.goods.forEach(good => {
      initialPrices[good.id] = good.basePrice;
    });
    setMarketPrices(initialPrices);
    setEventLog(['Chào mừng đến thương cảng Hội An! Hãy bắt đầu kinh doanh.']);

    if (missionData.reward.type === 'artifact') {
      const artifact = ALL_ARTIFACTS_MAP[missionData.reward.id];
      if (artifact) setRewardImageUrl(artifact.imageUrl);
    }
  }, [missionData]);

  const handleBuy = (goodId: string, amount: number) => {
    if (isMissionOver) return;
    const price = marketPrices[goodId] * amount;
    if (capital >= price) {
      playSound('sfx_click');
      setCapital(prev => prev - price);
      setInventory(prev => ({ ...prev, [goodId]: (prev[goodId] || 0) + amount }));
    } else {
      playSound('sfx_fail');
      alert('Không đủ vốn!');
    }
  };

  const handleSell = (goodId: string, amount: number) => {
    if (isMissionOver) return;
    if ((inventory[goodId] || 0) >= amount) {
      playSound('sfx_click');
      const price = marketPrices[goodId] * amount;
      setCapital(prev => prev + price);
      setInventory(prev => ({ ...prev, [goodId]: prev[goodId] - amount }));
    } else {
      playSound('sfx_fail');
      alert('Không đủ hàng trong kho!');
    }
  };

  const handleNextDay = () => {
    if (isMissionOver) return;

    playSound('sfx_click');

    if (capital >= missionData.targetCapital) {
      setGameOutcome('win');
      setIsMissionOver(true);
      playSound('sfx_unlock');
      setTimeout(() => onComplete(missionData.reward), 2000);
      return;
    }

    const newDay = currentDay + 1;
    if (newDay > missionData.daysLimit) {
      setGameOutcome('loss');
      setIsMissionOver(true);
      return;
    }

    setCurrentDay(newDay);

    // Random event
    let eventModifier;
    if (Math.random() < 0.25) { // 25% chance of an event
      const event = missionData.events[Math.floor(Math.random() * missionData.events.length)];
      setEventLog(prev => [event.description, ...prev].slice(0, 5));
      eventModifier = event.priceModifier;
    } else {
      setEventLog(prev => ['Một ngày giao thương bình thường.', ...prev].slice(0, 5));
    }
    
    updateMarketPrices(eventModifier);
  };

  const renderOutcome = () => {
    if (!isMissionOver) return null;
    let title, message;
    if (gameOutcome === 'win') {
      title = "Thành công rực rỡ!";
      message = `Bạn đã đạt được mục tiêu vốn ${missionData.targetCapital.toLocaleString()} vàng! Bạn đã trở thành một thương nhân đại tài.`;
    } else {
      title = "Thời gian đã hết!";
      message = "Rất tiếc, bạn đã không thể đạt được mục tiêu. Con đường tơ lụa vẫn còn nhiều thử thách.";
    }
    return (
      <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-white z-20 animate-fadeInScaleUp p-4 text-center">
        <h3 className="text-4xl font-bold text-amber-300 mb-4">{title}</h3>
        <p className="text-xl mb-4">{message}</p>
        {gameOutcome === 'win' && rewardImageUrl && <img src={rewardImageUrl} alt="Phần thưởng" className="w-32 h-32 object-contain my-4 rounded-lg" />}
        {gameOutcome === 'loss' && (
          <button onClick={onReturnToMuseum} className="mt-6 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg">
            Quay về
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="screen-container w-full max-w-6xl p-4 bg-amber-100 dark:bg-stone-800 rounded-lg shadow-xl relative overflow-hidden">
      {renderOutcome()}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-amber-700 dark:text-amber-400 font-serif">{missionData.title}</h2>
        <button onClick={onReturnToMuseum} className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-900 font-semibold py-2 px-4 rounded-lg shadow-md">
          Quay về Bảo tàng
        </button>
      </div>

      <div id="player-stats" className="flex flex-wrap gap-4 justify-center mb-4 p-3 bg-white/50 dark:bg-stone-700/50 rounded-lg">
        <div className="stat-item">💰 Vốn: <span className="font-bold text-green-600 dark:text-green-400">{capital.toLocaleString()}</span></div>
        <div className="stat-item">🎯 Mục tiêu: <span className="font-bold text-yellow-600 dark:text-yellow-400">{missionData.targetCapital.toLocaleString()}</span></div>
        <div className="stat-item">☀️ Ngày: <span className="font-bold text-blue-600 dark:text-blue-400">{currentDay} / {missionData.daysLimit}</span></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Market Area */}
        <div id="market-area" className="lg:col-span-2 p-4 bg-white/70 dark:bg-stone-900/40 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold text-center mb-3">Chợ Hội An</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {missionData.goods.map(good => (
              <div key={good.id} className="trading-card">
                <img src={good.iconUrl} alt={good.name} className="w-12 h-12 object-contain mx-auto mb-2" />
                <h4 className="font-bold">{good.name}</h4>
                <p>Giá: <span className="text-yellow-700 dark:text-yellow-500 font-semibold">{marketPrices[good.id]?.toLocaleString()}</span></p>
                <button onClick={() => handleBuy(good.id, 1)} className="trade-button buy-button" disabled={isMissionOver}>Mua</button>
              </div>
            ))}
          </div>
        </div>

        {/* Warehouse and Log */}
        <div className="flex flex-col gap-4">
          <div id="warehouse-area" className="p-4 bg-white/70 dark:bg-stone-900/40 rounded-lg shadow-inner flex-grow">
            <h3 className="text-xl font-semibold text-center mb-3">Kho hàng</h3>
             <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {Object.values(inventory).some(qty => qty > 0) ? missionData.goods.filter(g => (inventory[g.id] || 0) > 0).map(good => (
                  <div key={good.id} className="trading-card small">
                    <img src={good.iconUrl} alt={good.name} className="w-8 h-8 object-contain" />
                    <div className="flex-grow">
                        <h4 className="font-bold text-sm">{good.name}</h4>
                        <p className="text-xs">Số lượng: {inventory[good.id]}</p>
                    </div>
                    <button onClick={() => handleSell(good.id, 1)} className="trade-button sell-button" disabled={isMissionOver}>Bán</button>
                  </div>
              )) : <p className="text-sm text-center italic text-stone-500 dark:text-stone-400 p-4">Kho hàng trống.</p>}
            </div>
          </div>
          <div id="event-log" className="p-3 bg-amber-50 dark:bg-stone-700 rounded-lg shadow-inner h-32 overflow-y-auto">
             <h4 className="text-md font-semibold text-center mb-2">Nhật ký sự kiện</h4>
             <ul className="text-xs space-y-1">
                {eventLog.map((log, i) => <li key={i} className="border-b border-dashed border-stone-300 dark:border-stone-600 pb-1">{log}</li>)}
             </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <button onClick={handleNextDay} disabled={isMissionOver} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          Qua ngày mới
        </button>
      </div>
    </div>
  );
};

export default TradingScreen;