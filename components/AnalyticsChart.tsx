import React, { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration, ChartTypeRegistry } from 'chart.js/auto';

interface AnalyticsChartProps {
    type: keyof ChartTypeRegistry;
    data: ChartConfiguration['data'];
    title: string;
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ type, data, title }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            // Destroy the previous chart instance if it exists
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                chartInstanceRef.current = new Chart(ctx, {
                    type: type,
                    data: data,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'top',
                                labels: {
                                    color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#374151',
                                }
                            },
                            title: {
                                display: true,
                                text: title,
                                color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#374151',
                                font: {
                                    size: 16
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#4b5563',
                                },
                                grid: {
                                    color: document.documentElement.classList.contains('dark') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                }
                            },
                            x: {
                                ticks: {
                                    color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#4b5563',
                                },
                                 grid: {
                                    display: false
                                }
                            }
                        }
                    }
                });
            }
        }

        // Cleanup function to destroy the chart instance on component unmount
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [type, data, title]); // Re-create chart if these props change

    return (
        <canvas ref={chartRef}></canvas>
    );
};

export default AnalyticsChart;
