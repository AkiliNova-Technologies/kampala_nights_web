import type { Reservation, ReservationStatus, ReservationTab } from '@/types/reservation';
import { useState, useMemo } from 'react';
import Event1 from "@/assets/images/event1.png";
import Event2 from "@/assets/images/event2.png";
import Event3 from "@/assets/images/event3.png";


export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: 1,
      customer: "Nakato Gloria",
      phone: "+256 700 123 456",
      email: "gloria.n@email.com",
      event: "Saturday Night Fever - Kampala Edition",
      amount: 150000,
      dateTime: "Oct, 25, 2025 20:00",
      status: "attended",
      eventDate: "27, Oct, 2025",
      eventTime: "22:00",
      location: "Kololo, Kampala",
      image: Event1,
      table: "VIP-05",
      guests: 4,
      paymentMethod: "Mobile Money",
      reservationCreated: "2025-01-15 14:30",
      paymentReceived: "2025-01-15 14:35",
      checkedIn: "Oct, 25, 2025 at 19:45",
      eventAttended: "Oct, 25, 2025",
      eventDescription: "Join us for Kampala's ultimate weekend experience at Nightlife Central. Expect high-energy beats from top DJs, cocktails, and a stunning rooftop view of the city skyline.",
      checkInTime: "19:45",
      duration: "4 hours",
      specialRequests: "Birthday celebration - please prepare a cake"
    },
    {
      id: 2,
      customer: "Kato Brian",
      phone: "+256 700 234 567",
      email: "brian.k@email.com",
      event: "Wine & Rhymes Night",
      amount: 387000,
      dateTime: "Oct, 25, 2025 20:00",
      status: "paid",
      eventDate: "28, Oct, 2025",
      eventTime: "19:00",
      location: "Lugogo, Kampala",
      image: Event2,
      table: "Standard-12",
      guests: 2,
      paymentMethod: "Credit Card",
      reservationCreated: "2025-01-16 10:15",
      paymentReceived: "2025-01-16 10:20",
      eventDescription: "An evening of fine wines and poetry in the heart of Kampala.",
      duration: "3 hours",
      specialRequests: "Vegetarian meal preferences"
    },
    {
      id: 3,
      customer: "Nalubwama Sheila",
      phone: "+256 700 345 678",
      email: "sheila.n@email.com",
      event: "Amapiano Kasiki",
      amount: 500000,
      dateTime: "Oct, 29, 2025 22:00",
      status: "paid",
      eventDate: "29, Oct, 2025",
      eventTime: "22:00",
      location: "Kabalagala, Kampala",
      image: Event3,
      table: "VIP-08",
      guests: 6,
      paymentMethod: "Mobile Money",
      reservationCreated: "2025-01-17 16:45",
      paymentReceived: "2025-01-17 16:50",
      eventDescription: "Experience the best of Amapiano music with top DJs from across Africa.",
      duration: "5 hours",
      specialRequests: "Reserved parking for 2 vehicles"
    },
    {
      id: 4,
      customer: "Tumusilme Alex",
      phone: "+256 700 456 789",
      email: "alex.t@email.com",
      event: "Rooftop Sundowner",
      amount: 156000,
      dateTime: "Oct, 25, 2025 18:00",
      status: "cancelled",
      eventDate: "30, Oct, 2025",
      eventTime: "18:00",
      location: "City Center, Kampala",
      table: "Standard-15",
      guests: 3,
      paymentMethod: "Mobile Money",
      reservationCreated: "2025-01-18 09:30",
      paymentReceived: "2025-01-18 09:35",
      eventDescription: "Sunset drinks with panoramic city views and chill vibes.",
      cancellationReason: "Unexpected travel plans"
    },
    {
      id: 5,
      customer: "Mugisha David",
      phone: "+256 700 567 890",
      email: "david.m@email.com",
      event: "Nile Reggae Festival",
      amount: 275000,
      dateTime: "Nov, 01, 2025 16:00",
      status: "pending",
      eventDate: "01, Nov, 2025",
      eventTime: "16:00",
      location: "Jinja Road, Kampala",
      table: "VIP-03",
      guests: 5,
      paymentMethod: "Credit Card",
      reservationCreated: "2025-01-19 14:20",
      paymentReceived: "",
      eventDescription: "Annual reggae festival featuring local and international artists.",
      duration: "6 hours",
      specialRequests: "Backstage access requested"
    },
    {
      id: 6,
      customer: "Namukasa Jane",
      phone: "+256 700 678 901",
      email: "jane.n@email.com",
      event: "Karaoke Night",
      amount: 120000,
      dateTime: "Nov, 02, 2025 21:00",
      status: "attended",
      eventDate: "02, Nov, 2025",
      eventTime: "21:00",
      location: "Ntinda, Kampala",
      table: "Standard-08",
      guests: 4,
      paymentMethod: "Cash",
      reservationCreated: "2025-01-20 11:45",
      paymentReceived: "2025-01-20 11:50",
      checkedIn: "Nov, 02, 2025 at 20:30",
      eventAttended: "Nov, 02, 2025",
      eventDescription: "Weekly karaoke night with prizes for best performances.",
      checkInTime: "20:30",
      duration: "3 hours"
    },
    {
      id: 7,
      customer: "Ochieng Robert",
      phone: "+256 700 789 012",
      email: "robert.o@email.com",
      event: "Beer Festival",
      amount: 320000,
      dateTime: "Nov, 05, 2025 14:00",
      status: "paid",
      eventDate: "05, Nov, 2025",
      eventTime: "14:00",
      location: "Industrial Area, Kampala",
      table: "VIP-12",
      guests: 8,
      paymentMethod: "Mobile Money",
      reservationCreated: "2025-01-21 13:15",
      paymentReceived: "2025-01-21 13:20",
      eventDescription: "Celebration of local and international craft beers.",
      duration: "5 hours",
      specialRequests: "Gluten-free beer options required"
    },
    {
      id: 8,
      customer: "Akello Grace",
      phone: "+256 700 890 123",
      email: "grace.a@email.com",
      event: "Comedy Night",
      amount: 180000,
      dateTime: "Nov, 08, 2025 20:00",
      status: "cancelled",
      eventDate: "08, Nov, 2025",
      eventTime: "20:00",
      location: "Bukoto, Kampala",
      table: "Standard-20",
      guests: 2,
      paymentMethod: "Credit Card",
      reservationCreated: "2025-01-22 16:40",
      paymentReceived: "2025-01-22 16:45",
      eventDescription: "An evening of laughter with Uganda's top comedians.",
      cancellationReason: "Double booking - attending another event"
    }
  ]);

  // Filter reservations based on active tab and search
  const useFilteredReservations = (activeTab: ReservationTab, searchQuery: string, selectedStatuses: ReservationStatus[]) => {
    return useMemo(() => {
      let filtered = reservations;

      // Apply tab filter
      switch (activeTab) {
        case "attended":
          filtered = filtered.filter(reservation => reservation.status === "attended");
          break;
        case "paid":
          filtered = filtered.filter(reservation => reservation.status === "paid");
          break;
        case "cancelled":
          filtered = filtered.filter(reservation => reservation.status === "cancelled");
          break;
        case "pending":
          filtered = filtered.filter(reservation => reservation.status === "pending");
          break;
        case "all":
        default:
          // No additional filtering for "all" tab
          break;
      }

      // Apply status filter if any statuses are selected
      if (selectedStatuses.length > 0) {
        filtered = filtered.filter(reservation => 
          selectedStatuses.includes(reservation.status)
        );
      }

      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(
          reservation =>
            reservation.customer.toLowerCase().includes(query) ||
            reservation.event.toLowerCase().includes(query) ||
            reservation.phone.toLowerCase().includes(query) ||
            reservation.email.toLowerCase().includes(query)
        );
      }

      return filtered;
    }, [reservations, activeTab, selectedStatuses, searchQuery]);
  };

  // Get reservation by ID
  const getReservationById = (id: number) => {
    return reservations.find(reservation => reservation.id === id);
  };

  // Update reservation status
  const updateReservationStatus = (reservationId: number, status: ReservationStatus, cancellationReason?: string) => {
    setReservations(prev => prev.map(reservation => 
      reservation.id === reservationId 
        ? { 
            ...reservation, 
            status,
            ...(cancellationReason && { cancellationReason }),
            ...(status === "cancelled" && !reservation.cancellationReason && { 
              cancellationReason: "Cancelled by admin" 
            })
          }
        : reservation
    ));
  };

  // Delete reservation
  const deleteReservation = (reservationId: number) => {
    setReservations(prev => prev.filter(reservation => reservation.id !== reservationId));
  };

  // Add new reservation
  const addReservation = (reservation: Omit<Reservation, 'id'>) => {
    const newId = Math.max(...reservations.map(r => r.id)) + 1;
    const newReservation: Reservation = {
      ...reservation,
      id: newId,
      customer: '',
      phone: '',
      email: '',
      event: '',
      amount: 0,
      dateTime: '',
      status: 'attended'
    };
    setReservations(prev => [...prev, newReservation]);
  };

  // Get reservation statistics
  const getReservationStats = () => {
    const total = reservations.length;
    const attended = reservations.filter(r => r.status === 'attended').length;
    const paid = reservations.filter(r => r.status === 'paid').length;
    const cancelled = reservations.filter(r => r.status === 'cancelled').length;
    const pending = reservations.filter(r => r.status === 'pending').length;
    
    const totalRevenue = reservations
      .filter(r => r.status !== 'cancelled')
      .reduce((sum, r) => sum + r.amount, 0);

    return {
      total,
      attended,
      paid,
      cancelled,
      pending,
      totalRevenue,
      attendanceRate: total > 0 ? (attended / total) * 100 : 0
    };
  };

  return {
    reservations,
    useFilteredReservations,
    getReservationById,
    updateReservationStatus,
    deleteReservation,
    addReservation,
    getReservationStats
  };
}