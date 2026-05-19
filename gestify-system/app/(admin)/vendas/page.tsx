import SectionPlaceholder from "@/components/admin/SectionPlaceholder";

export default function VendasPage() {
  return (
    <SectionPlaceholder
      items={[
        "Pedidos em andamento",
        "Vendas concluídas",
        "Cancelamentos",
        "Relatório por período",
      ]}
    />
  );
}
