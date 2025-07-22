// ClientesPage.tsx
import { ClienteList } from "../components/Cliente/ClienteList";
import { ClienteForm } from "../components/Cliente/ClienteForm";

export const ClientesPage = () => {
  return (
    <div>
      <h1>Gestión de Clientes</h1>
      <ClienteForm />
      <hr />
      <ClienteList />
    </div>
  );
};
