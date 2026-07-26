import React from 'react';

import { AttachmentItem } from '@/components/common';
import { useCDContractAttachment } from '@/hooks/order';
import { ImageProvider } from '@providers';

export const ContractInfo = ({ publicId }: { publicId: string }) => {
    const { cdContract } = useCDContractAttachment(publicId);

    return (
        <ImageProvider>
            <AttachmentItem attachment={cdContract} />
        </ImageProvider>
    );
};
