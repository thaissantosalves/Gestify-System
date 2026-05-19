const tickets = [
  {
    id: "#1024",
    client: "Maria Silva",
    subject: "Pedido atrasado",
    date: "19/05/2026",
    status: "Pendente",
    badge: "badge--warning" as const,
  },
  {
    id: "#1023",
    client: "João Santos",
    subject: "Troca de produto",
    date: "18/05/2026",
    status: "Em andamento",
    badge: "badge--warning" as const,
  },
  {
    id: "#1022",
    client: "Ana Costa",
    subject: "Dúvida sobre estoque",
    date: "18/05/2026",
    status: "Resolvido",
    badge: "badge--success" as const,
  },
  {
    id: "#1021",
    client: "Pedro Lima",
    subject: "Cancelamento",
    date: "17/05/2026",
    status: "Urgente",
    badge: "badge--danger" as const,
  },
];

export default function RecentTickets() {
  return (
    <article className="panel-card">
      <h2 className="panel-card__title">Tickets recentes</h2>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Assunto</th>
              <th>Data</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="text-brand">{ticket.id}</td>
                <td>{ticket.client}</td>
                <td>{ticket.subject}</td>
                <td className="text-secondary">{ticket.date}</td>
                <td>
                  <span className={`badge ${ticket.badge}`}>{ticket.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
