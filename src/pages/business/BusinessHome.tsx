import { PlatformActivityChart } from "@/components/PlatformActivityChart";
import { SectionCards, type CardData } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import {
  DataTable,
  type TableField,
  type TableAction,
} from "@/components/data-table";
import {
  CalendarIcon,
  DollarSignIcon,
  UsersIcon,
  TrendingUpIcon,
  EyeIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

type Event = {
  id: string;
  name: string;
  date: string;
  time: string;
  attendees: number;
  status: "ATTENDED" | "PAID" | "CANCELLED";
  revenue: number;
  location?: string;
};

export function BusinessHome() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockEvents: Event[] = [
      {
        id: "1",
        name: "Saturday Night Vibes",
        date: "Oct 25, 2025",
        time: "20:00",
        attendees: 254,
        status: "ATTENDED",
        revenue: 150000,
      },
      {
        id: "2",
        name: "Wine & Rhymes Night",
        date: "Oct 25, 2025",
        time: "20:00",
        attendees: 308,
        status: "PAID",
        revenue: 387000,
      },
      {
        id: "3",
        name: "Amapiano Kasiki",
        date: "Oct 29, 2025",
        time: "22:00",
        attendees: 500,
        status: "PAID",
        revenue: 500000,
      },
      {
        id: "4",
        name: "Rooftop Sundowner",
        date: "Oct 25, 2025",
        time: "20:00",
        attendees: 1000,
        status: "CANCELLED",
        revenue: 156000,
      },
      {
        id: "5",
        name: "Nile Reggae Festival",
        date: "Oct 25, 2025",
        time: "20:00",
        attendees: 200,
        status: "CANCELLED",
        revenue: 275000,
      },
    ];

    setEvents(mockEvents);
    setLoading(false);
  }, []);

  const dashboardCards: CardData[] = [
    {
      rightIcon: <CalendarIcon className="size-4" />,
      iconBgColor: "bg-blue-500",
      title: "Total Events",
      value: "48",
      change: {
        value: "20%",
        description: "from last month",
      },
    },
    {
      rightIcon: <TrendingUpIcon className="size-4" />,
      iconBgColor: "bg-purple-500",
      title: "Platform Activity",
      value: "24",
      change: {
        description: "Check-ins via app",
      },
    },
    {
      rightIcon: <UsersIcon className="size-4" />,
      iconBgColor: "bg-green-500",
      title: "Avg. Reservations",
      value: "1,247",
      change: {
        description: "Headcount across events",
      },
    },
    {
      rightIcon: <DollarSignIcon className="size-4" />,
      iconBgColor: "bg-orange-500",
      title: "Total Revenue",
      value: "UGX.89,420",
      change: {
        description: "From all events",
      },
    },
  ];

  const getStatusConfig = (status: Event["status"]) => {
    const config = {
      ATTENDED: {
        label: "Attended",
        dotColor: "bg-green-500",
        textColor: "text-green-700",
        bgColor: "bg-green-50",
      },
      PAID: {
        label: "Paid",
        dotColor: "bg-blue-500",
        textColor: "text-blue-700",
        bgColor: "bg-blue-50",
      },
      CANCELLED: {
        label: "Cancelled",
        dotColor: "bg-red-500",
        textColor: "text-red-700",
        bgColor: "bg-red-50",
      },
    };

    return config[status] || config.PAID;
  };

  const formatRevenue = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const eventFields: TableField<Event>[] = [
    {
      key: "name",
      header: "Event",
      enableHiding: false,
      cell: (value) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{value as string}</span>
        </div>
      ),
    },
    {
      key: "date",
      header: "Date & Time",
      cell: (_, row) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.date} {row.time}</span>
        </div>
      ),
    },
    {
      key: "attendees",
      header: "Attendees",
      cell: (value) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{value as number}</span>
        </div>
      ),
      align: "center",
    },
    {
      key: "status",
      header: "Status",
      cell: (value) => {
        const config = getStatusConfig(value as Event["status"]);
        return (
          <Badge
            variant="secondary"
            className={`flex flex-row items-center w-26 gap-2 ${config.bgColor} ${config.textColor}`}
          >
            <div className={`size-2 rounded-full ${config.dotColor}`} />
            {config.label}
          </Badge>
        );
      },
      align: "center",
    },
    {
      key: "revenue",
      header: "Revenue",
      cell: (value) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{formatRevenue(value as number)}</span>
        </div>
      ),
      align: "right",
    },
  ];

  const eventActions: TableAction<Event>[] = [
    {
      type: "view",
      label: "View Details",
      icon: <EyeIcon className="size-5 text-[#8C8C8C]" />,
      onClick: (event) => console.log("View event:", event),
    },
  ];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <div className="space-y-6 p-6">
          <SectionCards cards={dashboardCards} />

          <div className="space-y-6">
            <PlatformActivityChart />

            {/* Events Section */}
            <div className="rounded-lg border bg-card p-6 mb-6">
              <DataTable<Event>
                title="Events"
                description="Manage your events and track performance"
                data={events}
                fields={eventFields}
                actions={eventActions}
                enableSelection={true}
                enablePagination={true}
                pageSize={6}
                loading={loading}
                onRowClick={(event) => {
                  console.log("Event clicked:", event);
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}