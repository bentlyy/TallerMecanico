import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Factura } from "../../types";

interface FacturaListProps {
  facturas: Factura[];
  onEdit: (factura: Factura) => void;
  onDelete: (id: number) => void;
}

const FacturaList = ({ facturas, onEdit, onDelete }: FacturaListProps) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Fecha</TableCell>
          <TableCell>Cliente ID</TableCell>
          <TableCell>Total</TableCell>
          <TableCell>Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {facturas.map((factura) => (
          <TableRow key={factura.id}>
            <TableCell>{factura.id}</TableCell>
            <TableCell>{factura.fecha}</TableCell>
            <TableCell>{factura.clienteId}</TableCell>
            <TableCell>{factura.total}</TableCell>
            <TableCell>
              <IconButton onClick={() => onEdit(factura)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => onDelete(factura.id)}>
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default FacturaList;
