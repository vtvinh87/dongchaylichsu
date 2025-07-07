
import React, { useState, useEffect } from 'react';
import { MissionData } from '../types';

interface EditMissionModalProps {
    isOpen: boolean;
    mission: MissionData;
    onClose: () => void;
    onSave: (updatedValues: Partial<MissionData>) => void;
}

const EditMissionModal: React.FC<EditMissionModalProps> = ({ isOpen, mission, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<MissionData>>({});

    useEffect(() => {
        if (mission) {
            setFormData({
                title: mission.title,
                timeLimit: 'timeLimit' in mission ? mission.timeLimit : undefined,
            });
        }
    }, [mission]);

    if (!isOpen) {
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value,
        }));
    };

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Chỉnh sửa: {mission.title}</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tên nhiệm vụ</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                        />
                    </div>
                    {'timeLimit' in mission && (
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Thời gian giới hạn (giây)</label>
                            <input
                                type="number"
                                name="timeLimit"
                                value={(formData as { timeLimit?: number }).timeLimit || 0}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                            />
                        </div>
                    )}
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">Hủy</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md">Lưu thay đổi</button>
                </div>
            </div>
        </div>
    );
};

export default EditMissionModal;
