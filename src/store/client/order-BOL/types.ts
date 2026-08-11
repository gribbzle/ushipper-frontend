import { DamageCode } from '@/enums/damage-code';
import { InspectionSubtype } from '@/enums/inspection-subtype';
import { InspectionType } from '@/enums/inspection-type';
import { NullableFields } from '@/shared/nullable';
import { Attachment, Creator } from '@/shared/types';

export type InspectionItem = number | string | boolean | null;

export type InspectionItems = {
    cargoCover: InspectionItem;
    drivable: InspectionItem;
    glasses: InspectionItem;
    headphones: InspectionItem;
    headrests: InspectionItem;
    keys: InspectionItem;
    manuals: InspectionItem;
    navigationDisk: InspectionItem;
    pluginChargerCable: InspectionItem;
    radio: InspectionItem;
    remotes: InspectionItem;
    spareTire: InspectionItem;
    title: InspectionItem;
    windscreen: InspectionItem;
};

export type InspectionLabel = {
    publicId: string;
    abscissa: number;
    ordinate: number;
    type: InspectionSubtype;
    damageCode: DamageCode;
};

export type InspectionPhoto = {
    publicId: string;
    originalPhoto: Attachment;
    labels: InspectionLabel[];
    createdAt: string;
    updatedAt: string;
} & NullableFields<{
    markedPhoto: MarkedPhoto;
}>;

export type MarkedPhoto = {
    createdAt: string;
    creator: Creator;
    extension: string;
    name: string;
    url: string;
};

export type SchematicPhoto = Omit<InspectionPhoto, 'publicId'>;

export type Inspection = {
    publicId: string;
    type: InspectionType;
    subtype: InspectionSubtype;
    items: InspectionItems;
    photos: InspectionPhoto[];
    schematicPhoto: SchematicPhoto;
    creator: Creator;
    createdAt: string;
    updatedAt: string;
} & NullableFields<{
    odometer: number;
    notes: string;
}>;

export type Inspections = NullableFields<{
    pickup: Inspection;
    delivery: Inspection;
}>;
