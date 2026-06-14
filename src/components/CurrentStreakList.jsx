import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Box } from '@chakra-ui/react';
import ChartBarListLoading from './ChartBarListLoading';
import { Chart, useChart } from '@chakra-ui/charts';
import { Bar, BarChart, CartesianGrid, LabelList, Rectangle, XAxis, YAxis } from 'recharts';

function getStreakColor(index) {
    const colors = [
        "purple.200",
        "blue.200",
        "cyan.200",
        "teal.200",
        "green.200",
        "lime.200",
        "yellow.200",
        "orange.200",
        "red.200",
        "pink.200",
        "gray.200",
    ];

    return colors[index % colors.length];
}

function toBarListData(payload) {
    return payload.map((item, index) => ({
        ...item,
        member_name: item.member_name.split(" ")[0],
        color: getStreakColor(index),
    }));
}

export default function CurrentStreakList({ seriesColor = 'teal.solid' }) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        api
            .getJson('/current-streak')
            .then((payload) => {
                if (cancelled || !payload || !Array.isArray(payload)) return;
                setData(toBarListData(payload));
            })
            .catch(() => {
                if (!cancelled) setData([]);
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const chart = useChart({ data });

    if (isLoading) {
        return <ChartBarListLoading seriesColor={seriesColor} />;
    }

    return (
        <Box w="full" h="320px">
            <Chart.Root chart={chart} w="full" h="full">
                <BarChart data={chart.data} responsive>
                    <CartesianGrid stroke={chart.color('border.muted')} vertical={false} />
                    <XAxis
                        dataKey="member_name"
                        axisLine={false}
                        tickLine={false}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                    />
                    <YAxis axisLine={false} tickLine={false} domain={[0, 'dataMax']} />
                    <Bar
                        dataKey="current_streak"
                        isAnimationActive={false}
                        shape={(props) => (
                            <Rectangle
                                {...props}
                                fill={chart.color(props.payload.color)}
                            />
                        )}
                    />

                </BarChart>
            </Chart.Root>
        </Box>
    );
}