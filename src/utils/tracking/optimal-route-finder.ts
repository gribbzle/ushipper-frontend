import { OrderStatus } from '@/enums/order-status';
import { DistanceMatrix, TrackingMapPoint } from '@store/client';

export const isPickupPoint = (point: TrackingMapPoint) => point.markerType === 'pickup';
export const isDeliveryPoint = (point: TrackingMapPoint) => point.markerType === 'delivery';

const findNextPoint = (
    allPoints: TrackingMapPoint[],
    currentPoint: TrackingMapPoint,
    visited: TrackingMapPoint[],
    needToDeliver: TrackingMapPoint[],
    distanceMatrix: DistanceMatrix,
) => {
    // Фильтруем точки, чтобы исключить уже посещенные
    const unvisitedPoints = allPoints.filter(p => !visited.find(el => el.pointId === p.pointId));

    // Фильтрация точек доставки, чтобы гарантировать, что пикап для них уже был посещен
    const validPoints = unvisitedPoints.filter(p => {
        if (isDeliveryPoint(p)) {
            // Можно перемещаться к точке доставки только если соответствующий пикап уже был посещен
            return needToDeliver.some(nd => nd.orderId === p.orderId);
        }

        // Точки пикапа доступны для посещения без дополнительных условий
        return true;
    });

    // Сортируем допустимые точки по расстоянию от текущей точки
    const sortedPoints = validPoints.sort((a, b) => {
        // Минимизация расстояния - основной критерий
        return distanceMatrix[currentPoint.pointId][a.pointId] - distanceMatrix[currentPoint.pointId][b.pointId];
    });

    // Возвращаем ближайшую допустимую точку или null, если таких точек нет
    return sortedPoints[0] || null;
};

const findClosestPickupPoint = (
    points: TrackingMapPoint[],
    lastPoint: TrackingMapPoint,
    visited: TrackingMapPoint[],
    distanceMatrix: DistanceMatrix,
): TrackingMapPoint | undefined => {
    return (
        points
            .filter(p => isPickupPoint(p) && !visited.some(el => el.pointId === p.pointId))
            .sort((a, b) => distanceMatrix[lastPoint.pointId][a.pointId] - distanceMatrix[lastPoint.pointId][b.pointId])[0] || undefined
    );
};

export const findOptimalPath = (points: TrackingMapPoint[], distanceMatrix: DistanceMatrix) => {
    if (!points.length) {
        return [];
    }

    const visited: TrackingMapPoint[] = [];
    let needToDeliver: TrackingMapPoint[] = [];

    const sortedPointsByTime = points.sort((a, b) => a.needTobeHereAt.getTime() - b.needTobeHereAt.getTime());
    // Начинаем маршрут с первой точки пикапа с статусом 'PickedUp'
    let currentPoint = sortedPointsByTime.find(p => isPickupPoint(p) && p.orderStatus === OrderStatus.PICKED_UP);

    //если не найдено первой, уже посещенной, точки пикапа берем первую точку, которую нужно посетить по дате
    if (!currentPoint) {
        currentPoint = sortedPointsByTime.find(p => isPickupPoint(p));

        //если и после этого не нашли точку пикапа выходим с пустым маршрутом
        if (!currentPoint) {
            return [];
        }
    }

    visited.push(currentPoint);
    needToDeliver.push(currentPoint);

    while (visited.length < points.length) {
        const lastPoint = visited[visited.length - 1];
        let nextPoint: TrackingMapPoint | undefined = findNextPoint(points, lastPoint, visited, needToDeliver, distanceMatrix);

        if (nextPoint) {
            visited.push(nextPoint);
            if (isPickupPoint(nextPoint)) {
                needToDeliver.push(nextPoint);
            } else {
                needToDeliver = needToDeliver.filter(p => p.orderId !== nextPoint?.orderId);
            }
        } else {
            // Если не нашли подходящую следующую точку, но остались непосещенные пикапы

            if (needToDeliver.length === 0) {
                nextPoint = findClosestPickupPoint(points, lastPoint, visited, distanceMatrix);
                if (nextPoint) {
                    visited.push(nextPoint);
                    needToDeliver.push(nextPoint);
                    continue;
                }
            }
            break;
        }
    }

    return visited;
};

export const getPointsDistanceMatrix = (points: TrackingMapPoint[], responseMatrix: number[][]) => {
    const pointsDistanceMatrix: DistanceMatrix = {};

    for (let i = 0; i < points.length; i++) {
        let currentRow = {};

        for (let j = 0; j < points.length; j++) {
            const responseMatrixItem = responseMatrix[i][j];

            if (responseMatrixItem === 0) {
                continue;
            }

            currentRow = {
                ...currentRow,
                [points[j].pointId]: responseMatrixItem,
            };
        }

        pointsDistanceMatrix[points[i].pointId] = currentRow;
    }

    return pointsDistanceMatrix;
};
