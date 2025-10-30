// src/pages/business/Calendar.tsx
import { SiteHeader } from "@/components/site-header";
import { Calendar } from "@/components/ui/calendar";
import { useCalendarEvents } from "@/hooks/useReduxCalendarEvents";
import { useEffect } from "react";

export function CalendarPage() {
  const { calendarEvents, refetch } =
    useCalendarEvents("business");

  // Optional: Refetch events on component mount
  useEffect(() => {
    refetch({
      page: 1,
      limit: 100,
      forceRefresh: false,
    });
  }, [refetch]);

  // Handle empty state
  // if (!calendarEvents || calendarEvents.length === 0) {
  //   return (
  //     <div className="min-h-screen">
  //       <SiteHeader />
  //       <main className="flex-1">
  //         <div className="space-y-6 p-6">
  //           <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
  //             <div className="flex flex-col items-center justify-center h-64 gap-4">
  //               <p className="text-muted-foreground text-center">No events found</p>
  //               <button
  //                 onClick={() => refetch({ forceRefresh: true })}
  //                 className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
  //               >
  //                 Refresh Events
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       </main>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <div className="space-y-6 p-6">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <Calendar
              events={calendarEvents}
              onEventCreate={(event) => console.log("Created:", event)}
              onEventUpdate={(id, event) => console.log("Updated:", id, event)}
              onEventDelete={(id) => console.log("Deleted:", id)}
              categories={[
                "Meeting",
                "Task",
                "Reminder",
                "Personal",
                "Party",
                "Music",
                "VIP",
                "Art",
                "Social",
                "Conference",
                "Workshop",
                "General",
              ]}
              availableTags={[
                "Important",
                "Urgent",
                "Work",
                "Personal",
                "Team",
                "Client",
                "Approved",
                "Pending",
                "Rejected",
                "Paid",
                "Free",
                "High Demand",
                "Almost Full",
                "Reservations",
                "Live",
                "Completed",
              ]}
              defaultView="month"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
