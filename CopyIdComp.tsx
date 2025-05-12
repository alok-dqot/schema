import React from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';



interface CopyIdCompProps {
    id: string | number;
    children?: React.ReactNode;
}

const CopyIdComp = ({ id, children }: CopyIdCompProps) => {
    return (
        <CopyToClipboard
            text={String(id)}
            onCopy={() =>
                toast.success(`Id ${id} copied to clipboard`, {
                    position: "top-center",
                })
            }
        >
            <span className='copy-clipboard'>
                <ContentCopyIcon />
                {children}
            </span>
        </CopyToClipboard>
    );
};

export default CopyIdComp;