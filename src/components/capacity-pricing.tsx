import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Banknote, PlusIcon, Ticket, Trash2Icon, AlertCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Ticket {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface GroupPricing {
  group1_3: number;
  group4_6: number;
  group7_10: number;
}

interface CapacityPricingProps {
  formData: {
    maxAttendees: number;
    isPaidEvent: boolean;
    tickets: Ticket[];
    groupPricing: GroupPricing;
  };
  onFormChange: (updates: {
    maxAttendees?: number;
    isPaidEvent?: boolean;
    tickets?: Ticket[];
    groupPricing?: GroupPricing;
  }) => void;
  disabled?: boolean;
}

const CapacityPricing: React.FC<CapacityPricingProps> = ({
  formData,
  onFormChange,
  disabled = false,
}) => {
  const { maxAttendees, isPaidEvent, tickets, groupPricing } = formData;

  // Calculate total ticket quantity
  const totalTicketQuantity = tickets.reduce((total, ticket) => total + (ticket.quantity || 0), 0);

  // Check if total quantity exceeds max attendees
  const exceedsMaxAttendees = totalTicketQuantity > maxAttendees;

  // Calculate remaining capacity
  const remainingCapacity = maxAttendees - totalTicketQuantity;

  const addNewTicket = () => {
    if (disabled) return;

    const newTicket: Ticket = {
      id: Date.now().toString(),
      name: "New Ticket",
      price: 0,
      quantity: 0,
    };
    onFormChange({
      tickets: [...tickets, newTicket],
    });
  };

  const updateTicket = (
    id: string,
    field: keyof Ticket,
    value: string | number
  ) => {
    if (disabled) return;

    // If updating quantity, validate against max attendees
    if (field === "quantity") {
      const numericValue = typeof value === "number" ? value : Number(value);
      
      // Calculate what the new total would be
      const currentTotal = totalTicketQuantity;
      const currentTicket = tickets.find(ticket => ticket.id === id);
      const currentTicketQuantity = currentTicket?.quantity || 0;
      const newTotal = currentTotal - currentTicketQuantity + numericValue;

      // If new total exceeds max attendees, limit the value
      if (newTotal > maxAttendees) {
        const maxAllowed = numericValue - (newTotal - maxAttendees);
        value = Math.max(0, maxAllowed);
        
        // Show warning in console (you could also show a toast here)
        console.warn(`Total ticket quantity cannot exceed maximum reservations (${maxAttendees}). Adjusted quantity to ${value}.`);
      }
    }

    const updatedTickets = tickets.map((ticket) =>
      ticket.id === id ? { ...ticket, [field]: value } : ticket
    );
    onFormChange({ tickets: updatedTickets });
  };

  const deleteTicket = (id: string) => {
    if (disabled) return;

    if (tickets.length > 0) {
      const updatedTickets = tickets.filter((ticket) => ticket.id !== id);
      onFormChange({ tickets: updatedTickets });
    }
  };

  const updateGroupPricing = (group: keyof GroupPricing, value: string) => {
    if (disabled) return;

    // Handle empty string case properly
    const numericValue = value === "" ? 0 : Number(value);
    onFormChange({
      groupPricing: {
        ...groupPricing,
        [group]: numericValue,
      },
    });
  };

  // Handle number input changes with proper empty value handling
  const handleNumberChange = (
    value: string,
    callback: (value: number) => void
  ) => {
    // Allow empty string, otherwise convert to number
    if (value === "") {
      callback(0);
    } else {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        callback(numValue);
      }
    }
  };

  // Handle ticket quantity change with validation
  const handleTicketQuantityChange = (ticketId: string, value: string) => {
    if (disabled) return;

    const numericValue = value === "" ? 0 : Number(value);
    
    // Calculate what the new total would be
    const currentTotal = totalTicketQuantity;
    const currentTicket = tickets.find(ticket => ticket.id === ticketId);
    const currentTicketQuantity = currentTicket?.quantity || 0;
    const newTotal = currentTotal - currentTicketQuantity + numericValue;

    // If new total exceeds max attendees, limit the value
    let finalValue = numericValue;
    if (newTotal > maxAttendees) {
      const maxAllowed = numericValue - (newTotal - maxAttendees);
      finalValue = Math.max(0, maxAllowed);
    }

    updateTicket(ticketId, "quantity", finalValue);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-row items-center gap-4 mb-6">
        <div className="h-8 w-8 bg-[#E6F6ED] rounded-sm flex flex-col items-center justify-center">
          <Banknote className="text-[#038B31]" />
        </div>
        <h2 className="text-xl font-semibold">Capacity & Pricing</h2>
      </div>

      {/* Free/Paid Event Radio Group */}
      <div className="mb-6">
        <RadioGroup
          value={isPaidEvent ? "paid" : "free"}
          onValueChange={(value) =>
            onFormChange({ isPaidEvent: value === "paid" })
          }
          className="flex gap-6"
          disabled={disabled}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="free" id="free-event" />
            <Label
              htmlFor="free-event"
              className="text-base font-normal cursor-pointer"
            >
              Free event
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="paid" id="paid-event" />
            <Label
              htmlFor="paid-event"
              className="text-base font-normal cursor-pointer"
            >
              Paid event
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Maximum Reservations Section */}
      <div className="mb-8">
        <Label
          htmlFor="max-attendees"
          className="text-lg font-semibold mb-4 block"
        >
          Maximum Reservations
        </Label>
        <div className="space-y-2">
          <Input
            id="max-attendees"
            type="number"
            value={maxAttendees || ""}
            onChange={(e) =>
              handleNumberChange(e.target.value, (value) =>
                onFormChange({ maxAttendees: value })
              )
            }
            className="h-11"
            min="1"
            placeholder="Enter maximum capacity"
            disabled={disabled}
          />
        </div>
        
        {/* Capacity Summary */}
        {isPaidEvent && tickets.length > 0 && (
          <div className="mt-3 text-sm text-muted-foreground">
            <p>
              Total tickets: {totalTicketQuantity} / {maxAttendees} 
              {remainingCapacity >= 0 ? (
                <span className="text-green-600 ml-2">
                  ({remainingCapacity} remaining)
                </span>
              ) : (
                <span className="text-red-600 ml-2">
                  (Exceeds by {Math.abs(remainingCapacity)})
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Validation Alert */}
      {exceedsMaxAttendees && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Total ticket quantity ({totalTicketQuantity}) exceeds maximum reservations ({maxAttendees}). 
            Please reduce ticket quantities to stay within the limit.
          </AlertDescription>
        </Alert>
      )}

      {/* Divider */}
      <hr className="my-6 border-border" />

      {/* Free Event - Group Pricing Table */}
      {!isPaidEvent && (
        <div className="mb-6">
          <div className="border border-border rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-3 bg-muted">
              <div className="px-4 py-3 border-r border-border">
                <span className="text-sm font-medium">
                  Number of People 1-3
                </span>
              </div>
              <div className="px-4 py-3 border-r border-border">
                <span className="text-sm font-medium">
                  Number of People 4-6
                </span>
              </div>
              <div className="px-4 py-3">
                <span className="text-sm font-medium">
                  Number of People 7-10
                </span>
              </div>
            </div>

            {/* Table Body - Editable Inputs */}
            <div className="grid grid-cols-3">
              <div className="px-4 py-3 border-r border-border">
                <Input
                  type="number"
                  value={groupPricing.group1_3 || ""}
                  onChange={(e) =>
                    updateGroupPricing("group1_3", e.target.value)
                  }
                  className="h-11 focus-visible:ring-1 border-0 shadow-none focus-visible:ring-offset-0"
                  placeholder="0"
                  min="0"
                  disabled={disabled}
                />
              </div>
              <div className="px-4 py-3 border-r border-border">
                <Input
                  type="number"
                  value={groupPricing.group4_6 || ""}
                  onChange={(e) =>
                    updateGroupPricing("group4_6", e.target.value)
                  }
                  className="h-11 focus-visible:ring-1 border-0 shadow-none focus-visible:ring-offset-0"
                  placeholder="0"
                  min="0"
                  disabled={disabled}
                />
              </div>
              <div className="px-4 py-3">
                <Input
                  type="number"
                  value={groupPricing.group7_10 || ""}
                  onChange={(e) =>
                    updateGroupPricing("group7_10", e.target.value)
                  }
                  className="h-11 focus-visible:ring-1 border-0 shadow-none focus-visible:ring-offset-0"
                  placeholder="0"
                  min="0"
                  disabled={disabled}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Paid Event - Ticket System */}
      {isPaidEvent && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-row items-center gap-4">
              <div className="h-8 w-8 bg-[#E6F6ED] rounded-sm flex flex-col items-center justify-center">
                <Banknote className="text-[#038B31]" />
              </div>
              <h3 className="text-lg font-semibold">Your Tickets</h3>
            </div>
            <Button
              onClick={addNewTicket}
              variant="secondary"
              className="h-11 bg-[#5041D0] hover:bg-[#5041D0]/80 text-white"
              disabled={disabled}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Custom Event Ticket
            </Button>
          </div>

          {/* Fallback when no tickets exist */}
          {tickets.length === 0 ? (
            <div className="mb-6 border border-border rounded-lg overflow-hidden">
              <div className="flex flex-col items-center justify-center py-6 px-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Ticket className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-6 max-w-md">
                  No tickets added yet. Use the create event to have a custom
                  ticket.
                </p>
              </div>
            </div>
          ) : (
            <div className="mb-6 border border-border rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted border-b border-border">
                <div className="col-span-5">
                  <span className="text-sm font-medium">Ticket Name</span>
                </div>
                <div className="col-span-3">
                  <span className="text-sm font-medium">Price - UGX</span>
                </div>
                <div className="col-span-4">
                  <span className="text-sm font-medium">Quantity</span>
                </div>
              </div>

              {/* Ticket Rows */}
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-border last:border-b-0"
                >
                  {/* Ticket Name */}
                  <div className="col-span-5">
                    <Input
                      value={ticket.name}
                      onChange={(e) =>
                        updateTicket(ticket.id, "name", e.target.value)
                      }
                      className="h-11 focus-visible:ring-1"
                      placeholder="Ticket name"
                      disabled={disabled}
                    />
                  </div>

                  {/* Price */}
                  <div className="col-span-3">
                    <Input
                      type="number"
                      value={ticket.price || ""}
                      onChange={(e) =>
                        handleNumberChange(e.target.value, (value) =>
                          updateTicket(ticket.id, "price", value)
                        )
                      }
                      className="h-11 focus-visible:ring-1"
                      placeholder="0"
                      min="0"
                      disabled={disabled}
                    />
                  </div>

                  {/* Quantity */}
                  <div className="col-span-4">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={ticket.quantity || ""}
                        onChange={(e) =>
                          handleTicketQuantityChange(ticket.id, e.target.value)
                        }
                        className={`h-11 focus-visible:ring-1 ${
                          exceedsMaxAttendees ? "border-red-500 focus-visible:ring-red-500" : ""
                        }`}
                        placeholder="0"
                        min="0"
                        max={maxAttendees - (totalTicketQuantity - ticket.quantity)}
                        disabled={disabled}
                      />
                      <Button
                        type="button"
                        variant={"secondary"}
                        className="h-10 w-10 ml-4 flex items-center justify-center bg-[#FDE9ED] hover:bg-[#FDE9ED]/80 rounded-sm"
                        onClick={() => deleteTicket(ticket.id)}
                        disabled={disabled}
                      >
                        <Trash2Icon className="text-[#AD153A] size-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CapacityPricing;