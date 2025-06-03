import { FileImageOutlined } from '@ant-design/icons';
import { Button, Upload, UploadProps } from 'antd';
import React, { Dispatch, SetStateAction } from 'react';
interface AddBackgroundProps {
    backgroundImage: string | null
    setBackgroundColor: Dispatch<SetStateAction<string>>
    setBackgroundImage: Dispatch<SetStateAction<string | null>>
}

const AddBackground: React.FC<AddBackgroundProps> = ({ setBackgroundColor, setBackgroundImage, backgroundImage }) => {
    const props: UploadProps = {
        name: 'file',
        action: '/api/upload',
        onChange(info) {
            if (info.file.status === 'done') {
                console.log('Uploaded file URL:', info.file.response.filepath);
                setBackgroundImage(info.file.response.filepath)
            }
        },
    };

    return <>
        {backgroundImage == null ?
            <div className="inline-block">
                <Upload {...props}>
                    <Button icon={<FileImageOutlined />}>Đặt hình nền</Button>
                </Upload>
            </div>
            :
            <Button danger onClick={() => setBackgroundImage(null)} style={{ marginRight: 10 }}>
                Xóa hình nền
            </Button>
        }
    </>
}

export default AddBackground
