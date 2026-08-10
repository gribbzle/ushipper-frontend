import { DispatchFeeFilterEnum } from '@/enums/dispatch-fee-filter-enum';

export type DispatchFeeRangeValue = 'any' | { from: number; to: number };

export const dispatchFeeRanges = new Map<DispatchFeeFilterEnum, DispatchFeeRangeValue>([
    [DispatchFeeFilterEnum.Any, 'any'],
    [DispatchFeeFilterEnum.OneAndBelow, { from: 0, to: 1 }],
    [DispatchFeeFilterEnum.OneToThree, { from: 1, to: 3 }],
    [DispatchFeeFilterEnum.ThreeToFive, { from: 3, to: 5 }],
    [DispatchFeeFilterEnum.FiveToTen, { from: 5, to: 10 }],
    [DispatchFeeFilterEnum.TenAndAbove, { from: 10, to: 100 }],
]);
