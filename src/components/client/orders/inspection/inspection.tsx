import React from 'react';

import { Inspection as InspectionType } from '@store/client/order-BOL';
import { classname } from '@utils/classname';

import { InspectionItems } from './inspection-items';
import { InspectionPhotos } from './inspection-photos';

import './inspection.scss';

const cn = classname('inspection');

type InspectionProps = {
    inspection: InspectionType;
    schematicPhotoUrl: string;
};

export const Inspection = ({ inspection, schematicPhotoUrl }: InspectionProps) => {
    const { publicId: inspectionId, items, odometer, notes, photos } = inspection;

    return (
        <div className={cn('')}>
            <InspectionItems odometer={odometer} notes={notes} items={items} />
            <InspectionPhotos photos={photos} inspectionId={inspectionId} schematicPhotoUrl={schematicPhotoUrl} />
        </div>
    );
};
