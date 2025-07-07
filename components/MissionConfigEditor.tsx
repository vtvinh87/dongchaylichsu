import React, { useState } from 'react';
import { MissionData } from '../types';
import EditMissionModal from './EditMissionModal';

interface MissionConfigEditorProps {
    missions: Record<string, MissionData>;
    onSave: (missionId: string, updatedValues: Partial<MissionData>) => void;
}

const MissionConfigEditor: React.FC<MissionConfigEditorProps> = ({ missions, onSave }) => {
    const [editingMission, setEditingMission] = useState<MissionData | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredMissions = Object.values(missions).filter(mission =>
        mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mission.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = (updatedValues: Partial<MissionData>) => {
        if(editingMission) {
            onSave(editingMission.id, updatedValues);
        }
        setEditingMission(null);
    }

    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Cấu hình Nhiệm vụ</h2>
            <input
                type="text"
                placeholder="Tìm kiếm nhiệm vụ theo tên hoặc ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 mb-4 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
            />
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="th-cell">ID Nhiệm vụ</th>
                            <th className="th-cell">Tên Nhiệm vụ</th>
                            <th className="th-cell">Loại</th>
                            <th className="th-cell">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredMissions.map(mission => (
                            <tr key={mission.id}>
                                <td className="td-cell font-mono text-sm">{mission.id}</td>
                                <td className="td-cell font-semibold">{mission.title}</td>
                                <td className="td-cell">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100">
                                        {mission.type}
                                    </span>
                                </td>
                                <td className="td-cell">
                                    <button onClick={() => setEditingMission(mission)} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-200">
                                        Chỉnh sửa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editingMission && (
                <EditMissionModal
                    mission={editingMission}
                    isOpen={!!editingMission}
                    onClose={() => setEditingMission(null)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default MissionConfigEditor;
