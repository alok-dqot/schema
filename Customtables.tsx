import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@table-library/react-table-library/theme';
import { usePagination } from '@table-library/react-table-library/pagination';
import { Column, CompactTable } from '@table-library/react-table-library/compact';
// import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import AddIcon from '@mui/icons-material/Add';
// import Button from '@mui/material/Button';
import CustomPagination from './pagination';




interface DynamicTableProps {
  data: {};
  page_title: string;
  columns: any;
  columnWidth: string;
  handleFilter: (params: { p?: number; sz?: number; s?: string }) => void;

}

const DynamicUserTable: React.FC<DynamicTableProps> = ({
  data,
  page_title,
  columns,
  columnWidth,
  handleFilter
}) => {


  const customTheme = {
    Table: `
        display:grid;
      --data-table-library_grid-template-columns: ${columnWidth};`,
    BaseRow: `
      font-size: 14px;
      border-bottom: 1px solid var(--white); `,
    HeaderRow: `
      background-color: var(--selected-primary);
      color: #555;
      font-weight: 600;
      font-size: 13px;
    `,
    HeaderCell: `
      padding: 16px;
      text-align: left;
    `,
    Cell: `
      padding: 16px;
    `,
  };

  const theme = useTheme(customTheme);

  const [pageSize, setPageSize] = useState(10);

  const tableData = { nodes: data } as any;
  const pagination = usePagination(tableData, {
    state: { page: 0, size: pageSize },
  });

  const totalPages = Math.ceil(tableData.nodes.length / pagination.state.size);

  const [page, setPage] = useState(0)

  useEffect(() => {
    handleFilter({ p: page + 1, sz: pageSize });
  }, [page, pageSize]);


  return (
    <div className="user-management-container">
      <div className="tbl-header">
        <h2>{page_title} </h2>
      </div>

      <CompactTable
        columns={columns}
        data={{ nodes: data }}
        theme={theme}
        pagination={pagination}
        layout={{ custom: true }}
      />


      <CustomPagination totalPages={totalPages} pageSize={pageSize} setPageSize={setPageSize} currentPage={page} setPage={setPage} />

    </div>
  );
};

export default DynamicUserTable;
