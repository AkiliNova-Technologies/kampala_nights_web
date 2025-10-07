import {
  DataTable,
  type TableAction,
  type TableField,
} from "@/components/data-table";
import { InvoiceDetailsDialog } from "@/components/invoice-details-dialog";

import { SectionCards, type CardData } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Search } from "@/components/ui/search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Invoice, InvoiceStatus, InvoiceTab } from "@/types/invoice";

import { EyeIcon, FilterIcon } from "lucide-react";
import { useState, useMemo } from "react";


export function InvoicePage() {
  const [activeTab, setActiveTab] = useState<InvoiceTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<InvoiceStatus[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null); 
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [invoiceData] = useState<Invoice[]>([
    {
      id: 1,
      customer: "Nakato Gloria",
      image: "",
      invoiceNumber: "INV-2025-001",
      event: "Saturday Night Vibes",
      amount: 150000,
      dueDate: "Sep 28, 2025",
      status: "cancelled",
      paymentMethod: "Mobile Money",
    },
    {
      id: 2,
      customer: "Kato Brian",
      image: "",
      invoiceNumber: "INV-2025-042",
      event: "Wine & Rhymes Night",
      amount: 387000,
      dueDate: "Sep 15, 2025",
      status: "paid",
      paymentMethod: "Mobile Money",
    },
    {
      id: 3,
      customer: "Nalubwama Sheila",
      image: "",
      invoiceNumber: "INV-2025-087",
      event: "Amapiano Kasiki",
      amount: 500000,
      dueDate: "Sep 14, 2025",
      status: "paid",
      paymentMethod: "Mobile Money",
    },
    {
      id: 4,
      customer: "Tumuslime Alex",
      image: "",
      invoiceNumber: "INV-2025-087",
      event: "Rooftop Sundowner",
      amount: 156000,
      dueDate: "Aug 5, 2025",
      status: "cancelled",
      paymentMethod: "Bank Transfer",
    },
    {
      id: 5,
      customer: "Mugisha David",
      image: "",
      invoiceNumber: "INV-2025-087",
      event: "Nile Reggae Festival",
      amount: 275000,
      dueDate: "Aug 10, 2025",
      status: "cancelled",
      paymentMethod: "Bank Transfer",
    },
  ]);

  // Available status options for filter
  const statusOptions: { value: InvoiceStatus; label: string }[] = [
    { value: "paid", label: "Paid" },
    { value: "cancelled", label: "Cancelled" },
  ];

  // Filter invoices based on active tab, search query, and selected statuses
  const filteredInvoices = useMemo(() => {
    let filtered = invoiceData;

    // Apply tab filter
    switch (activeTab) {
      case "paid":
        filtered = filtered.filter((invoice) => invoice.status === "paid");
        break;
      case "cancelled":
        filtered = filtered.filter((invoice) => invoice.status === "cancelled");
        break;
      case "all":
      default:
        // No additional filtering for "all" tab
        break;
    }

    // Apply status filter if any statuses are selected
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((invoice) =>
        selectedStatuses.includes(invoice.status)
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (invoice) =>
          invoice.customer.toLowerCase().includes(query) ||
          invoice.invoiceNumber.toLowerCase().includes(query) ||
          invoice.event.toLowerCase().includes(query) ||
          invoice.paymentMethod.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [invoiceData, activeTab, selectedStatuses, searchQuery]);

  const handleStatusFilterChange = (status: InvoiceStatus) => {
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

  const invoiceCards: CardData[] = [
    {
      title: "Total Invoices",
      value: "160",
      change: {
        trend: "up",
        value: "0.9%",
        description: "from last month",
      },
    },
    {
      title: "Paid Invoice",
      value: "40",
      change: {
        trend: "up",
        value: "29%",
        description: "from last month",
      },
    },
    {
      title: "Cancelled",
      value: "40",
      change: {
        trend: "up",
        value: "39%",
        description: "from last month",
      },
    },
    {
      title: "Total Revenue",
      value: "8.4M",
      change: {
        description: "UGX",
      },
    },
  ];

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const formatAmount = (amount: number): string => {
    return amount.toLocaleString("en-US");
  };

  const invoiceFields: TableField<Invoice>[] = [
    {
      key: "customer",
      header: "Customer",
      cell: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={row.image} alt={row.customer} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {getInitials(row.customer)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm">{row.customer}</span>
        </div>
      ),
    },
    {
      key: "invoiceNumber",
      header: "Invoice #",
      cell: (value) => (
        <span className="font-medium text-sm">{value as string}</span>
      ),
    },
    {
      key: "event",
      header: "Event",
      cell: (value) => <span className="font-medium">{value as string}</span>,
    },
    {
      key: "amount",
      header: "Amount (UGX)",
      cell: (value) => (
        <span className="font-medium">{formatAmount(value as number)}</span>
      ),
      align: "right",
    },
    {
      key: "dueDate",
      header: "Due Date",
      cell: (value) => <span className="font-medium">{value as string}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (value) => {
        const statusConfig = {
          paid: {
            label: "Paid",
            dotColor: "bg-green-500",
          },
          cancelled: {
            label: "Cancelled",
            dotColor: "bg-red-500",
          },
        };

        const config =
          statusConfig[value as keyof typeof statusConfig] ||
          statusConfig.paid;

        return (
          <Badge
            variant="secondary"
            className="flex flex-row items-center w-24 gap-2 bg-muted/50"
          >
            <div className={`size-2 rounded-full ${config.dotColor}`} />
            {config.label}
          </Badge>
        );
      },
      align: "center",
      enableSorting: true,
    },
    {
      key: "paymentMethod",
      header: "Payment Method",
      cell: (value) => <span className="font-medium">{value as string}</span>,
    },
  ];

  const invoiceActions: TableAction<Invoice>[] = [
    {
      type: "view",
      label: "View Details",
      icon: <EyeIcon className="size-5" />,
      onClick: (invoice) => {
        console.log("View invoice details:", invoice);
        setSelectedInvoice(invoice); // Set the selected invoice
        setIsDialogOpen(true); // Open the dialog
      },
    },
  ];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <div className="space-y-6 p-6">
          <SectionCards cards={invoiceCards} layout="1x4" />

          <div className="space-y-6">
            {/* Invoices Section */}
            <div className="rounded-lg border bg-card py-6 mb-6">
              {/* Tabs for filtering invoices by status */}
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as InvoiceTab)}
                className="px-6 w-full bg-transparent rounded-none"
              >
                <TabsList className="grid w-full max-w-full grid-cols-3 rounded-none p-0 bg-transparent border-b">
                  <TabsTrigger
                    className="bg-transparent border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                    value="all"
                  >
                    All Invoices
                  </TabsTrigger>
                  <TabsTrigger
                    className="bg-transparent border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                    value="paid"
                  >
                    Paid
                  </TabsTrigger>
                  <TabsTrigger
                    className="bg-transparent border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                    value="cancelled"
                  >
                    Canceled
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0"></TabsContent>
                <TabsContent value="paid" className="mt-0"></TabsContent>
                <TabsContent value="cancelled" className="mt-0"></TabsContent>
              </Tabs>

              {/* Search and Filter Section */}
              <div className="px-6 mt-6 flex flex-col sm:flex-row gap-12 items-start sm:items-center justify-between">
                <div className="w-full">
                  <Search
                    placeholder="Search events"
                    value={searchQuery}
                    onSearchChange={setSearchQuery}
                    className="rounded-full"
                  />
                </div>

                <div className="flex gap-2 items-center">
                  {/* Status Filter Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 h-12"
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

              {/* Results Count */}
              <div className="px-6 mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredInvoices.length} of {invoiceData.length} invoices
                  {(selectedStatuses.length > 0 || searchQuery) &&
                    " (filtered)"}
                </p>
              </div>

              <DataTable<Invoice>
                data={filteredInvoices}
                fields={invoiceFields}
                actions={invoiceActions}
                enableSelection={true}
                enablePagination={true}
                pageSize={5}
                onRowClick={(invoice) => {
                  console.log("Invoice clicked:", invoice);
                }}
              />
            </div>
          </div>
        </div>
      </main>

       <InvoiceDetailsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        invoice={selectedInvoice}
      />
    </div>
  );
}