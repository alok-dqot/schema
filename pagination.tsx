import React, { useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

type PaginationProps = {
    currentPage: number;
    setPage: (page: number) => void;
    totalPages: number;
    pageSize: number;
    setPageSize: (size: number) => void;
};

const CustomPagination: React.FC<PaginationProps> = ({
    currentPage,
    setPage,
    totalPages,
    pageSize,
    setPageSize,
}) => {
    const [gotoPage, setGotoPage] = useState(currentPage + 1);

    const getVisiblePages = (): number[] => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i);
        const start = Math.max(0, Math.min(currentPage - 2, totalPages - 5));
        return Array.from({ length: 5 }, (_, i) => start + i);
    };

    const onGoToPage = () => {
        const page = Math.max(1, Math.min(totalPages, Number(gotoPage)));
        if (!isNaN(page)) setPage(page - 1);
    };

    return (
        <div className="pagination-outer">
            <div className="pagination-buttons">
                <button
                    className={`pagination-button-arrow ${currentPage === 0 ? "disabled" : ""}`}
                    disabled={currentPage === 0}
                    onClick={() => setPage(currentPage - 1)}
                >
                    <KeyboardArrowLeftIcon />
                </button>

                {getVisiblePages().map((page) => (
                    <button
                        key={page}
                        className={`pagination-button ${currentPage === page ? "active" : ""}`}
                        onClick={() => setPage(page)}
                    >
                        {page + 1}
                    </button>
                ))}

                <button
                    className={`pagination-button-arrow ${currentPage + 1 === totalPages ? "disabled" : ""}`}
                    disabled={currentPage + 1 === totalPages}
                    onClick={() => setPage(currentPage + 1)}
                >
                    <KeyboardArrowRightIcon />
                </button>
            </div>

            <div className="pagination-controls">
                <select
                    className="pagination-select"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    disabled={totalPages <= 1}
                >
                    <option>Size</option>
                    {[10, 15, 20, 50, 100, 300].map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>

            <div className="pagination-goto">
                <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={gotoPage}
                    onChange={(e) => setGotoPage(Number(e.target.value))}
                    onKeyDown={(e) => e.key === "Enter" && onGoToPage()}
                />
            </div>
        </div>
    );
};

export default CustomPagination;
