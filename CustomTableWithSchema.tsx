import React, { useState, useEffect } from 'react';
import { useTheme } from '@table-library/react-table-library/theme';
import { Column, CompactTable } from '@table-library/react-table-library/compact';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import CustomPagination from './pagination';
import CustomDialogBox from '../../components/dialog/CustomDialog';

interface CustomTableSchema {
  data: any[];
  page_title: string;
  columns: Column<any>[];
  columnWidth: string;
  schema: any;
  handleSubmit: (val: any) => void;
  handleClose: () => void;
  handleOpen: () => void;
  isEdit: boolean;
  open: boolean;
  defaultValues: any;
  totalList: number;
  handleFilter: (params: { p?: number; sz?: number; s?: string }) => void;
}

const DynamicTableSchema: React.FC<CustomTableSchema> = ({
  data,
  page_title,
  columns,
  columnWidth,
  schema,
  handleSubmit,
  isEdit,
  defaultValues,
  open,
  handleClose,
  handleOpen,
  totalList,
  handleFilter,
}) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    handleFilter({ p: page + 1, sz: pageSize });
  }, [page, pageSize]);

  const theme = useTheme({
    Table: `display: grid; --data-table-library_grid-template-columns: ${columnWidth};`,
    BaseRow: `font-size: 14px; border-bottom: 1px solid var(--white);`,
    HeaderRow: `background-color: var(--selected-primary); color: #555; font-weight: 600; font-size: 13px;`,
    HeaderCell: `padding-inline: 10px;padding-block:5px; text-align: left;font-size: 11px;`,
    Cell: `padding-inline: 10px;padding-block:8px;`,
  });

  return (
    <div className="user-management-container">
      <div className="tbl-header">
        <h2>{page_title} List</h2>
        <Button variant="outlined" size="small" onClick={handleOpen}>
          <AddIcon />
        </Button>
      </div>

      <CompactTable
        columns={columns}
        data={{ nodes: data }}
        theme={theme}
        layout={{ custom: true }}
      />

      <CustomPagination
        currentPage={page}
        setPage={setPage}
        totalPages={totalList}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />

      <CustomDialogBox
        open={open}
        handleClose={handleClose}
        page_title={page_title}
        isEdit={isEdit}
        schema={schema}
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
      />
    </div>
  );
};

export default DynamicTableSchema;
