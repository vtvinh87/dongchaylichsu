
import React, { useState, useMemo, useEffect } from 'react';
import { PlayEvent, MissionData, ConfigOverrides } from '../types';
import AnalyticsChart from './AnalyticsChart';
import MissionConfigEditor from './MissionConfigEditor';

const ANALYTICS_STORAGE_KEY = 'dongChayLichSu_analytics_v1';
const CONFIG_OVERRIDE_STORAGE_KEY = 'dongChayLichSu_config_overrides_v1';

interface AdminDashboardProps {
    onReturnToMuseum: () => void;
    missions: Record<string, MissionData>;
    onConfigChange: () => void;
}

type Tab = 'analytics' | 'config';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onReturnToMuseum, missions, onConfigChange }) => {
    const [activeTab, setActiveTab] = useState<Tab>('analytics');
    const [analyticsData, setAnalyticsData] = useState<PlayEvent[]>([]);

    useEffect(() => {
        try {
            const data = localStorage.getItem(ANALYTICS_STORAGE_KEY);
            setAnalyticsData(data ? JSON.parse(data) : []);
        } catch (error) {
            console.error("Failed to load analytics data:", error);
            setAnalyticsData([]);
        }
    }, []);

    const analyticsSummary = useMemo(() => {
        const totalPlays = analyticsData.length;
        const uniquePlayers = new Set(analyticsData.map(d => d.userName)).size;
        const missionsCompleted = analyticsData.filter(d => d.outcome === 'win').length;
        
        const playsByGame = analyticsData.reduce((acc, curr) => {
            acc[curr.missionTitle] = (acc[curr.missionTitle] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const mostPlayedGame = Object.entries(playsByGame).sort((a, b) => b[1] - a[1])[0];

        return {
            totalPlays,
            uniquePlayers,
            missionsCompleted,
            mostPlayedGame: mostPlayedGame ? `${mostPlayedGame[0]} (${mostPlayedGame[1]} lượt)` : 'Chưa có'
        };
    }, [analyticsData]);
    
    const playsByGameChartData = useMemo(() => {
        const playsByGame = analyticsData.reduce((acc, curr) => {
            acc[curr.missionTitle] = (acc[curr.missionTitle] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const sortedGames = Object.entries(playsByGame).sort((a,b) => b[1] - a[1]).slice(0, 10); // Top 10

        return {
            labels: sortedGames.map(item => item[0]),
            datasets: [{
                label: 'Lượt chơi',
                data: sortedGames.map(item => item[1]),
                backgroundColor: 'rgba(217, 119, 6, 0.6)',
                borderColor: 'rgba(146, 64, 14, 1)',
                borderWidth: 1,
            }]
        };
    }, [analyticsData]);
    
    const playsOverTimeChartData = useMemo(() => {
        const playsByDay = analyticsData.reduce((acc, curr) => {
            const day = new Date(curr.timestamp).toLocaleDateString('vi-VN');
            acc[day] = (acc[day] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const sortedDays = Object.entries(playsByDay).sort((a,b) => new Date(a[0].split('/').reverse().join('-')).getTime() - new Date(b[0].split('/').reverse().join('-')).getTime());

        return {
            labels: sortedDays.map(item => item[0]),
            datasets: [{
                label: 'Lượt chơi mỗi ngày',
                data: sortedDays.map(item => item[1]),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        };
    }, [analyticsData]);

    const handleSaveOverride = (missionId: string, updatedValues: Partial<MissionData>) => {
        try {
            const overridesJSON = localStorage.getItem(CONFIG_OVERRIDE_STORAGE_KEY);
            const overrides: ConfigOverrides = overridesJSON ? JSON.parse(overridesJSON) : {};

            overrides[missionId] = {
                ...(overrides[missionId] || {}),
                ...updatedValues
            } as Partial<MissionData>;
            
            localStorage.setItem(CONFIG_OVERRIDE_STORAGE_KEY, JSON.stringify(overrides));
            onConfigChange(); // Notify App.tsx to reload configs
            alert('Lưu cấu hình thành công!');
        } catch (error) {
            console.error("Failed to save config override:", error);
            alert('Lưu cấu hình thất bại!');
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-6 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-xl min-h-[80vh] flex flex-col">
            <header className="flex justify-between items-center pb-4 border-b-2 border-gray-300 dark:border-gray-700">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Bảng điều khiển Quản trị</h1>
                <button onClick={onReturnToMuseum} className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg shadow-md">
                    Về Bảo tàng
                </button>
            </header>

            <div className="flex border-b border-gray-300 dark:border-gray-700 my-4">
                <button onClick={() => setActiveTab('analytics')} className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}>Thống kê</button>
                <button onClick={() => setActiveTab('config')} className={`tab-button ${activeTab === 'config' ? 'active' : ''}`}>Cấu hình Game</button>
            </div>

            <main className="flex-grow">
                {activeTab === 'analytics' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <div className="summary-card"><h4>Tổng lượt chơi</h4><p>{analyticsSummary.totalPlays}</p></div>
                        <div className="summary-card"><h4>Người chơi</h4><p>{analyticsSummary.uniquePlayers}</p></div>
                        <div className="summary-card"><h4>Nhiệm vụ hoàn thành</h4><p>{analyticsSummary.missionsCompleted}</p></div>
                        <div className="summary-card"><h4>Game phổ biến nhất</h4><p>{analyticsSummary.mostPlayedGame}</p></div>
                    </div>
                )}
                
                {activeTab === 'analytics' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="chart-container"><AnalyticsChart type="bar" data={playsByGameChartData} title="Lượt chơi nhiều nhất"/></div>
                        <div className="chart-container"><AnalyticsChart type="line" data={playsOverTimeChartData} title="Lượt chơi theo thời gian"/></div>
                    </div>
                )}

                {activeTab === 'config' && (
                    <MissionConfigEditor missions={missions} onSave={handleSaveOverride} />
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
