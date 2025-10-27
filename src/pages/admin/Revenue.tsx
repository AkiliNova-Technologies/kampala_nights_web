import { DataTable } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";
import { SectionCards, type CardData } from "@/components/section-cards";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search } from "@/components/ui/search";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { FilterIcon, EyeIcon } from "lucide-react";
import { TransactionDetailsDialog } from "@/components/transaction-details-dialog";
import type {
  PaymentMethod,
  Transaction,
  TransactionStatus,
} from "@/types/transaction";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type RevenueTab = "all" | "paid" | "cancelled";

export function RevenuePage() {
  const [activeTab, setActiveTab] = useState<RevenueTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<TransactionStatus[]>(
    []
  );
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading] = useState(false);

  const transactions: Transaction[] = [
    {
      id: "1",
      transactionNumber: "TXN-2025-001",
      event: "Saturday Night Vibes",
      customer: "Nakato Gloria",
      phone: "+256 700 123456",
      location: "Kampala",
      totalAmount: 150000,
      commission: 22500,
      paymentMethod: "mobile_money",
      status: "paid",
      date: "2024-01-15",
      note: "Payment Received via MTN Mobile Money",
    },
    {
      id: "2",
      transactionNumber: "TXN-2025-042",
      event: "Wine & Rhymes Night",
      customer: "Kato Brian",
      phone: "+256 750 987654",
      location: "Kampala",
      totalAmount: 387000,
      commission: 58050,
      paymentMethod: "mobile_money",
      status: "paid",
      date: "2024-01-16",
      note: "Payment Received via Airtel Mobile Money",
    },
    {
      id: "3",
      transactionNumber: "TXN-2025-087",
      event: "Amapiano Kasiki",
      customer: "Nalubwama Sheila",
      phone: "+256 772 456789",
      location: "Kampala",
      totalAmount: 500000,
      commission: 75000,
      paymentMethod: "bank_transfer",
      status: "paid",
      date: "2024-01-17",
      note: "Payment Received via Bank Transfer",
    },
    {
      id: "4",
      transactionNumber: "TXN-2025-088",
      event: "Rooftop Sundowner",
      customer: "Tumusilme Alex",
      phone: "+256 701 234567",
      location: "Kampala",
      totalAmount: 156000,
      commission: 23400,
      paymentMethod: "bank_transfer",
      status: "paid",
      date: "2024-01-18",
      note: "Payment Received via Bank Transfer",
    },
    {
      id: "5",
      transactionNumber: "TXN-2025-089",
      event: "Nile Reggae Festival",
      customer: "Mugisha David",
      phone: "+256 785 654321",
      location: "Jinja",
      totalAmount: 275000,
      commission: 41250,
      paymentMethod: "mobile_money",
      status: "cancelled",
      date: "2024-01-19",
      note: "Payment Received via MTN Mobile Money",
    },
    {
      id: "6",
      transactionNumber: "TXN-2025-090",
      event: "Quiz Night",
      customer: "Aslimwe Patricia",
      phone: "+256 700 111222",
      location: "Kampala",
      totalAmount: 450000,
      commission: 67500,
      paymentMethod: "mobile_money",
      status: "paid",
      date: "2024-01-20",
      note: "Payment Received via Airtel Mobile Money",
    },
  ];

  // Calculate statistics
  const totalTransactions = transactions.length;
  const paidTransactions = transactions.filter(
    (t) => t.status === "paid"
  ).length;
  const cancelledTransactions = transactions.filter(
    (t) => t.status === "cancelled"
  ).length;
  const totalRevenue = transactions
    .filter((t) => t.status === "paid")
    .reduce((sum, t) => sum + t.commission, 0);

  const thisMonthRevenue = 0.09 * 1000000; // 0.09M in UGX

  // Format currency in UGX
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format compact currency (for millions)
  const formatCompactCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(2)}M`;
    }
    return formatCurrency(amount);
  };

  // Fix Card data to match SectionCards interface
  const revenueCards: CardData[] = useMemo(
    () => [
      {
        title: "Total Transactions",
        value: totalTransactions.toString(),
        change: {
          description: `${paidTransactions} paid, ${cancelledTransactions} cancelled`,
        },
      },
      {
        title: "This Month",
        value: formatCompactCurrency(thisMonthRevenue),
        change: {
          trend: "up" as const,
          value: "28%",
          description: "from last month",
        },
      },
      {
        title: "Total Revenue",
        value: formatCompactCurrency(totalRevenue),
        change: {
          description: `From ${paidTransactions} paid transactions`,
        },
        cardBgColor: "#4313B8",
      },
    ],
    [
      totalTransactions,
      paidTransactions,
      cancelledTransactions,
      thisMonthRevenue,
      totalRevenue,
    ]
  );

  // Status options for filter
  const statusOptions: { value: TransactionStatus; label: string }[] = [
    { value: "paid", label: "Paid" },
    { value: "cancelled", label: "Cancelled" },
  ];

  // Filter transactions based on active tab, search query, and selected statuses
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Apply tab filter
    switch (activeTab) {
      case "paid":
        filtered = filtered.filter(
          (transaction) => transaction.status === "paid"
        );
        break;
      case "cancelled":
        filtered = filtered.filter(
          (transaction) => transaction.status === "cancelled"
        );
        break;
      case "all":
      default:
        // No additional filtering for "all" tab
        break;
    }

    // Apply status filter if any statuses are selected
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((transaction) =>
        selectedStatuses.includes(transaction.status)
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (transaction) =>
          transaction.transactionNumber.toLowerCase().includes(query) ||
          transaction.event.toLowerCase().includes(query) ||
          transaction.customer.toLowerCase().includes(query) ||
          transaction.location.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [transactions, activeTab, selectedStatuses, searchQuery]);

  const handleStatusFilterChange = (status: TransactionStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const clearAllFilters = () => {
    setSelectedStatuses([]);
    setSearchQuery("");
  };

  //   const getInitials = (name: string): string => {
  //     if (!name || typeof name !== 'string') {
  //       return 'TN';
  //     }
  //     return name
  //       .split(" ")
  //       .map((word) => word.charAt(0).toUpperCase())
  //       .join("")
  //       .slice(0, 2);
  //   };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case "mobile_money":
        return "";
      case "bank_transfer":
        return "";
      case "card":
        return "";
      default:
        return "";
    }
  };

  const transactionFields = [
    {
      key: "transactionNumber",
      header: "Transaction #",
      enableHiding: false,
      cell: (value: unknown, row: Transaction) => (
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-medium text-sm">{String(value)}</span>
            <span className="text-xs text-muted-foreground">{row.date}</span>
          </div>
        </div>
      ),
    },
    {
      key: "event",
      header: "Event",
      cell: (value: unknown, row: Transaction) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{String(value)}</span>
          <span className="text-xs text-muted-foreground">
            {row.customer} {row.phone}
          </span>
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      cell: (value: unknown) => (
        <span className="font-medium">{String(value)}</span>
      ),
    },
    {
      key: "totalAmount",
      header: "Total Amount (UGX)",
      cell: (value: unknown) => (
        <div className="text-left">
          <span className="font-medium">{formatCurrency(value as number)}</span>
        </div>
      ),
      align: "left" as const,
    },
    {
      key: "commission",
      header: "15% Commission (UGX)",
      cell: (value: unknown) => (
        <div className="text-left">
          <span className="font-medium">{formatCurrency(value as number)}</span>
        </div>
      ),
      align: "left" as const,
    },
    {
      key: "paymentMethod",
      header: "Payment Method",
      cell: (value: unknown) => (
        <div className="flex items-center gap-2">
          <span className="text-lg">
            {getPaymentMethodIcon(value as PaymentMethod)}
          </span>
          <span className="font-medium capitalize">
            {(value as string).replace("_", " ")}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (value: unknown) => {
        const status = value as TransactionStatus;
        const statusConfig = {
          paid: {
            label: "Paid",
            dotColor: "bg-green-500",
            textColor: "text-green-700",
            bgColor: "bg-green-50",
          },
          cancelled: {
            label: "Cancelled",
            dotColor: "bg-red-500",
            textColor: "text-red-700",
            bgColor: "bg-red-50",
          },
        };

        const config = statusConfig[status] || statusConfig.paid;

        return (
          <Badge
            variant="secondary"
            className={`flex flex-row items-center w-20 gap-2 ${config.bgColor} ${config.textColor}`}
          >
            <div className={`size-2 rounded-full ${config.dotColor}`} />
            {config.label}
          </Badge>
        );
      },
      align: "center" as const,
    },
  ];

  const transactionActions = [
    {
      type: "view" as const,
      label: "View Details",
      icon: <EyeIcon className="size-5" />,
      onClick: (row: Transaction) => {
        setSelectedTransaction(row);
        setIsDialogOpen(true);
      },
    },
  ];

  const handleDownloadInvoice = (transaction: Transaction) => {
    console.log("Downloading invoice for:", transaction.transactionNumber);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader label="Platform Revenue" />
      <main className="flex-1">
        <div className="space-y-6 p-6">
          <SectionCards cards={revenueCards} layout="1x3" />

          <div className="space-y-6">
            <div className="rounded-lg border bg-card py-6 mb-6">
              <div className="items-center px-6 mb-8">
                <h2 className="text-2xl font-bold mb-3">
                  Revenue Transactions
                </h2>
                <p className="text-muted-foreground">
                  Platform commission from event bookings
                </p>
              </div>

              {/* Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as RevenueTab)}
                className=" w-full px-6 bg-transparent rounded-none"
              >
                <TabsList className="grid w-full h-11  grid-cols-3 rounded-none p-0 bg-transparent border-b">
                  <TabsTrigger
                    className="bg-transparent h-11 border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                    value="all"
                  >
                    All Transactions
                  </TabsTrigger>
                  <TabsTrigger
                    className="bg-transparent h-11 border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                    value="paid"
                  >
                    Paid
                  </TabsTrigger>
                  <TabsTrigger
                    className="bg-transparent h-11 border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                    value="cancelled"
                  >
                    Cancelled
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Search and Filter Section */}
              <div className="px-6 mt-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="w-full flex-1">
                  <Search
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onSearchChange={setSearchQuery}
                    className="rounded-full flex"
                  />
                </div>

                <div className="flex gap-2 items-center">
                  {/* Status Filter Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 h-12"
                        disabled={loading}
                      >
                        <FilterIcon className="w-4 h-4" />
                        All Status
                        {selectedStatuses.length > 0 && (
                          <Badge variant="secondary" className="ml-1">
                            {selectedStatuses.length}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {statusOptions.map((status) => (
                        <DropdownMenuCheckboxItem
                          key={status.value}
                          checked={selectedStatuses.includes(status.value)}
                          onCheckedChange={() =>
                            handleStatusFilterChange(status.value)
                          }
                        >
                          {status.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Clear Filters Button */}
                  {(selectedStatuses.length > 0 || searchQuery) && (
                    <Button
                      variant="ghost"
                      onClick={clearAllFilters}
                      className="text-sm"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>

              <div className="px-6">
                <DataTable
                  data={filteredTransactions}
                  fields={transactionFields}
                  actions={transactionActions}
                  enableSelection={true}
                  enablePagination={true}
                  pageSize={10}
                  loading={loading}
                  onRowClick={(row) => {
                    console.log("Transaction clicked:", row);
                  }}
                />
              </div>
            </div>
          </div>

          <TransactionDetailsDialog
            transaction={selectedTransaction}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onDownloadInvoice={handleDownloadInvoice}
          />
        </div>
      </main>
    </div>
  );
}
