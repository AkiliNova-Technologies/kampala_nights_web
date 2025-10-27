import { DataTable } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";
import { SectionCards, type CardData } from "@/components/section-cards";
import { useState, useMemo, useCallback } from "react";
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
import {
  FilterIcon,
  EyeIcon,
  TriangleAlert,
  Clock3,
  CircleCheckBig,
  ReceiptText,
  UserPlus,
  XIcon,
} from "lucide-react";
import type { ReportedCase, CaseStatus } from "@/types/reported-case";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReportedCaseDialog } from "@/components/reported-case-dialog";

type HelpdeskTab = "all" | "open" | "in_progress" | "resolved";

// Mock data for dashboard users
const dashboardUsers = [
  { id: "1", name: "Rhodah Nakato", email: "rhodah@example.com" },
  { id: "2", name: "Comfort Karungi", email: "comfort@example.com" },
  { id: "3", name: "Patience Akunda", email: "patience@example.com" },
  { id: "4", name: "John Smith", email: "john@example.com" },
  { id: "5", name: "Sarah Johnson", email: "sarah@example.com" },
];

export function ReportedCasesPage() {
  const [activeTab, setActiveTab] = useState<HelpdeskTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<CaseStatus[]>([]);
  const [selectedCase, setSelectedCase] = useState<ReportedCase | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [loading] = useState(false);
  const [selectedCases, setSelectedCases] = useState<ReportedCase[]>([]);

  const [cases, setCases] = useState<ReportedCase[]>([
    {
      id: "1",
      caseNumber: "TKT-001",
      user: "Jessica Nolubega",
      subject: "Harassment report from user",
      business: "Nightlife Central",
      status: "in_progress",
      createdAt: "2025-10-15",
      updatedAt: "2025-10-16",
      priority: "high",
      assignedTo: "Rhodah Nakato",
      type: "Harassment",
      description: "Harassment report from user by Jessica Nolubega",
    },
    {
      id: "2",
      caseNumber: "TKT-002",
      user: "Marcus Ntombi",
      subject: "Safety violation in parking area",
      business: "Cat Walk",
      status: "resolved",
      createdAt: "2025-10-15",
      updatedAt: "2025-10-15",
      priority: "medium",
      assignedTo: "",
      type: "Unsafe Conditions",
      description: "Safety violation in parking area by Marcus Ntombi",
    },
    {
      id: "3",
      caseNumber: "TKT-003",
      user: "Lisa Rufh",
      subject: "Safety violation in bar",
      business: "Sky Club Kampala",
      status: "resolved",
      createdAt: "2025-10-25",
      updatedAt: "2025-10-25",
      priority: "medium",
      assignedTo: "Comfort Karungi",
      type: "Physical Altercation",
      description: "Safety violation in bar by Lisa Rufh",
    },
    {
      id: "4",
      caseNumber: "TKT-004",
      user: "Amanda Karungi",
      subject: "Lost personal property",
      business: "Illusion",
      status: "open",
      createdAt: "2025-10-28",
      updatedAt: "2025-10-28",
      priority: "high",
      assignedTo: "Patience Akunda",
      type: "Theft",
      description: "Lost personal property by Amanda Karungi",
    },
    {
      id: "5",
      caseNumber: "TKT-005",
      user: "Winnie Mossazi",
      subject: "Raped by the Manager",
      business: "Elite Events Co.",
      status: "pending",
      createdAt: "2025-10-28",
      updatedAt: "2025-10-28",
      priority: "high",
      assignedTo: "",
      type: "Harassment",
      description: "Raped by the Manager by Winnie Mossazi",
    },
  ]);

  // Calculate statistics
  const totalCases = cases.length;
  const openCases = cases.filter((c) => c.status === "open").length;
  const inProgressCases = cases.filter(
    (c) => c.status === "in_progress"
  ).length;
  const resolvedToday = 42;

  // Card data
  const helpdeskCards: CardData[] = useMemo(
    () => [
      {
        title: "Open Cases",
        value: openCases.toString(),
        change: {
          description: "Awaiting response",
        },
        rightIcon: <TriangleAlert className="h-4 w-4" />,
        iconBgColor: "bg-[#92400E]",
      },
      {
        title: "In Progress",
        value: inProgressCases.toString(),
        change: {
          description: "Being worked on",
        },
        rightIcon: <Clock3 className="h-4 w-4" />,
        iconBgColor: "bg-[#1E40AF]",
      },
      {
        title: "Resolved Today",
        value: resolvedToday.toString(),
        change: {
          trend: "up" as const,
          value: "18%",
          description: "from yesterday",
        },
        rightIcon: <CircleCheckBig className="h-4 w-4" />,
        iconBgColor: "bg-[#065F46]",
      },
      {
        title: "Total Cases",
        value: totalCases.toString(),
        change: {
          description: "All time",
        },
        rightIcon: <ReceiptText className="h-4 w-4" />,
        iconBgColor: "bg-[#38119F]",
      },
    ],
    [openCases, inProgressCases, resolvedToday, totalCases]
  );

  // Status options for filter
  const statusOptions: { value: CaseStatus; label: string }[] = [
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "pending", label: "Pending" },
  ];

  // Filter cases based on active tab, search query, and selected statuses
  const filteredCases = useMemo(() => {
    let filtered = cases;

    // Apply tab filter
    switch (activeTab) {
      case "open":
        filtered = filtered.filter(
          (reportedCase) => reportedCase.status === "open"
        );
        break;
      case "in_progress":
        filtered = filtered.filter(
          (reportedCase) => reportedCase.status === "in_progress"
        );
        break;
      case "resolved":
        filtered = filtered.filter(
          (reportedCase) => reportedCase.status === "resolved"
        );
        break;
      case "all":
      default:
        // No additional filtering for "all" tab
        break;
    }

    // Apply status filter if any statuses are selected
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((reportedCase) =>
        selectedStatuses.includes(reportedCase.status)
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (reportedCase) =>
          reportedCase.caseNumber.toLowerCase().includes(query) ||
          reportedCase.user.toLowerCase().includes(query) ||
          reportedCase.subject.toLowerCase().includes(query) ||
          reportedCase.business.toLowerCase().includes(query) ||
          (reportedCase.type &&
            reportedCase.type.toLowerCase().includes(query)) ||
          (reportedCase.assignedTo &&
            reportedCase.assignedTo.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [cases, activeTab, selectedStatuses, searchQuery]);

  const handleStatusFilterChange = useCallback((status: CaseStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedStatuses([]);
    setSearchQuery("");
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, []);

  // Handle assignment dialog opening
  const handleAssignCasesClick = useCallback(() => {
    if (selectedCases.length > 0) {
      setAssignmentDialogOpen(true);
    }
  }, [selectedCases.length]);

  // Handle assignment submission for multiple cases
  const handleAssignSubmit = useCallback(() => {
    if (selectedCases.length > 0 && selectedUserId) {
      const selectedUser = dashboardUsers.find(
        (user) => user.id === selectedUserId
      );
      if (selectedUser) {
        setCases((prevCases) =>
          prevCases.map((reportedCase) =>
            selectedCases.some((selected) => selected.id === reportedCase.id)
              ? { ...reportedCase, assignedTo: selectedUser.name }
              : reportedCase
          )
        );
      }
      setAssignmentDialogOpen(false);
      setSelectedUserId("");
      setSelectedCases([]); // Clear selection after assignment
    }
  }, [selectedCases, selectedUserId]);

  // Handle case selection
  const handleCaseSelection = useCallback((cases: ReportedCase[]) => {
    setSelectedCases(cases);
  }, []);

  // Handle row click to view details
  const handleRowClick = useCallback((row: ReportedCase) => {
    setSelectedCase(row);
    setIsDialogOpen(true);
  }, []);

  const caseFields = useMemo(
    () => [
      {
        key: "caseNumber",
        header: "Case ID",
        enableHiding: false,
        cell: (value: unknown, row: ReportedCase) => (
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="font-medium text-sm">{String(value)}</span>
              <span className="text-xs text-muted-foreground">
                {formatDate(row.createdAt)}
              </span>
            </div>
          </div>
        ),
      },
      {
        key: "subject",
        header: "Title & Reporter",
        cell: (value: unknown, row: ReportedCase) => (
          <div className="flex flex-col">
            <span className="font-medium">{String(value)}</span>
            <span className="text-xs text-muted-foreground">by {row.user}</span>
          </div>
        ),
      },
      {
        key: "type",
        header: "Type",
        cell: (value: unknown) => (
          <span className="font-medium">{String(value)}</span>
        ),
      },
      {
        key: "status",
        header: "Status",
        cell: (value: unknown) => {
          const status = value as CaseStatus;
          const statusConfig = {
            open: {
              label: "Open",
              dotColor: "bg-red-500",
              textColor: "text-red-700",
              bgColor: "bg-red-50",
            },
            in_progress: {
              label: "In Progress",
              dotColor: "bg-yellow-500",
              textColor: "text-yellow-700",
              bgColor: "bg-yellow-50",
            },
            resolved: {
              label: "Resolved",
              dotColor: "bg-green-500",
              textColor: "text-green-700",
              bgColor: "bg-green-50",
            },
            pending: {
              label: "Pending",
              dotColor: "bg-blue-500",
              textColor: "text-blue-700",
              bgColor: "bg-blue-50",
            },
          };

          const config = statusConfig[status] || statusConfig.open;

          return (
            <Badge
              variant="secondary"
              className={`flex flex-row items-center w-28 gap-2 ${config.bgColor} ${config.textColor}`}
            >
              <div className={`size-2 rounded-full ${config.dotColor}`} />
              {config.label}
            </Badge>
          );
        },
        align: "center" as const,
      },
      {
        key: "assignedTo",
        header: "Assigned To",
        cell: (value: unknown) => {
          const assignedTo = value as string;
          return (
            <div className="flex items-center gap-2">
              <span
                className={`font-medium ${
                  !assignedTo ? "text-muted-foreground" : ""
                }`}
              >
                {assignedTo || "Not Assigned Yet"}
              </span>
            </div>
          );
        },
      },
    ],
    [formatDate]
  );

  const caseActions = useMemo(
    () => [
      {
        type: "view" as const,
        label: "View Details",
        icon: <EyeIcon className="size-5" />,
        onClick: (row: ReportedCase) => {
          setSelectedCase(row);
          setIsDialogOpen(true);
        },
      },
    ],
    []
  );

  const handleStatusChange = useCallback(
    (reportedCase: ReportedCase, newStatus: CaseStatus) => {
      console.log(
        `Changing status of ${reportedCase.caseNumber} to ${newStatus}`
      );
      setCases((prevCases) =>
        prevCases.map((c) =>
          c.id === reportedCase.id ? { ...c, status: newStatus } : c
        )
      );
    },
    []
  );

  const handleSendReply = useCallback(
    (reportedCase: ReportedCase, response: string) => {
      console.log(`Sending reply to ${reportedCase.caseNumber}:`, response);
      // Implement your reply sending logic here
    },
    []
  );

  return (
    <div className="min-h-screen">
      <SiteHeader label="Reported Cases" />
      <main className="flex-1">
        <div className="space-y-6 p-6">
          <SectionCards cards={helpdeskCards} layout="1x4" />

          <div className="space-y-6">
            <div className="rounded-lg border bg-card py-6 mb-6">
              <div className="items-center px-6 mb-4">
                <h2 className="text-2xl font-bold mb-3">Cases Overview</h2>
                <p className="text-muted-foreground">
                  Manage customer support requests and safety reports from
                  mobile app.
                </p>
              </div>

              {/* Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as HelpdeskTab)}
                className="w-full px-6 bg-transparent rounded-none"
              >
                <TabsList className="grid w-full h-11 grid-cols-4 rounded-none p-0 bg-transparent border-b">
                  <TabsTrigger
                    className="bg-transparent h-11 border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                    value="all"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    className="bg-transparent h-11 border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                    value="open"
                  >
                    Open
                  </TabsTrigger>
                  <TabsTrigger
                    className="bg-transparent h-11 border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                    value="in_progress"
                  >
                    In Progress
                  </TabsTrigger>
                  <TabsTrigger
                    className="bg-transparent h-11 border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                    value="resolved"
                  >
                    Resolved
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Search and Filter Section */}
              <div className="px-6 mt-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="w-full flex-1">
                  <Search
                    placeholder="Search cases, report type..."
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

                  {/* Assign Cases Button */}
                  <Button
                    variant="secondary"
                    onClick={handleAssignCasesClick}
                    disabled={selectedCases.length === 0}
                    className="h-12 bg-[#5014D0] hover:bg-[#5014D0]/90 text-white flex items-center gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Assign Cases ({selectedCases.length})
                  </Button>
                </div>
              </div>

              {/* Selection Info */}
              {selectedCases.length > 0 && (
                <div className="px-6 mt-4">
                  <p className="text-sm text-muted-foreground">
                    {selectedCases.length} case(s) selected for assignment
                  </p>
                </div>
              )}

              <div className="px-6">
                <DataTable
                  data={filteredCases}
                  fields={caseFields}
                  actions={caseActions}
                  enableSelection={true}
                  enablePagination={true}
                  pageSize={10}
                  loading={loading}
                  onSelectionChange={handleCaseSelection}
                  onRowClick={handleRowClick}
                />
              </div>
            </div>
          </div>

          {/* Assignment Dialog */}
          <Dialog
            open={assignmentDialogOpen}
            onOpenChange={setAssignmentDialogOpen}
          >
            <DialogContent className="min-w-3xl max-w-4xl p-0">
              <DialogHeader className="bg-gradient-to-r from-[#5014D0] to-[#38119F] text-white p-6 rounded-t-lg">
                <DialogTitle className="flex items-center justify-between text-white">
                  <div>
                    <h3 className="mb-2">ASSIGN TO</h3>
                    <p className="text-sm">Assign selected cases to staff</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setAssignmentDialogOpen(false)}
                    className="h-8 w-8 hover:bg-white/20 text-white hover:text-white"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 p-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Assigning <strong>{selectedCases.length}</strong> case(s)
                    to:
                  </p>
                  <Select
                    value={selectedUserId}
                    onValueChange={setSelectedUserId}
                  >
                    <SelectTrigger className="w-full min-h-11">
                      <SelectValue placeholder="Select a user to assign" />
                    </SelectTrigger>
                    <SelectContent>
                      {dashboardUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Selected Cases Preview */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Selected Cases:</h4>
                  <div className="max-h-32 overflow-y-auto">
                    {selectedCases.map((reportedCase) => (
                      <div
                        key={reportedCase.id}
                        className="text-sm py-1 border-b last:border-b-0"
                      >
                        <span className="font-medium">
                          {reportedCase.caseNumber}
                        </span>{" "}
                        - {reportedCase.subject}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter className="p-6">
                <Button
                  variant="outline"
                  onClick={() => setAssignmentDialogOpen(false)}
                  className="w-full flex-1 h-11"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAssignSubmit}
                  disabled={!selectedUserId}
                  className="text-white bg-[#5014D0] hover:bg-[#5014D0]/90 w-full flex-1 h-11"
                >
                  Assign {selectedCases.length} Case(s)
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <ReportedCaseDialog
            case={selectedCase}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSendReply={handleSendReply}
            onStatusChange={handleStatusChange}
          />
        </div>
      </main>
    </div>
  );
}
