import { FileImageOutlined, FileOutlined, FileTextOutlined, YoutubeOutlined } from "@ant-design/icons";
import { FileWithPreview } from "./Assets";

function getFileIcon(fileName: string) {
    const ext = fileName.split('.').pop()?.toLowerCase();

    if (!ext) return <FileOutlined />;
    if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(ext)) return <FileImageOutlined />;
    if (['mp3', 'wav', 'flac', 'ogg'].includes(ext)) return <YoutubeOutlined />;
    if (['mp4', 'webm', 'ogg'].includes(ext)) return <YoutubeOutlined />;
    if (['txt', 'md', 'log', 'json'].includes(ext)) return <FileTextOutlined />;

    return <FileOutlined />;
}
function isImageFile(name: string) {
    const ext = name.split('.').pop()?.toLowerCase();
    return ext ? ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(ext) : false;
}

function isVideoFile(name: string) {
    const ext = name.split('.').pop()?.toLowerCase();
    return ext ? ['mp4', 'webm', 'ogg'].includes(ext) : false;
}

// ===== Helpers =====

async function listFilesByFolder(
    handle: FileSystemDirectoryHandle,
    path = ''
): Promise<{ [folder: string]: FileWithPreview[] }> {
    const data: { [folder: string]: FileWithPreview[] } = {};

    for await (const [name, entry] of (handle as any).entries()) {
        const folderKey = path || '/';

        if (entry.kind === 'file') {
            let url: string | undefined;
            if (isImageFile(entry.name) || isVideoFile(entry.name)) {
                const file = await entry.getFile();
                url = URL.createObjectURL(file);
            }
            if (!data[folderKey]) data[folderKey] = [];
            data[folderKey].push({ handle: entry, url });
        }

        if (entry.kind === 'directory') {
            const subFolderKey = path ? `${path}/${name}` : name;
            const subData = await listFilesByFolder(entry, subFolderKey);
            Object.assign(data, subData);
        }
    }

    return data;
}



export { getFileIcon, isImageFile, isVideoFile, listFilesByFolder }

