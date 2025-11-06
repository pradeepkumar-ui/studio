'use client';

import { Card, Flex, Metric, Text, BadgeDelta, DeltaType } from '@tremor/react';

type Kpi = {
    title: string;
    metric: string;
    progress: number;
    target: string;
    deltaType: DeltaType;
}

export function KpiCard({ item }: { item: Kpi }) {
  return (
    <Card>
        <Flex alignItems="start">
            <Text>{item.title}</Text>
            <BadgeDelta deltaType={item.deltaType}>
                {item.progress}%
            </BadgeDelta>
        </Flex>
        <Flex
            className="space-x-3 truncate"
            justifyContent="start"
            alignItems="baseline"
        >
            <Metric>{item.metric}</Metric>
            <Text>from {item.target}</Text>
        </Flex>
    </Card>
  );
}
