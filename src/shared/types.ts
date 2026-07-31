import { AttachmentType } from '@/enums';

import { Avatar } from '../store/common/staff/avatar-types';

export type SelectOption<T = unknown> = {
    label: string;
    value: T;
    isDisabled?: boolean;
};

export type PreviewImage = {
    url: string;
    extension: string;
};

export type Attachment = {
    publicId: string;
    url: string;
    name: string;
    extension: string;
    size: number;
    creator: Creator | null;
    previewImages: PreviewImage[];
    createdAt: string;
    updatedAt: string;
    type: AttachmentType | null;
};

export type CreatorCompanyInfo = {
    publicId: string;
    name: string;
    nickname?: string;
    type: 'carrier' | 'shipper';
    reviewsCompleted: number;
    state: string;
    city: string;
};

export type Creator = {
    name: string;
    nickname?: string;
    avatar: Avatar;
    roleName: string;
    company: CreatorCompanyInfo;
};

export type ColorValueHex = `#${string}`;

export type OrderVehicle = {
    id: number;
    vin: string | null;
    year: number | null;
    make: string | null;
    model: string | null;
    type: string;
    color: string | null;
    lotNumber: string | null;
    price: number | null;
    inop: boolean;
    enclosed: boolean;
    schematicPhoto: string;
    weight: number | null;
    height: number | null;
    length: number | null;
    width: number | null;
};

export type RequestError = {
    status: number;
    data: {
        message: string;
    };
};

type Attributes = Record<string, any>;

export type ChangeDetails = {
    originalAttributes: Attributes;
    changedAttributes: Attributes;
};

export type ChangeLog = {
    id: string;
    field: string;
    prevValue: string;
    newValue: string;
};
