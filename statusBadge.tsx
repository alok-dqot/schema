import React from 'react';

interface StatusBadgeProps {
    status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return { backgroundColor: '#4caf50', color: '#fff' };
            case 'inactive':
                return { backgroundColor: '#9e9e9e', color: '#fff' };
            case 'pending':
                return { backgroundColor: '#ff9800', color: '#fff' };
            case 'suspended':
                return { backgroundColor: '#f44336', color: '#fff' };
            default:
                return { backgroundColor: '#607d8b', color: '#fff' };
        }
    };

    return (
        <span
            className="role-badge"
            style={{
                ...getStatusStyle(status),
            }}
        >
            {status}
        </span>
    );
};

export default StatusBadge;
