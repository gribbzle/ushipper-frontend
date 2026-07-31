type PreviewImage = {
    url: string;
    extension: string;
};

export type Avatar = {
    url: string;
    name: string;
    extension: string;
    size: number;
    previewImages: PreviewImage[];
};
