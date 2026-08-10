import { CommunicationType } from '@/enums/communication-type';
import { TimeCondition } from '@/enums/time-condition';
import { OrderStatus } from '@/enums/order-status';
import { ColorValueHex } from '@/shared';
import { Company } from '@store/admin/companies/types';
import { OrderRequest } from '@store/api/order-requests-types';
import { Review } from '@store/client/review/types';
import { LatestLocation, TrackingDriverRatings } from '@store/client/tracking/location-types';
import { Load, OrderDeliveryInformation, OrderDetails, OrderPaymentInformation, OrderPickupInformation } from '@store/common/orders/types';
import { Avatar } from '@store/common/staff/avatar-types';

export type TrackingOrderGrouping = 'status' | 'dispatcher';

export type IsDriversListShown = boolean;

export type SelectedDriverId = string | null;

export type SelectedOrder = Load | null;

export type SelectedSuggestedOrderId = SelectedDriverId;

export type SelectedActiveRequest = OrderRequest | null;

export type SelectedShipperTrackingOrder = ShipperTrackingOrder | null;

export type TrackingSliceState = {
    isDriversListShown: IsDriversListShown;
    selectedDriverId: string | null;
    selectedDriverOrderId: string | null;
    testRoutePathLogic: boolean;
    selectedSuggestedOrderId: SelectedSuggestedOrderId;
    openShipperTrackingFilters: boolean;
    isShipperOrdersListShown: boolean;
    selectedOrder: SelectedOrder;
    isShipperOrdersTrackingLoading: boolean;
    selectedActiveRequest: SelectedActiveRequest;
    selectedShipperTrackingOrder: SelectedShipperTrackingOrder;
};

export type Driver = {
    publicId: string;
    avatar: Avatar | null;
    name: string;
    nickname?: string | null;
    email: string;
    phone: string;
    roleName: string;
    roleType: string;
    roleId: number;
    roleGroup: string;
    status: string;
    companyPublicId: string;
    companyName: string;
    lastLoginedAt: string;
    trailerCapacity: number | null;
    createdAt: string;
    updatedAt: string;
    latestLocation: LatestLocation | null;
};

type TrackingDriverOrderPickupInformation = Pick<OrderPickupInformation, 'geoLatitude' | 'geoLongitude' | 'timezone' | 'scheduledPickupAt'>;
type TrackingDriverOrderDeliveryInformation = Pick<OrderDeliveryInformation, 'geoLatitude' | 'geoLongitude' | 'timezone' | 'scheduledDeliveryAt'>;

export type TrackingDriverOrder = {
    publicId: string;
    pickupInformation: TrackingDriverOrderPickupInformation;
    deliveryInformation: TrackingDriverOrderDeliveryInformation;
    drivingDistance: number | null;
    vehiclesCount: number; // integer
    commoditiesCount: number; // integer
    status: OrderStatus;
};

export type TrackingDriver = {
    publicId: string;
    latestLocation: LatestLocation | null;
    bearing: number; // integer (0-360)
    avatar: Avatar | null;
    name: string;
    companyPublicId: string;
    companyName: string;
    rating: number | null;
    ratings: TrackingDriverRatings;
    lastLoginedAt: string | null;
    trailerCapacity: number;
    description: string | null;
    dispatchFee: number | null; // float (percentage, 0-100)
    country: string | null;
    state: string | null;
    city: string | null;
    zip: string | null;
    address: string | null;
    communicationType: CommunicationType;
    businessHours: TimeCondition;
    inBusinessSince: string | null;
    driversCount: number;
    isSupervisor: boolean;
    createdAt: string;
    accountPublicId: string | null;
    orders: TrackingDriverOrder[];
    isFlagged: boolean;
    dispatchedByCurrentUser: number; // integer
};

type ShipperOrder = {
    publicId: string;
    status: OrderStatus;
    company: Company;
    review: Review;
};

export type OrderTracking = {
    publicId: string;
    details: OrderDetails;
    pickupInformation: OrderPickupInformation;
    deliveryInformation: OrderDeliveryInformation;
    paymentInformation: OrderPaymentInformation;
    drivingDistance: number | null;
    company: Company;
    status: OrderStatus;
    shipperOrder: ShipperOrder;
    deliveredAt: string | null;
    acceptedAt: string | null;
    pickedUpAt: string | null;
    color?: string;
};

export type ShipperTrackingOrderAdditionalProperties = Pick<
    Load,
    'commodities' | 'vehicles' | 'dispatcher' | 'driver' | 'createdAt' | 'customerInformation' | 'hasInopVehicles' | 'postedAt' | 'source' | 'type'
>;

export type ShipperTrackingOrder = Omit<OrderTracking, 'company' | 'deliveryAt'> & ShipperTrackingOrderAdditionalProperties;

type OrderAddressType = 'delivery' | 'pickup';

export type OrderCoordinate = {
    estimatedDate: string;
    arrivalDate: string;
    type: OrderAddressType;
    orderId: string;
    geoLatitude: number;
    geoLongitude: number;
};

export type PathInfo = {
    distance: number;
    path: OrderCoordinate[];
};

export type UserTracking = {
    user: Driver;
    orders: OrderTracking[];
    pathInfo: PathInfo;
};

export type OrderColors = {
    orderId: string;
    orderColor: ColorValueHex;
}[];

export type DistanceMatrix = { [key: string]: { [key: string]: number } };

export type TrackingPointType = 'pickup' | 'delivery';

export type TrackingMapPoint = {
    pointId: string;
    needTobeHereAt: Date;
    orderId: string;
    lon: number;
    lat: number;
    markerType: TrackingPointType;
    orderStatus: OrderStatus;
    index?: number;
};

export type ShipperTrackingFiltersFormState = {
    status?: string;
    grouping?: TrackingOrderGrouping;
    driverFlagged: 'all' | 'only-favorite';
    dispatchers: string[];
};
