// In your CapacityPricing component, update the interface and usage:
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Banknote, PlusIcon, Trash2Icon } from "lucide-react";

interface Ticket {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CapacityPricingProps {
  formData: {
    maxAttendees: number;
    isPaidEvent: boolean;
    tickets: Ticket[];
  };
  onFormChange: (updates: {
    maxAttendees?: number;
    isPaidEvent?: boolean;
    tickets?: Ticket[];
  }) => void;
  disabled?: boolean; // Changed from disable to disabled
}

const CapacityPricing: React.FC<CapacityPricingProps> = ({ 
  formData, 
  onFormChange,
  disabled = false 
}) => {
  const { maxAttendees, isPaidEvent, tickets } = formData;

  const addNewTicket = () => {
    if (disabled) return;
    
    const newTicket: Ticket = {
      id: Date.now().toString(),
      name: "New Ticket",
      price: 0,
      quantity: 0,
    };
    onFormChange({
      tickets: [...tickets, newTicket]
    });
  };

  const updateTicket = (id: string, field: keyof Ticket, value: string | number) => {
    if (disabled) return;
    
    const updatedTickets = tickets.map((ticket) =>
      ticket.id === id ? { ...ticket, [field]: value } : ticket
    );
    onFormChange({ tickets: updatedTickets });
  };

  const deleteTicket = (id: string) => {
    if (disabled) return;
    
    if (tickets.length > 1) {
      const updatedTickets = tickets.filter((ticket) => ticket.id !== id);
      onFormChange({ tickets: updatedTickets });
    }
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

      {/* Maximum Attendees Section */}
      <div className="mb-8">
        <div className="space-y-2">
          <Label htmlFor="max-attendees" className="text-lg font-semibold mb-4">
            Maximum Attendees
          </Label>
          <Input
            id="max-attendees"
            type="number"
            value={maxAttendees}
            onChange={(e) => onFormChange({ maxAttendees: Number(e.target.value) })}
            className="h-11"
            min="1"
            disabled={disabled}
          />
        </div>

        <div className="space-y-2 mt-5">
          <div className="flex items-center space-x-2">
            <Switch
              checked={isPaidEvent}
              onCheckedChange={(checked) => onFormChange({ isPaidEvent: checked })}
              id="paid-event"
              disabled={disabled}
            />
            <Label htmlFor="paid-event">This is a paid event</Label>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-6 border-border" />

      {/* Tickets Section */}
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
            <PlusIcon />
            Custom Event Ticket
          </Button>
        </div>

        {/* Tickets Table */}
        <div className="mb-6 border-1 rounded-lg">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted rounded-t-lg border-border">
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
                  onChange={(e) => updateTicket(ticket.id, "name", e.target.value)}
                  className="h-11 focus-visible:ring-1"
                  placeholder="Ticket name"
                  disabled={disabled}
                />
              </div>

              {/* Price */}
              <div className="col-span-3">
                <Input
                  type="number"
                  value={ticket.price}
                  onChange={(e) => updateTicket(ticket.id, "price", Number(e.target.value))}
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
                    value={ticket.quantity}
                    onChange={(e) => updateTicket(ticket.id, "quantity", Number(e.target.value))}
                    className="h-11 focus-visible:ring-1"
                    placeholder="0"
                    min="0"
                    disabled={disabled}
                  />
                  <Button
                    type="button"
                    variant={"secondary"}
                    className="h-10 w-10 ml-4 flex items-center justify-center bg-[#FDE9ED] hover:bg-[#FDE9ED]/80 rounded-sm"
                    onClick={() => deleteTicket(ticket.id)}
                    disabled={disabled || tickets.length === 1}
                  >
                    <Trash2Icon className="text-[#AD153A] size-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CapacityPricing;