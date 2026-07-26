export const isFileImage = (fileName: string) => fileName.match(/\.(jpg|jpeg|png|gif|webp|web)$/i);
export const isFilePdf = (fileName: string) => /\.(pdf)$/i.test(fileName);

export type DownloadFile = {
    url: string;
    filename: string;
};

export const downloadFileUsingAnchorElement = ({ url, filename }: DownloadFile) => {
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = filename;
    anchor.target = '_blank';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    window.URL.revokeObjectURL(url);
};

export const downloadFileUsingFetch = async ({ url, filename }: DownloadFile) => {
    try {
        const response = await fetch(url, { mode: 'cors' });

        if (!response.ok) throw new Error('Download failed');

        const blob = await response.blob();
        const objectUrl = window.URL.createObjectURL(blob);

        const anchor = document.createElement('a');

        anchor.href = objectUrl;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);

        window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
        console.error('Error downloading file:', error);
    }
};
