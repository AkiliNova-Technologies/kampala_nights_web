import { useState } from "react";
import type { Profile } from "@/types/profile";
import dj1 from "@/assets/images/dj1.jpg";
import dj2 from "@/assets/images/dj2.jpg";
import dj3 from "@/assets/images/dj3.jpg";
import dj4 from "@/assets/images/dj4.jpg";
import dj5 from "@/assets/images/dj5.jpg";
import dj6 from "@/assets/images/dj6.jpg";
import tonight1 from "@/assets/images/tonight1.jpg";
import tonight2 from "@/assets/images/tonight2.jpg";
import tonight3 from "@/assets/images/tonight3.jpg";
import tonight4 from "@/assets/images/tonight4.jpg";
import tonight5 from "@/assets/images/tonight5.jpg";
import tonight6 from "@/assets/images/tonight6.jpg";


export function useDJProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([
    {
      id: "1",
      name: "John Seggawa",
      username: "@robexdj",
      genre: "Amapiano",
      status: "active",
      visibility: "public",
      socialProfiles: {
        instagram: "instagram.com/robexdj",
        soundcloud: "soundcloud.com/robexdj"
      },
      location: "Kampala",
      eventsPlayed: 45,
      rating: 4.8,
      followers: 12500,
      profileImage: dj1,
      backgroundImage: "/api/placeholder/400/300",
      bio: "Award-winning Amapiano DJ with over 5 years of experience. Known for energetic performances and unique mixes that keep the dance floor packed all night.",
      lastActive: "2024-01-15T18:30:00.000Z",
      createdAt: "2023-05-10T10:00:00.000Z",
      updatedAt: "2024-01-15T18:30:00.000Z",
      playingTonight: [tonight1, tonight2],
      pastEventListings: [tonight1, tonight2, tonight3],
    },
    {
      id: "2",
      name: "Amapiano Beats",
      username: "@mysticbeats",
      genre: "Amapiano",
      status: "active",
      visibility: "public",
      socialProfiles: {
        instagram: "instagram.com/mysticbeats",
        facebook: "facebook.com/mysticbeats"
      },
      location: "Entebbe",
      eventsPlayed: 32,
      rating: 4.6,
      followers: 8900,
      profileImage: dj2,
      backgroundImage: "/api/placeholder/400/300",
      bio: "Specializing in deep Amapiano and Afro-house mixes. Bringing soulful vibes to every event with smooth transitions and crowd-pleasing selections.",
      lastActive: "2024-01-14T22:15:00.000Z",
      createdAt: "2023-08-15T14:20:00.000Z",
      updatedAt: "2024-01-14T22:15:00.000Z",
      playingTonight: [tonight3, tonight4],
      pastEventListings: [tonight4, tonight5],
    },
    {
      id: "3",
      name: "Al Satus",
      username: "@craigdj",
      genre: "House",
      status: "active",
      visibility: "public",
      socialProfiles: {
        instagram: "instagram.com/craigdj",
        twitter: "twitter.com/craigdj"
      },
      location: "Kampala",
      eventsPlayed: 28,
      rating: 4.7,
      followers: 10200,
      profileImage: dj3,
      backgroundImage: "/api/placeholder/400/300",
      bio: "Deep house and tech house specialist. Creating immersive musical journeys that transport audiences to another dimension.",
      lastActive: "2024-01-13T23:45:00.000Z",
      createdAt: "2023-11-20T09:15:00.000Z",
      updatedAt: "2024-01-13T23:45:00.000Z",
      playingTonight: [tonight5],
      pastEventListings: [tonight6, tonight1, tonight2],
    },
    {
      id: "4",
      name: "Kronpital Vibes",
      username: "@kronpitalvibes",
      genre: "Techno",
      status: "active",
      visibility: "public",
      socialProfiles: {
        instagram: "instagram.com/kronpitalvibes",
        youtube: "youtube.com/kronpitalvibes"
      },
      location: "Jinja",
      eventsPlayed: 51,
      rating: 4.9,
      followers: 15600,
      profileImage: dj4,
      backgroundImage: "/api/placeholder/400/300",
      bio: "Techno purist with a passion for driving beats and atmospheric soundscapes. Known for marathon sets that push musical boundaries.",
      lastActive: "2024-01-15T02:30:00.000Z",
      createdAt: "2023-03-05T16:45:00.000Z",
      updatedAt: "2024-01-15T02:30:00.000Z",
      playingTonight: [tonight6, tonight1],
      pastEventListings: [tonight3, tonight4, tonight5, tonight6],
    },
    {
      id: "5",
      name: "Brady Mix",
      username: "@bradymix",
      genre: "Afrobeats",
      status: "disabled",
      visibility: "private",
      socialProfiles: {
        instagram: "instagram.com/bradymix",
        spotify: "spotify.com/bradymix"
      },
      location: "Kampala",
      eventsPlayed: 19,
      rating: 4.3,
      followers: 4500,
      profileImage: dj5,
      backgroundImage: "/api/placeholder/400/300",
      bio: "Afrobeats enthusiast bringing the latest hits from across Africa. Specializing in high-energy sets that get everyone moving.",
      lastActive: "2024-01-10T20:15:00.000Z",
      createdAt: "2023-12-01T11:30:00.000Z",
      updatedAt: "2024-01-12T14:20:00.000Z",
      playingTonight: [tonight2],
      pastEventListings: [tonight1],
    },
    {
      id: "6",
      name: "Draft Master",
      username: "@draftmaster",
      genre: "R&B",
      status: "draft",
      visibility: "private",
      socialProfiles: {
        instagram: "instagram.com/draftmaster"
      },
      location: "Mbarara",
      eventsPlayed: 0,
      rating: 0,
      followers: 0,
      profileImage: dj6,
      backgroundImage: "/api/placeholder/400/300",
      bio: "Upcoming R&B DJ focusing on smooth transitions and soulful selections. Building my profile and ready to bring vibes to your events.",
      lastActive: "2024-01-12T15:45:00.000Z",
      createdAt: "2024-01-12T15:45:00.000Z",
      updatedAt: "2024-01-12T15:45:00.000Z",
      playingTonight: [],
      pastEventListings: [],
    },
    {
      id: "7",
      name: "Sarah Melodies",
      username: "@sarahmelodies",
      genre: "Deep House",
      status: "active",
      visibility: "public",
      socialProfiles: {
        instagram: "instagram.com/sarahmelodies",
        mixcloud: "mixcloud.com/sarahmelodies"
      },
      location: "Kampala",
      eventsPlayed: 67,
      rating: 4.8,
      followers: 18200,
      profileImage: dj4,
      backgroundImage: "/api/placeholder/400/300",
      bio: "Deep house specialist with a focus on melodic journeys. Creating emotional connections through carefully curated sets.",
      lastActive: "2024-01-14T01:20:00.000Z",
      createdAt: "2023-01-15T08:00:00.000Z",
      updatedAt: "2024-01-14T01:20:00.000Z",
      playingTonight: [tonight3, tonight4, tonight5],
      pastEventListings: [tonight2, tonight3, tonight4, tonight5, tonight6],
    },
    {
      id: "8",
      name: "Mike Beats",
      username: "@mikebeats",
      genre: "Hip Hop",
      status: "disabled",
      visibility: "private",
      socialProfiles: {
        instagram: "instagram.com/mikebeats",
        soundcloud: "soundcloud.com/mikebeats"
      },
      location: "Entebbe",
      eventsPlayed: 23,
      rating: 4.2,
      followers: 3200,
      profileImage: dj2,
      backgroundImage: "/api/placeholder/400/300",
      bio: "Old school and new school hip hop mixes. Bringing the best of both worlds with seamless transitions and crowd interaction.",
      lastActive: "2024-01-08T19:30:00.000Z",
      createdAt: "2023-09-10T13:15:00.000Z",
      updatedAt: "2024-01-11T10:00:00.000Z",
      playingTonight: [tonight6],
      pastEventListings: [tonight1, tonight2],
    },
  ]);

  // Update profile status
  const updateProfileStatus = (profileId: string, status: "active" | "disabled" | "draft") => {
    setProfiles((prev) =>
      prev.map((profile) =>
        profile.id === profileId
          ? {
              ...profile,
              status,
              updatedAt: new Date().toISOString(),
              ...(status === "disabled" && {
                lastActive: new Date().toISOString(),
              }),
            }
          : profile
      )
    );
  };

  // Delete profile
  const deleteProfile = (profileId: string) => {
    setProfiles((prev) => prev.filter((profile) => profile.id !== profileId));
  };

  // Get profile by ID
  const getProfileById = (profileId: string) => {
    return profiles.find((profile) => profile.id === profileId);
  };

  // Add new profile
  const addProfile = (profileData: Omit<Profile, "id" | "createdAt" | "updatedAt">) => {
    const newProfile: Profile = {
        ...profileData,
        id: `profile-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        name: "",
        username: "",
        genre: "",
        status: "active",
        visibility: "public",
        location: "",
        eventsPlayed: 0,
        rating: 0,
        followers: 0,
        lastActive: "",
        playingTonight: [],
        pastEventListings: [],
    };
    
    setProfiles((prev) => [...prev, newProfile]);
    return newProfile;
  };

  // Update profile
  const updateProfile = (profileId: string, updates: Partial<Profile>) => {
    setProfiles((prev) =>
      prev.map((profile) =>
        profile.id === profileId
          ? {
              ...profile,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : profile
      )
    );
  };

  // Get profiles by status
  const getProfilesByStatus = (status: "active" | "disabled" | "draft") => {
    return profiles.filter((profile) => profile.status === status);
  };

  // Get profiles by genre
  const getProfilesByGenre = (genre: string) => {
    return profiles.filter((profile) => 
      profile.genre.toLowerCase().includes(genre.toLowerCase())
    );
  };

  // Search profiles
  const searchProfiles = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return profiles.filter((profile) =>
      profile.name.toLowerCase().includes(lowercaseQuery) ||
      profile.username.toLowerCase().includes(lowercaseQuery) ||
      profile.genre.toLowerCase().includes(lowercaseQuery) ||
      profile.location.toLowerCase().includes(lowercaseQuery) ||
      profile.bio?.toLowerCase().includes(lowercaseQuery)
    );
  };

  // Get statistics
  const getStatistics = () => {
    const total = profiles.length;
    const active = profiles.filter(p => p.status === "active").length;
    const disabled = profiles.filter(p => p.status === "disabled").length;
    const drafts = profiles.filter(p => p.status === "draft").length;
    const averageRating = profiles.reduce((sum, profile) => sum + profile.rating, 0) / total;
    const totalFollowers = profiles.reduce((sum, profile) => sum + profile.followers, 0);
    const totalEvents = profiles.reduce((sum, profile) => sum + profile.eventsPlayed, 0);

    return {
      total,
      active,
      disabled,
      drafts,
      averageRating: Number(averageRating.toFixed(1)),
      totalFollowers,
      totalEvents,
    };
  };

  return {
    profiles,
    updateProfileStatus,
    deleteProfile,
    getProfileById,
    addProfile,
    updateProfile,
    getProfilesByStatus,
    getProfilesByGenre,
    searchProfiles,
    getStatistics,
  };
}