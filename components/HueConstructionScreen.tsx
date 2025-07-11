// components/HueConstructionScreen.tsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { HueConstructionMissionData, Reward, HueBuilding } from '../types';
import { playSound } from '../utils/audio';
import { GoogleGenAI, Type } from "@google/genai";

// --- Types ---
const scoreEffectIcons = {
    uy_nghi: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/icon/icon-uy-nghi.png',
    phong_thuy: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/icon/icon-phong-thuy.png',
    than_dao: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/icon/icon-dung-dao.png'
};

const constructionRanks = [
  { threshold: 1500, title: 'Bậc thầy Kiến tạo' },
  { threshold: 1000, title: 'Nhà Quy hoạch Sáng giá' },
  { threshold: 700, title: 'Kiến trúc sư Tài ba' },
  { threshold: 0, title: 'Kiến trúc sư Tập sự' }
];

type ScorePopup = {
    id: number;
    iconUrl: string;
    x: number;
    y: number;
};

type HistoricalEvent = {
    id: string;
    title: string;
    description: string;
    choices: {
        text: string;
        effect: () => void;
    }[];
};

type SecretLetter = {
    id: number;
    x: number;
    y: number;
    disappearTimeout: number;
};

interface QuizData {
    question: string;
    options: string[];
    correctAnswer: string;
}

interface HueConstructionScreenProps {
    missionData: HueConstructionMissionData;
    onReturnToMuseum: () => void;
    onComplete: (reward: Reward, data?: any) => void;
    inventory: Record<string, number>;
    setInventory: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

const MISTAKE_LIMIT = 3;

const hueHistoricalFacts = [
    "Hoàng thành Huế được xây dựng theo kiến trúc Vauban, một kiểu pháo đài quân sự của Pháp, kết hợp hài hòa với kiến trúc cung đình phương Đông.",
    "Sông Hương (Hương Giang) chảy qua Kinh thành là một yếu tố phong thủy quan trọng, được xem là 'minh đường' của Kinh thành.",
    "Ngọ Môn Quan không chỉ là cổng chính mà còn là một lễ đài, nơi diễn ra các nghi lễ quan trọng của triều đình.",
    "Cửu Đỉnh được đúc bằng đồng, mỗi đỉnh tượng trưng cho một vị vua triều Nguyễn và được khắc các hình ảnh về non sông gấm vóc Việt Nam.",
    "Điện Thái Hòa là nơi diễn ra các buổi đại triều, được coi là trung tâm của đất nước dưới thời Nguyễn.",
    "Hiển Lâm Các, công trình kiến trúc cao nhất trong Hoàng thành, được xây dựng để ghi nhớ công lao của các vị vua và công thần nhà Nguyễn.",
    "Quốc Tử Giám của triều Nguyễn được đặt tại Huế, là trường đại học cao cấp nhất thời bấy giờ, đào tạo nhiều nhân tài cho đất nước.",
    "Duyệt Thị Đường là nhà hát cung đình cổ nhất còn lại ở Việt Nam, nơi vua và hoàng gia thưởng thức các buổi biểu diễn Nhã nhạc và Tuồng.",
    "Hệ thống Kinh thành Huế có chu vi gần 10km, được xây dựng trong gần 30 năm dưới hai triều vua Gia Long và Minh Mạng.",
    "Thế Tổ Miếu là nơi thờ tự các vị vua triều Nguyễn. Bố trí và quy cách thờ tự tại đây tuân theo nguyên tắc 'tả chiêu, hữu mục' rất nghiêm ngặt.",
    "Hai dãy nhà Tả Vu và Hữu Vu trước sân điện Cần Chánh là nơi các quan chuẩn bị nghi lễ hoặc phòng họp của Viện Cơ Mật.",
    "Tên gọi 'Ngọ Môn' có nghĩa là 'Cổng giữa trưa', bởi cổng quay về hướng Nam, hướng mà Dịch học quy định dành cho bậc vua chúa.",
    "Vua Gia Long sau khi thống nhất đất nước đã dành nhiều năm để khảo sát địa lý trước khi quyết định chọn Huế làm kinh đô lâu dài.",
    "Hệ thống hào và tường thành bao quanh Kinh thành Huế không chỉ có chức năng phòng thủ mà còn là một hệ thống điều hòa nước và không khí tự nhiên.",
    "Nghệ thuật pháp lam, một kỹ thuật tráng men trên đồng, được sử dụng rộng rãi để trang trí các công trình kiến trúc cung đình Huế, tạo nên vẻ đẹp độc đáo và lộng lẫy.",
    "Cửu vị thần công, chín khẩu pháo thần được đúc từ vũ khí của nhà Tây Sơn, được đặt ở hai bên Kỳ Đài như những vị thần bảo vệ Kinh thành.",
    "Thái Y Viện là cơ quan y tế chịu trách nhiệm chăm sóc sức khỏe cho vua và hoàng gia, quy tụ những danh y giỏi nhất cả nước."
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};


// --- Component ---
const HueConstructionScreen: React.FC<HueConstructionScreenProps> = ({
    missionData,
    onReturnToMuseum,
    onComplete,
    inventory,
    setInventory,
}) => {
    // Game State
    const [phase, setPhase] = useState(1);
    const [uyNghi, setUyNghi] = useState(0);
    const [vatTu, setVatTu] = useState(missionData.initialVatTu);
    const [placedBuildings, setPlacedBuildings] = useState<Record<string, { x: number; y: number }>>({});
    
    // UI State
    const [draggedBuilding, setDraggedBuilding] = useState<HueBuilding | null>(null);
    const [selectedBuilding, setSelectedBuilding] = useState<HueBuilding | null>(null); // For mobile tap-to-select
    const [dragOverZone, setDragOverZone] = useState<string | null>(null);
    const [showAdvisor, setShowAdvisor] = useState(true);
    const [isComplete, setIsComplete] = useState(false);
    const [isPhaseTransitioning, setIsPhaseTransitioning] = useState(false);
    const [activeHistoricalEvent, setActiveHistoricalEvent] = useState<HistoricalEvent | null>(null);

    // New states for enhanced gameplay
    const [timeLeft, setTimeLeft] = useState(90);
    const [mistakes, setMistakes] = useState(0);
    const [currentCosts, setCurrentCosts] = useState<Record<string, number>>({});
    const [isPaused, setIsPaused] = useState(true); // Game starts paused
    const [secretLetter, setSecretLetter] = useState<SecretLetter | null>(null);
    const [usedHistoricalFacts, setUsedHistoricalFacts] = useState<string[]>([]);
    const [infoModalContent, setInfoModalContent] = useState<{ title: string; text: string; } | null>(null);
    const [detailedInfo, setDetailedInfo] = useState<{ content: string; isLoading: boolean } | null>(null);
    const [eventCooldown, setEventCooldown] = useState(10);


    const [activeQuiz, setActiveQuiz] = useState<QuizData | null>(null);
    const [isQuizLoading, setIsQuizLoading] = useState(false);
    const [quizTimer, setQuizTimer] = useState(20);
    const [quizAnswerStatus, setQuizAnswerStatus] = useState<'unanswered' | 'correct' | 'incorrect'>('unanswered');
    const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<string | null>(null);
    const [usedHelpForQuiz, setUsedHelpForQuiz] = useState(false);
    const [disabledOptions, setDisabledOptions] = useState<string[]>([]);
    const quizTimerRef = useRef<number | null>(null);

    // Results State
    const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [scoreBreakdown, setScoreBreakdown] = useState({ base: 0, phongThuy: 0, thanDao: 0 });
    const [finalRank, setFinalRank] = useState('');
    const [finalReward, setFinalReward] = useState(0);
    const [lossReason, setLossReason] = useState('');

    const aiRef = useRef<GoogleGenAI | null>(null);
    useEffect(() => {
        if (!aiRef.current) {
            aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        }
    }, []);

    const historicalEvents: HistoricalEvent[] = useMemo(() => [
        {
            id: 'flood',
            title: 'Lụt lội ở Thuận Hóa',
            description: 'Tâu Bệ hạ, một trận lụt lớn bất ngờ ập đến, kho vật tư bị thiệt hại. Tuy nhiên, nhờ giúp dân chống lụt, uy tín của triều đình tăng cao.',
            choices: [
                { text: 'Chấp nhận thực tại.', effect: () => { setVatTu(v => Math.max(0, v - 100)); setUyNghi(u => u + 50); } },
            ]
        },
        {
            id: 'trade',
            title: 'Thương nhân ngoại quốc đến',
            description: 'Một đoàn thuyền buôn từ phương Tây cập bến, họ mong muốn trao đổi vật liệu xây dựng quý hiếm để lấy các sản vật địa phương. Đây là cơ hội tốt để có thêm Vật tư.',
            choices: [
                { text: 'Tiến hành trao đổi (+150 Vật tư)', effect: () => setVatTu(v => v + 150) },
                { text: 'Từ chối, tự lực cánh sinh', effect: () => { /* No change */ } },
            ]
        },
        {
            id: 'plague',
            title: 'Dịch bệnh hoành hành',
            description: 'Dịch bệnh đang lây lan trong dân chúng. Chúng ta cần hành động!',
            choices: [
                { text: 'Xuất ngân khố, mua thuốc men cứu chữa (-100 Vật tư, +50 Uy nghi)', effect: () => { setVatTu(v => Math.max(0, v - 100)); setUyNghi(u => u + 50); } },
                { text: 'Cầu trời khấn phật cho qua tai kiếp', effect: () => setUyNghi(u => Math.max(0, u - 20)) },
            ]
        },
        {
            id: 'corruption',
            title: 'Quan lại tham nhũng',
            description: 'Phát hiện một số quan viên trong công bộ lợi dụng chức quyền, khai khống chi phí xây dựng để tham ô. Uy tín triều đình bị ảnh hưởng.',
            choices: [
                { text: 'Trừng trị nghiêm khắc, tịch thu tài sản (-100 Vật tư, +40 Uy nghi)', effect: () => { setVatTu(v => Math.max(0, v - 100)); setUyNghi(u => u + 40); } },
                { text: 'Làm ngơ để yên chuyện (-30 Uy nghi)', effect: () => setUyNghi(u => Math.max(0, u - 30)) },
            ]
        },
        {
            id: 'fire',
            title: 'Hỏa hoạn tại công trường',
            description: 'Một vụ hỏa hoạn không may đã xảy ra tại kho chứa gỗ, gây thiệt hại nặng nề về vật tư.',
            choices: [
                { text: 'Thật không may! (-200 Vật tư)', effect: () => setVatTu(v => Math.max(0, v - 200)) },
            ]
        },
        {
            id: 'typhoon',
            title: 'Bão lớn đổ bộ',
            description: 'Một cơn bão lớn bất ngờ đổ bộ, làm hư hại các công trình đang xây dựng dở dang và cuốn trôi một số vật tư.',
            choices: [
                { text: 'Khẩn trương khắc phục! (-150 Vật tư)', effect: () => setVatTu(v => Math.max(0, v - 150)) },
            ]
        },
        {
            id: 'good_omen',
            title: 'Phát hiện điềm lành',
            description: 'Tâu Bệ hạ, các nhà chiêm tinh vừa quan sát thấy rồng vàng xuất hiện trên sông Hương. Đây là điềm đại cát, lòng dân phấn khởi, sĩ khí tăng cao!',
            choices: [
                { text: 'Thật là trời giúp ta! (+100 Uy nghi)', effect: () => setUyNghi(u => u + 100) },
            ]
        }
    ], []);


    const resetGame = useCallback(() => {
        setPhase(1);
        setUyNghi(0);
        setVatTu(missionData.initialVatTu);
        setPlacedBuildings({});
        setDraggedBuilding(null);
        setSelectedBuilding(null);
        setShowAdvisor(true);
        setIsComplete(false);
        setScorePopups([]);
        setIsPhaseTransitioning(false);
        setActiveHistoricalEvent(null);
        setShowResultsModal(false);
        setScoreBreakdown({ base: 0, phongThuy: 0, thanDao: 0 });
        setFinalRank('');
        setFinalReward(0);
        setTimeLeft(90);
        setMistakes(0);
        const initialCosts = missionData.buildings.reduce((acc, b) => ({ ...acc, [b.id]: b.cost }), {});
        setCurrentCosts(initialCosts);
        setIsPaused(true);
        setLossReason('');
        setSecretLetter(null);
        setUsedHistoricalFacts([]);
        setInfoModalContent(null);
        setDetailedInfo(null);
        setActiveQuiz(null);
        setUsedHelpForQuiz(false);
        setDisabledOptions([]);
        setEventCooldown(10);
    }, [missionData]);

    useEffect(() => {
        resetGame();
    }, [missionData, resetGame]);

    useEffect(() => {
        // Cleanup timeout on unmount
        const currentLetter = secretLetter;
        return () => {
            if (currentLetter) {
                clearTimeout(currentLetter.disappearTimeout);
            }
        };
    }, [secretLetter]);

    const handleGameOver = useCallback((reason: string) => {
        setIsComplete(true);
        setIsPaused(true);
        setLossReason(reason);
        setFinalRank("Thất bại");
        setFinalReward(0);
        setTimeout(() => setShowResultsModal(true), 1500);
    }, []);

    const spawnSecretLetter = useCallback(() => {
        const letterId = Date.now();
        const disappearTimeout = window.setTimeout(() => {
            setSecretLetter(currentLetter => {
                if (currentLetter && currentLetter.id === letterId) {
                    return null; // Disappear if not clicked
                }
                return currentLetter;
            });
        }, 3000);
        setSecretLetter({
            id: letterId,
            x: Math.random() * 80 + 10,
            y: Math.random() * 80 + 10,
            disappearTimeout
        });
    }, []);
    
    const triggerHistoricalEvent = useCallback(() => {
        const event = historicalEvents[Math.floor(Math.random() * historicalEvents.length)];
        setActiveHistoricalEvent(event);
        setIsPaused(true);
    }, [historicalEvents]);

    // Game loop timer
    useEffect(() => {
        if (isPaused || isComplete) return;

        const intervalId = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    handleGameOver("Hết giờ!");
                    return 0;
                }
                const newTime = prevTime - 1;
                
                if (newTime > 0 && newTime % 15 === 0) {
                    setCurrentCosts(prevCosts => {
                        const newCosts: Record<string, number> = {};
                        missionData.buildings.forEach(b => {
                            const fluctuation = (Math.random() - 0.5) * 0.4; // +/- 20%
                            newCosts[b.id] = Math.max(10, Math.round(b.cost * (1 + fluctuation)));
                        });
                        return newCosts;
                    });
                }
                
                return newTime;
            });

            setEventCooldown(prev => {
                if (prev <= 1) {
                    // Time to trigger an event, if nothing else is showing
                     if (!activeHistoricalEvent && !showAdvisor && !secretLetter && !infoModalContent && !activeQuiz) {
                        if (Math.random() < 0.5) {
                            triggerHistoricalEvent();
                        } else {
                            spawnSecretLetter();
                        }
                    }
                    return Math.floor(Math.random() * 6) + 5; // 5-10 seconds
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [isPaused, isComplete, missionData.buildings, handleGameOver, activeHistoricalEvent, showAdvisor, triggerHistoricalEvent, spawnSecretLetter, secretLetter, infoModalContent, activeQuiz]);

    const paletteBuildings = useMemo(() => {
        return missionData.buildings.filter(b => b.phase === phase && !placedBuildings[b.id]);
    }, [phase, placedBuildings, missionData.buildings]);

    const createScorePopup = (type: keyof typeof scoreEffectIcons, x: number, y: number) => {
        const newPopup: ScorePopup = {
            id: Date.now() + Math.random(),
            iconUrl: scoreEffectIcons[type],
            x,
            y,
        };
        setScorePopups(currentPopups => [...currentPopups, newPopup]);
        setTimeout(() => {
            setScorePopups(currentPopups => currentPopups.filter(p => p.id !== newPopup.id));
        }, 1500);
    };

    const calculateScore = useCallback((building: HueBuilding, locationId: string) => {
        const dropZone = missionData.dropZones.find(dz => dz.id === locationId);
        if (!dropZone) return;

        let basePoints = 50;
        let phongThuyPoints = 0;
        let thanDaoPoints = 0;

        if (building.id === locationId) {
            basePoints += 50;
            phongThuyPoints = dropZone.phongThuyBonus || 0;
            thanDaoPoints = dropZone.thanDaoBonus || 0;
        }

        const totalScoreForBuilding = basePoints + phongThuyPoints + thanDaoPoints;
        setUyNghi(prev => prev + totalScoreForBuilding);
        setScoreBreakdown(prev => ({
            base: prev.base + basePoints,
            phongThuy: prev.phongThuy + phongThuyPoints,
            thanDao: prev.thanDao + thanDaoPoints,
        }));
        
        createScorePopup('uy_nghi', dropZone.x, dropZone.y);
        if (phongThuyPoints > 0) createScorePopup('phong_thuy', dropZone.x + 5, dropZone.y);
        if (thanDaoPoints > 0) createScorePopup('than_dao', dropZone.x - 5, dropZone.y);
    }, [missionData.dropZones]);
    
    const fetchDetailedInfo = useCallback(async (initialFact: string) => {
        if (!initialFact || !aiRef.current) return;
        setDetailedInfo({ content: '', isLoading: true });
        setVatTu(v => v + 50);
        alert("Bạn nhận được 50 Vật tư vì tinh thần ham học hỏi!");
    
        try {
            const prompt = `Bạn là một nhà sử học chuyên nghiệp. Hãy giải thích chi tiết hơn về sự kiện hoặc khái niệm sau đây liên quan đến Kinh thành Huế hoặc triều Nguyễn: "${initialFact}". Cung cấp thêm bối cảnh lịch sử, ý nghĩa văn hóa và các chi tiết thú vị liên quan. Viết bằng tiếng Việt, văn phong học thuật nhưng dễ hiểu, súc tích trong khoảng 600 ký tự.`;
            
            const response = await aiRef.current.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });
    
            setDetailedInfo({ content: response.text.trim(), isLoading: false });
        } catch (e: any) {
            console.error("Error fetching detailed info:", e);
            setDetailedInfo({ content: 'Rất tiếc, đã có lỗi xảy ra khi tìm kiếm thông tin chi tiết. Vui lòng thử lại sau.', isLoading: false });
        }
    }, []);

    const fetchAndStartQuiz = async () => {
        setIsQuizLoading(true);
        setIsPaused(true);
        try {
            if (!aiRef.current) throw new Error("AI not initialized");

            const quizPrompt = `Generate a single multiple-choice quiz question about the Nguyễn Dynasty of Vietnam. The question should be interesting and suitable for a history game. Provide 4 unique options, one of which is the correct answer.`;
            
            const response = await aiRef.current.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: quizPrompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING, description: "The quiz question in Vietnamese." },
                            options: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING },
                                description: "An array of 4 possible answers in Vietnamese."
                            },
                            correctAnswer: { type: Type.STRING, description: "The correct answer, which must be one of the strings from the options array." }
                        },
                        required: ["question", "options", "correctAnswer"]
                    }
                },
            });

            const quizData: QuizData = JSON.parse(response.text.trim());
            quizData.options = shuffleArray(quizData.options);
            setActiveQuiz(quizData);
            setQuizTimer(20);
            setQuizAnswerStatus('unanswered');
            setSelectedQuizAnswer(null);
            setUsedHelpForQuiz(false);
            setDisabledOptions([]);
        } catch (error) {
            console.error("Quiz Generation Error:", error);
            alert("Không thể tải câu đố lúc này. Bạn nhận được 50 Vật tư an ủi.");
            setVatTu(v => v + 50);
            setIsPaused(false);
        } finally {
            setIsQuizLoading(false);
        }
    };
    
    const handleLetterClick = useCallback(() => {
        if (!secretLetter) return;
        playSound('sfx_unlock');
        clearTimeout(secretLetter.disappearTimeout);
        setSecretLetter(null);
    
        const letterChoice = Math.random();
        
        const unusedFacts = hueHistoricalFacts.filter(fact => !usedHistoricalFacts.includes(fact));
    
        // 50% chance for quiz, 50% for info. If no facts left, always quiz.
        if (letterChoice < 0.5 && unusedFacts.length > 0) {
            // Show historical fact
            const fact = unusedFacts[Math.floor(Math.random() * unusedFacts.length)];
            setInfoModalContent({ title: "Khám Phá Lịch Sử", text: fact });
            setUsedHistoricalFacts(prev => [...prev, fact]);
            setDetailedInfo(null); // Reset detailed info when showing a new fact
            setIsPaused(true);
        } else {
            // Start a quiz
            fetchAndStartQuiz();
        }
    }, [secretLetter, usedHistoricalFacts, fetchAndStartQuiz]);

    // Unified function to handle placing a building, works for both D&D and Tap
    const placeBuilding = (building: HueBuilding, zoneId: string) => {
        const zone = missionData.dropZones.find(z => z.id === zoneId);
        if (!zone || zone.phase !== phase || placedBuildings[zone.id]) {
            playSound('sfx_fail');
            return;
        }

        const currentCost = currentCosts[building.id] || building.cost;
        if (vatTu < currentCost) {
            playSound('sfx_fail');
            alert("Không đủ Vật tư!");
            return;
        }

        if (building.id !== zoneId) {
            playSound('sfx_fail');
            const newMistakeCount = mistakes + 1;
            const penalty = 20;
            setMistakes(newMistakeCount);
            setVatTu(v => Math.max(0, v - penalty));
            alert(`Đặt sai vị trí! Bị phạt ${penalty} Vật tư. (Lỗi ${newMistakeCount}/${MISTAKE_LIMIT})`);

            if (newMistakeCount >= MISTAKE_LIMIT) {
                handleGameOver("Phạm quá nhiều lỗi!");
            }
            return;
        }

        playSound('sfx_build');
        setVatTu(prev => prev - currentCost);
        setPlacedBuildings(prev => ({ ...prev, [zoneId]: { x: zone.x, y: zone.y } }));
        calculateScore(building, zoneId);
    };
    
    const handlePaletteItemClick = (building: HueBuilding) => {
        const currentCost = currentCosts[building.id] || building.cost;
        if (vatTu < currentCost || isPhaseTransitioning) return;
        playSound('sfx_click');
        setSelectedBuilding(prev => (prev?.id === building.id ? null : building));
    };
    
    const handleZoneClick = (zoneId: string) => {
        if (selectedBuilding) {
            placeBuilding(selectedBuilding, zoneId);
            setSelectedBuilding(null);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, zoneId: string) => {
        e.preventDefault();
        setDragOverZone(null);
        if (draggedBuilding) {
            placeBuilding(draggedBuilding, zoneId);
        }
        setDraggedBuilding(null);
    };

    const handleWinGame = useCallback(() => {
        setIsComplete(true);
        setIsPaused(true);
        playSound('sfx_unlock');
    
        const totalScore = scoreBreakdown.base + scoreBreakdown.phongThuy + scoreBreakdown.thanDao;
        const calculatedRank = constructionRanks.find(rank => totalScore >= rank.threshold)?.title || 'Kiến trúc sư Tập sự';
        const calculatedReward = Math.floor(totalScore / 10);
    
        setFinalRank(calculatedRank);
        setFinalReward(calculatedReward);
        
        setTimeout(() => {
            setShowResultsModal(true);
        }, 1500);
    }, [scoreBreakdown]);

    const advanceToNextPhase = useCallback(() => {
        setPhase(current => current + 1);
        setShowAdvisor(true);
        setIsPaused(true); // Pause for advisor
        playSound('sfx_unlock');
        setIsPhaseTransitioning(false);
    }, []);

    const handleEventChoice = (effect: () => void) => {
        playSound('sfx_click');
        effect();
        setActiveHistoricalEvent(null);
        setIsPaused(false);
    };

    useEffect(() => {
        if (isComplete || isPhaseTransitioning) return;
    
        const buildingsForCurrentPhase = missionData.buildings.filter(b => b.phase === phase);
        if (buildingsForCurrentPhase.length === 0 && phase < Math.max(...missionData.phaseGoals.map(g => g.phase))) {
             setIsPhaseTransitioning(true);
             setTimeout(() => advanceToNextPhase(), 1000);
             return;
        }
    
        const allPlacedForPhase = buildingsForCurrentPhase.every(b => placedBuildings[b.id]);
    
        if (allPlacedForPhase) {
            setIsPhaseTransitioning(true);
            const maxPhase = Math.max(...missionData.phaseGoals.map(g => g.phase));
            if (phase >= maxPhase) {
                handleWinGame();
            } else {
                setTimeout(() => advanceToNextPhase(), 1000);
            }
        }
    }, [placedBuildings, phase, isComplete, isPhaseTransitioning, missionData, handleWinGame, advanceToNextPhase]);

    const handleReturnToMuseumWithReward = () => {
        if (lossReason === '') {
            setInventory(prev => ({
                ...prev,
                'vat-tu': (prev['vat-tu'] || 0) + finalReward,
            }));
            onComplete(missionData.reward);
        } else {
            onReturnToMuseum(); // Return without reward on loss
        }
    };
    
    // Quiz Timer
    useEffect(() => {
        if (activeQuiz && quizTimer > 0 && quizAnswerStatus === 'unanswered') {
            quizTimerRef.current = window.setTimeout(() => {
                setQuizTimer(t => t - 1);
            }, 1000);
        } else if (quizTimer === 0 && quizAnswerStatus === 'unanswered') {
            // Time's up
            if (quizTimerRef.current) clearTimeout(quizTimerRef.current);
            setQuizAnswerStatus('incorrect');
            playSound('sfx_fail');
            setTimeout(() => {
                setActiveQuiz(null);
                setIsPaused(false);
            }, 2000);
        }
        return () => {
            if (quizTimerRef.current) clearTimeout(quizTimerRef.current);
        };
    }, [activeQuiz, quizTimer, quizAnswerStatus]);
    
    const handleQuizAnswer = (answer: string) => {
        if (quizAnswerStatus !== 'unanswered' || !activeQuiz) return;
        if (quizTimerRef.current) clearTimeout(quizTimerRef.current);
        setSelectedQuizAnswer(answer);

        if (answer === activeQuiz.correctAnswer) {
            playSound('sfx_success');
            setQuizAnswerStatus('correct');
            let reward = quizTimer > 10 ? 200 : 100;
            if(usedHelpForQuiz) {
                reward -= 50;
            }
            setVatTu(v => v + reward);
            alert(`Chính xác! Bạn nhận được ${reward} Vật tư!`);
        } else {
            playSound('sfx_fail');
            setQuizAnswerStatus('incorrect');
            alert('Sai rồi! Chúc bạn may mắn lần sau.');
        }

        setTimeout(() => {
            setActiveQuiz(null);
            setIsPaused(false);
        }, 2000);
    };

    const handleFiftyFiftyHelp = () => {
        if (!activeQuiz || usedHelpForQuiz || quizAnswerStatus !== 'unanswered') return;
        playSound('sfx_click');
        
        setUsedHelpForQuiz(true);
        const incorrectOptions = activeQuiz.options.filter(opt => opt !== activeQuiz.correctAnswer);
        const shuffledIncorrect = shuffleArray(incorrectOptions);
        setDisabledOptions(shuffledIncorrect.slice(0, 2));
    };

    const renderQuizModal = () => {
        if (isQuizLoading) {
            return (
                <div id="quiz-modal-overlay">
                    <div className="quiz-modal-content">
                        <p>Đang tải câu đố...</p>
                    </div>
                </div>
            );
        }
        if (!activeQuiz) return null;
        return (
            <div id="quiz-modal-overlay">
                <div className="quiz-modal-content">
                    <div className="quiz-timer">{quizTimer}</div>
                    <h3 className="quiz-question">{activeQuiz.question}</h3>
                    <div className="quiz-options-grid">
                        {activeQuiz.options.map((opt, i) => {
                            let buttonClass = '';
                            if (quizAnswerStatus !== 'unanswered') {
                                buttonClass = opt === activeQuiz.correctAnswer ? 'correct' : (opt === selectedQuizAnswer ? 'incorrect' : 'disabled');
                            } else if (disabledOptions.includes(opt)) {
                                buttonClass = 'fifty-fifty-disabled';
                            }
                            return (
                                <button key={i} className={`quiz-option-btn ${buttonClass}`} onClick={() => handleQuizAnswer(opt)} disabled={quizAnswerStatus !== 'unanswered' || disabledOptions.includes(opt)}>
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                    <div className="quiz-modal-footer">
                        <button
                            className="quiz-help-btn"
                            onClick={handleFiftyFiftyHelp}
                            disabled={usedHelpForQuiz || quizAnswerStatus !== 'unanswered'}
                        >
                            Trợ giúp 50/50 (-50 Vật tư thưởng)
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderResultsModal = () => {
        if (!showResultsModal) return null;
        const isWin = lossReason === '';
        const totalScore = scoreBreakdown.base + scoreBreakdown.phongThuy + scoreBreakdown.thanDao;
        return (
            <div id="results-screen-modal">
                <div className="results-content">
                    <div className="results-box">
                        <h2 className={isWin ? 'text-green-700' : 'text-red-700'}>
                            {isWin ? 'Hoàn Thành Nhiệm Vụ' : 'Nhiệm Vụ Thất Bại'}
                        </h2>
                        <h3 className="text-stone-700">{isWin ? `Danh hiệu: ` : `Lý do: `}<span id="player-rank" className={isWin ? 'text-amber-700' : 'text-red-600'}>{isWin ? finalRank : lossReason}</span></h3>
                        {isWin && (
                            <>
                                <ul id="score-breakdown-list">
                                    <li><span>Điểm Xây dựng cơ bản:</span> <span>{scoreBreakdown.base}</span></li>
                                    <li><span>Điểm thưởng Phong Thủy:</span> <span>{scoreBreakdown.phongThuy}</span></li>
                                    <li><span>Điểm thưởng Thần Đạo:</span> <span>{scoreBreakdown.thanDao}</span></li>
                                    <li><span>Tổng Uy Nghi:</span> <span>{totalScore}</span></li>
                                </ul>
                                <p id="final-reward-text">Phần thưởng tổng kết: <span id="final-reward">{finalReward}</span> Vật tư</p>
                            </>
                        )}
                    </div>
                    <div className="results-buttons">
                        <button className="play-again-btn" onClick={resetGame}>Chơi lại</button>
                        <button className="return-museum-btn" onClick={handleReturnToMuseumWithReward}>{isWin ? 'Về Bảo tàng & Nhận thưởng' : 'Về Bảo tàng'}</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div id="hue-construction-screen">
            {renderResultsModal()}
            {renderQuizModal()}

            {showAdvisor && missionData.advisorTips[phase] && !activeHistoricalEvent && (
                <div id="advisor-modal" onClick={() => { setShowAdvisor(false); setIsPaused(false); }}>
                    <div className="advisor-content" onClick={e => e.stopPropagation()}>
                        <h3>{missionData.advisorTips[phase].title}</h3>
                        <div className="advisor-scroll-content">
                            <p>{missionData.advisorTips[phase].text}</p>
                        </div>
                        <button onClick={() => { setShowAdvisor(false); setIsPaused(false); }}>Thần đã rõ!</button>
                    </div>
                </div>
            )}

            {activeHistoricalEvent && (
                <div id="historical-event-modal" className="advisor-modal">
                    <div className="advisor-content" onClick={e => e.stopPropagation()}>
                        <h3>Sự Kiện Bất Ngờ: {activeHistoricalEvent.title}</h3>
                        <p>{activeHistoricalEvent.description}</p>
                        <div className="event-choices">
                            {activeHistoricalEvent.choices.map((choice, index) => (
                                <button key={index} onClick={() => handleEventChoice(choice.effect)}>
                                    {choice.text}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
             {infoModalContent && (
                <div id="historical-event-modal" className="advisor-modal">
                    <div className="advisor-content" onClick={e => e.stopPropagation()}>
                        <h3>{infoModalContent.title}</h3>
                        <div className="advisor-scroll-content">
                            <p className="whitespace-pre-wrap">{infoModalContent.text}</p>
                            {detailedInfo && (
                                <div className="mt-4 pt-4 border-t border-dashed border-stone-400">
                                    {detailedInfo.isLoading ? (
                                        <p>Đang tải thông tin chi tiết...</p>
                                    ) : (
                                        <p className="whitespace-pre-wrap">{detailedInfo.content}</p>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between items-center mt-6">
                             <button
                                onClick={() => { setInfoModalContent(null); setIsPaused(false); }}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
                            >
                                Đóng
                            </button>
                            {!detailedInfo && (
                                 <button
                                    onClick={() => fetchDetailedInfo(infoModalContent.text)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
                                >
                                    Xem thêm (+50 Vật tư)
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            <div id="construction-hud">
                <div className="hud-stat">Lỗi: <span className={mistakes > 0 ? 'text-red-400' : 'text-white'}>{mistakes}/{MISTAKE_LIMIT}</span></div>
                <div className="hud-stat">Thời gian: <span className={timeLeft <= 15 ? 'text-red-400' : 'text-white'}>{timeLeft}s</span></div>
                <div className="hud-stat">Uy Nghi: <span>{uyNghi}</span></div>
                <h2 className="text-2xl font-bold text-center flex-grow text-white text-shadow-glow">Thuận Thiên Ý - Kiến Tạo Kinh Thành</h2>
                <div className="hud-stat">Vật Tư: <span>{vatTu}</span></div>
            </div>

            <div id="game-body">
                <div id="building-palette">
                    <h3 id="palette-title">Công Trình Giai Đoạn {phase}</h3>
                    <div id="palette-items">
                        {paletteBuildings.map(building => {
                            const currentCost = currentCosts[building.id] || building.cost;
                            return (
                                <div 
                                    key={building.id}
                                    draggable={vatTu >= currentCost && !isPhaseTransitioning}
                                    onDragStart={() => setDraggedBuilding(building)}
                                    onClick={() => handlePaletteItemClick(building)}
                                    className={`palette-item ${vatTu < currentCost || isPhaseTransitioning ? 'disabled' : ''} ${selectedBuilding?.id === building.id ? 'selected-for-placement' : ''}`}
                                    title={`${building.name} (Chi phí: ${currentCost})`}
                                >
                                    <img src={building.iconUrl} alt={building.name} />
                                    <div className="item-info">
                                        <p className="font-bold">{building.name}</p>
                                        <p className="text-sm">Chi phí: {currentCost} Vật tư</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div id="hue-planning-grid" onClick={() => setSelectedBuilding(null)}>
                    <div id="phase-indicator">Giai Đoạn: {phase}</div>

                    {secretLetter && (
                        <div
                            className="secret-letter"
                            style={{ left: `${secretLetter.x}%`, top: `${secretLetter.y}%` }}
                            onClick={handleLetterClick}
                            title="Một bức thư bí mật!"
                        />
                    )}
                    
                    {missionData.dropZones.filter(z => z.phase === phase).map(zone => (
                        <div
                            key={zone.id}
                            className={`drop-zone ${dragOverZone === zone.id ? 'drag-over' : ''}`}
                            style={{ left: `${zone.x}%`, top: `${zone.y}%`, width: `${zone.width}%`, height: `${zone.height}%` }}
                            onDragOver={e => { e.preventDefault(); setDragOverZone(zone.id); }}
                            onDragLeave={() => setDragOverZone(null)}
                            onDrop={(e) => { e.stopPropagation(); handleDrop(e, zone.id); }}
                            onClick={(e) => { e.stopPropagation(); handleZoneClick(zone.id); }}
                        />
                    ))}

                    {Object.entries(placedBuildings).map(([id, pos]) => {
                         const building = missionData.buildings.find(b => b.id === id);
                         if (!building) return null;
                         const zone = missionData.dropZones.find(z => z.id === id);
                         if (!zone) return null;

                        return <img key={id} src={building.iconUrl} alt={building.name} className="placed-building" style={{ left: `${pos.x}%`, top: `${pos.y}%`, width: `${zone.width}%`, height: `${zone.height}%` }} />;
                    })}

                    {scorePopups.map(p => (
                        <div key={p.id} className="score-popup" style={{ left: `${p.x}%`, top: `${p.y}%`, backgroundImage: `url(${p.iconUrl})` }} />
                    ))}
                    
                    {isComplete && !showResultsModal && (
                        <div id="completion-overlay">
                            <h2>Kinh Thành Hoàn Tất!</h2>
                            <p className="text-xl text-amber-800">Ngài đã xây dựng nên một công trình để đời, xứng danh Thiên tử!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HueConstructionScreen;