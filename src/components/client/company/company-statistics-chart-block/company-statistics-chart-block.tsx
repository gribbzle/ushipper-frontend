import React, { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/common/button/button';
import { ChartData } from '@/components/common/stacked-area-chart/stacked-area-chart';
import { StackedAreaChart } from '@/components/common/stacked-area-chart/stacked-area-chart';
import { Paper } from '@/components/ui/surfaces/paper/paper';
import { useAppSelector } from '@store';
import { fetchedCompanySelector } from '@store/admin';
import { GetStatisticParams, StatisticInformation, useLazyGetStatisticsQuery } from '@store/api/users-api';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { DashboardEmptyBlock } from '../../dashboard/empty-block';

import './company-statistics-chart-block.scss';

const cn = classname('company-statistics-chart-block');
const t = translateByNamespace('client:company-page:statictics-block');

const PERIODS = ['last-month', 'six-months', 'one-year'];

type Props = {
    type: GetStatisticParams['type'];
};

export const CompanyStaticticsChartBlock = (props: Props) => {
    const { type } = props;
    const company = useAppSelector(fetchedCompanySelector);
    const companyName = company?.name;

    const [selectedPeriod, setSelectedPeriod] = useState(PERIODS[0]);

    const [getStatistics] = useLazyGetStatisticsQuery();
    const [companyStatistics, setCompanyStatistics] = useState<StatisticInformation>();

    useEffect(() => {
        if (!company) return;

        (async () => {
            const {
                owner: { publicId },
            } = company;
            const res = await getStatistics({ publicIds: [publicId], statistics_period: selectedPeriod, type }).unwrap();

            setCompanyStatistics(res?.[0]);
        })();
    }, [company, getStatistics, selectedPeriod, type]);

    const chartData = useMemo(() => {
        const result: { [key: string]: ChartData } = {};

        if (companyName) {
            companyStatistics?.forEach(({ date, value }) => {
                let point = result[date];

                if (!point) {
                    result[date] = { name: date };
                    point = result[date];
                }
                point[companyName] = value ? parseFloat(value) : 0;
            });
        }

        return Object.values(result).sort((a, b) => {
            return new Date(a.name) > new Date(b.name) ? 1 : -1;
        });
    }, [companyName, companyStatistics]);

    const chartAreas = useMemo(() => {
        if (!companyName) {
            return [];
        }

        return [
            {
                dataKey: companyName,
                color: '#409EFF',
            },
        ];
    }, [companyName]);

    const body = useMemo(() => {
        if (chartData?.length) {
            return (
                <StackedAreaChart
                    labelXAxis={t('axis-labels:x')}
                    labelYAxis={t('axis-labels:y')}
                    height={344}
                    margins={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                    areas={chartAreas}
                    data={chartData}
                    isLegendVisible={false}
                />
            );
        }

        return <DashboardEmptyBlock isCompanyPage={true} />;
    }, [chartAreas, chartData]);

    const actions = useMemo(() => {
        return (
            <div className={cn('period-filter')}>
                {PERIODS.map(period => (
                    <Button key={period} view={period === selectedPeriod ? 'primary' : 'default'} size='small' onClick={() => setSelectedPeriod(period)}>
                        {t(`period-filter-options:${period}`)}
                    </Button>
                ))}
            </div>
        );
    }, [selectedPeriod]);

    return <Paper title={t(`titles:${type}`)} actions={actions} body={body} className={cn()} />;
};
