import {
    CommodityDimensionUnitEnum,
    CommodityHazmatClassEnum,
    CommodityPackingGroupEnum,
    CommodityTemperatureUnitEnum,
    CommodityTypesEnum,
    CommodityVolumeUnitEnum,
    CommodityWeightUnitEnum,
    FreightClassesEnum,
} from '@/enums';

export type OrderCommodity = {
    publicId: string;
    freightClass: FreightClassesEnum;
    type: CommodityTypesEnum | null;
    weight: number | null;
    weightUnit: CommodityWeightUnitEnum | null;
    volume: string | null;
    volumeUnit: CommodityVolumeUnitEnum | null;
    linearFeet: number | null;
    length: number | null;
    width: number | null;
    height: number | null;
    dimensionUnit: CommodityDimensionUnitEnum | null;
    minTemperature: number | null;
    maxTemperature: number | null;
    temperatureUnit: CommodityTemperatureUnitEnum | null;
    packingGroup: CommodityPackingGroupEnum | null;
    hazmatClass: CommodityHazmatClassEnum | null;
    name: string | null;
    description: string | null;
    nmfcCode: string | null;
    stackable: boolean;
    hazardous: boolean;
    quantity: number | null;
    pieces: number | null;
    skuNumber: string | null;
    properShippingName: string | null;
    emergencyContact: string | null;
    unNumber: number | null;
    createdAt: string;
    updatedAt: string;
};
