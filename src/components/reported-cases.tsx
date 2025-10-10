import { Badge } from "./ui/badge";

interface ReportedCase {
  id: string;
  title: string;
  status: "OPEN" | "INVESTIGATING" | "RESOLVED" | "CLOSED";
  description: string;
  event: string;
  reporter: string;
  reportedDate: string;
  reportedTime: string;
}

interface ReportedCasesProps {
  cases: ReportedCase[];
}

export function ReportedCases({ cases }: ReportedCasesProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-red-600/20 text-red-800 border-2 border-red-600";
      case "INVESTIGATING":
        return "bg-orange-600/20 text-orange-800 border-2 border-orange-600";
      case "RESOLVED":
        return "bg-green-600/20 text-green-800 border-2 border-green-600";
      case "CLOSED":
        return "bg-gray-600/20 text-gray-800 border-2 border-gray-600";
      default:
        return "bg-gray-600/20 text-gray-800 border-2 border-gray-600";
    }
  };

  return (
    <div className="space-y-4">
      {cases.map((caseItem) => (
        <div key={caseItem.id} className="border rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{caseItem.title}</h4>
              <Badge
              variant={"secondary"}
                className={`text-xs rounded-sm font-medium ${getStatusStyles(
                  caseItem.status
                )}`}
              >
                {caseItem.status}
              </Badge>
            </div>
            <span className="text-xs text-gray-500">
              {caseItem.reportedDate} {caseItem.reportedTime}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{caseItem.description}</p>
          <div className="text-xs text-gray-500">
            <span className="font-medium">Event:</span> {caseItem.event}
            <br />
            <span className="font-medium">Reporter:</span> {caseItem.reporter}
          </div>
        </div>
      ))}
    </div>
  );
}
