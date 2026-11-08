import { DataGrid, GridColDef, GridSlots } from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';
import CustomNoRowsOverlay from '@common/ui/elements/table/customOverlay/NoRowsOverlay';

export interface SjDataTableProps {
  rows: Record<string, string | number | null>[];
  columns: GridColDef[];
}

const SjDataTable = ({ rows, columns }: SjDataTableProps) => {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 20, 50]}
        checkboxSelection
        slots={{
          loadingOverlay: LinearProgress as GridSlots['loadingOverlay'],
          noRowsOverlay: CustomNoRowsOverlay,
        }}
      />
    </div>
  );
};

export default SjDataTable;
