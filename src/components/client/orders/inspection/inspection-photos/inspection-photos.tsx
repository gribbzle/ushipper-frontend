import React from 'react';

import { Button } from '@/components/common/button/button';
import { getArchiveOfInspectionCarBodyPhotos } from '@api';
import { DownloadIcon } from '@icons';
import { ImageProvider } from '@providers';
import { InspectionPhoto } from '@store/client/order-BOL';
import { ImageView } from '@ui';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './inspection-photos.scss';

const cn = classname('photos-container');
const t = translateByNamespace('client:order:inspection');

type InspectionPhotosProps = {
    photos: InspectionPhoto[];
    inspectionId: string;
    schematicPhotoUrl: string;
};

export const InspectionPhotos = ({ inspectionId, photos, schematicPhotoUrl }: InspectionPhotosProps) => {
    const handleDownload = async () => {
        await getArchiveOfInspectionCarBodyPhotos(inspectionId);
    };

    return (
        <div className={cn()}>
            <ImageProvider>
                <ImageView src={schematicPhotoUrl} alt='schematic photo' className={cn('schematic-photo')} />
                <div className={cn('other-photos')}>
                    {photos.map(photo => {
                        const photoUrl = photo.markedPhoto?.url ?? photo.originalPhoto.url;
                        const photoName = photo.originalPhoto.name;

                        return <ImageView key={photo.publicId} src={photoUrl} alt={photoName} className={cn('photo')} />;
                    })}
                </div>
            </ImageProvider>

            <Button className={cn('download-all-photos-button')} onClick={handleDownload}>
                <DownloadIcon />
                {t('download-all-photos')}
            </Button>
        </div>
    );
};
