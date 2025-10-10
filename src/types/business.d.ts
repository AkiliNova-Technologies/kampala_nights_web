export interface Business {
  id: string;
  business: string;
  owner: string;
  registrationDate: string;
  status: "pending" | "approved" | "cancelled" | "suspended";
  address?: string;
  image?: string;
  [key: string]: unknown;
}

export interface BusinessAccount {
  id: string;
  companyName: string;
  businessType: string;
  phone: string;
  address: string;
  isVerified: boolean;
  verifiedAt: string | null;
}

export interface BusinessUser {
  id: string;
  userType: "BUSINESS_ACCOUNT";
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  isActive: boolean;
  businessAccount: BusinessAccount;
  venueCount: number;
  totalBookings: number;
  isVerified: boolean;
}