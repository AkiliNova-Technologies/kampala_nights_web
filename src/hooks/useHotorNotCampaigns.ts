// hooks/use-hot-or-not-campaigns.ts
import { useState } from "react";
import type { HotOrNotEvent } from "@/components/hot-or-not-cards";
import demo1 from "@/assets/images/hOn1.png";
import demo2 from "@/assets/images/hOn2.png";
import demo3 from "@/assets/images/hOn3.png";
import demo4 from "@/assets/images/hOn4.png";
import demo5 from "@/assets/images/hOn5.png";
import demo6 from "@/assets/images/hOn6.png";
import type { Campaign } from "@/types/campaign";


export function useHotOrNotCampaigns() {
  const [campaigns] = useState<Campaign[]>([
    {
      id: "1",
      title: "Vintage Old School",
      description: "Classic retro fashion styles from the golden eras...",
      status: "active",
      contestants: [
        { id: "1-1", name: "Joan Kazibwe", votes: 480, rank: 1 },
        { id: "1-2", name: "Wandera Kazibwe", votes: 380, rank: 2 },
        { id: "1-3", name: "Mark Lubega", votes: 300, rank: 3 },
        { id: "1-4", name: "Sarah Nakato", votes: 280, rank: 4 },
        { id: "1-5", name: "David Omondi", votes: 250, rank: 5 },
        { id: "1-6", name: "Grace Auma", votes: 220, rank: 6 },
        { id: "1-7", name: "Brian Kato", votes: 200, rank: 7 },
        { id: "1-8", name: "Patricia Nalubega", votes: 180, rank: 8 },
        { id: "1-9", name: "Alex Tumusiime", votes: 150, rank: 9 },
        { id: "1-10", name: "Sheila Nansubuga", votes: 120, rank: 10 },
        { id: "1-11", name: "Michael Ssebunya", votes: 100, rank: 11 },
        { id: "1-12", name: "Rita Nalwanga", votes: 90, rank: 12 },
        { id: "1-13", name: "Peter Okot", votes: 85, rank: 13 },
        { id: "1-14", name: "Susan Akello", votes: 80, rank: 14 },
        { id: "1-15", name: "Joseph Mwangi", votes: 75, rank: 15 },
        { id: "1-16", name: "Lydia Namutebi", votes: 70, rank: 16 },
        { id: "1-17", name: "Daniel Kibet", votes: 65, rank: 17 },
        { id: "1-18", name: "Monica Nalubowa", votes: 60, rank: 18 },
        { id: "1-19", name: "Robert Mugisha", votes: 55, rank: 19 },
        { id: "1-20", name: "Esther Nanyonjo", votes: 50, rank: 20 },
        { id: "1-21", name: "Samuel Otieno", votes: 45, rank: 21 },
        { id: "1-22", name: "Prossy Nabbosa", votes: 40, rank: 22 },
        { id: "1-23", name: "Andrew Kawooya", votes: 35, rank: 23 },
        { id: "1-24", name: "Jennifer Nalule", votes: 30, rank: 24 },
      ],
      totalVotes: 2100,
      endDate: "2025-09-26",
      category: "Nightlife",
      imageUrl: demo1,
    },
    {
      id: "2",
      title: "Street Style",
      description: "Urban fashion that defines contemporary street culture...",
      status: "active",
      contestants: [
        { id: "2-1", name: "Marcus Johnson", votes: 520, rank: 1 },
        { id: "2-2", name: "Tyler Chen", votes: 450, rank: 2 },
        { id: "2-3", name: "Jamal Washington", votes: 380, rank: 3 },
        { id: "2-4", name: "Sofia Rodriguez", votes: 320, rank: 4 },
        { id: "2-5", name: "Kevin Martinez", votes: 290, rank: 5 },
        { id: "2-6", name: "Aisha Patel", votes: 260, rank: 6 },
        { id: "2-7", name: "Carlos Garcia", votes: 230, rank: 7 },
        { id: "2-8", name: "Maya Thompson", votes: 210, rank: 8 },
        { id: "2-9", name: "Jordan Lee", votes: 190, rank: 9 },
        { id: "2-10", name: "Riley Smith", votes: 170, rank: 10 },
        { id: "2-11", name: "Zoe Williams", votes: 150, rank: 11 },
        { id: "2-12", name: "Ethan Brown", votes: 130, rank: 12 },
        { id: "2-13", name: "Chloe Davis", votes: 120, rank: 13 },
        { id: "2-14", name: "Noah Miller", votes: 110, rank: 14 },
        { id: "2-15", name: "Isabella Wilson", votes: 100, rank: 15 },
        { id: "2-16", name: "Liam Moore", votes: 90, rank: 16 },
        { id: "2-17", name: "Emma Taylor", votes: 85, rank: 17 },
        { id: "2-18", name: "Lucas Anderson", votes: 80, rank: 18 },
        { id: "2-19", name: "Ava Thomas", votes: 75, rank: 19 },
        { id: "2-20", name: "Mason Jackson", votes: 70, rank: 20 },
        { id: "2-21", name: "Sophia White", votes: 65, rank: 21 },
        { id: "2-22", name: "Logan Harris", votes: 60, rank: 22 },
        { id: "2-23", name: "Mia Martin", votes: 55, rank: 23 },
        { id: "2-24", name: "Oliver Thompson", votes: 50, rank: 24 },
      ],
      totalVotes: 2100,
      endDate: "2025-09-26",
      category: "Fashion",
      imageUrl: demo2,
    },
    {
      id: "3",
      title: "Smart & Classy",
      description: "Sophisticated formal wear that exudes elegance...",
      status: "active",
      contestants: [
        { id: "3-1", name: "Eleanor Vanderbilt", votes: 600, rank: 1 },
        { id: "3-2", name: "Alexander Harrington", votes: 480, rank: 2 },
        { id: "3-3", name: "Charlotte Montgomery", votes: 420, rank: 3 },
        { id: "3-4", name: "William Kensington", votes: 380, rank: 4 },
        { id: "3-5", name: "Victoria Ashford", votes: 350, rank: 5 },
        { id: "3-6", name: "James Wellington", votes: 320, rank: 6 },
        { id: "3-7", name: "Margaret Fairchild", votes: 290, rank: 7 },
        { id: "3-8", name: "Richard Lancaster", votes: 270, rank: 8 },
        { id: "3-9", name: "Catherine Beaumont", votes: 250, rank: 9 },
        { id: "3-10", name: "Henry Cavendish", votes: 230, rank: 10 },
        { id: "3-11", name: "Elizabeth Sinclair", votes: 210, rank: 11 },
        { id: "3-12", name: "Charles Davenport", votes: 190, rank: 12 },
        { id: "3-13", name: "Anne Fitzroy", votes: 180, rank: 13 },
        { id: "3-14", name: "Edward Blackwood", votes: 170, rank: 14 },
        { id: "3-15", name: "Diana Pembroke", votes: 160, rank: 15 },
        { id: "3-16", name: "George Ashworth", votes: 150, rank: 16 },
        { id: "3-17", name: "Beatrice Hawthorne", votes: 140, rank: 17 },
        { id: "3-18", name: "Frederick Chadwick", votes: 130, rank: 18 },
        { id: "3-19", name: "Lucinda Radcliffe", votes: 120, rank: 19 },
        { id: "3-20", name: "Arthur Kingsley", votes: 110, rank: 20 },
        { id: "3-21", name: "Genevieve Prescott", votes: 100, rank: 21 },
        { id: "3-22", name: "Rupert Ellington", votes: 95, rank: 22 },
        { id: "3-23", name: "Penelope Ashbury", votes: 90, rank: 23 },
        { id: "3-24", name: "Alistair Croft", votes: 85, rank: 24 },
      ],
      totalVotes: 2100,
      endDate: "2025-09-26",
      category: "Fashion",
      imageUrl: demo3,
    },
    {
      id: "4",
      title: "Beach Vibes",
      description: "Summer beach fashion and resort wear collections...",
      status: "upcoming",
      contestants: [
        { id: "4-1", name: "Kai Nakamura", votes: 0, rank: 1 },
        { id: "4-2", name: "Leilani Santos", votes: 0, rank: 2 },
        { id: "4-3", name: "Rio Tanaka", votes: 0, rank: 3 },
        { id: "4-4", name: "Sienna Cruz", votes: 0, rank: 4 },
        { id: "4-5", name: "Orion Delgado", votes: 0, rank: 5 },
        { id: "4-6", name: "Zara Fernandez", votes: 0, rank: 6 },
        { id: "4-7", name: "Koa Hernandez", votes: 0, rank: 7 },
        { id: "4-8", name: "Nalani Gonzalez", votes: 0, rank: 8 },
        { id: "4-9", name: "Kai Silva", votes: 0, rank: 9 },
        { id: "4-10", name: "Malia Reyes", votes: 0, rank: 10 },
        { id: "4-11", name: "Kaimana Torres", votes: 0, rank: 11 },
        { id: "4-12", name: "Noe Ramirez", votes: 0, rank: 12 },
        { id: "4-13", name: "Kailani Flores", votes: 0, rank: 13 },
        { id: "4-14", name: "Makani Ortiz", votes: 0, rank: 14 },
        { id: "4-15", name: "Anela Vargas", votes: 0, rank: 15 },
        { id: "4-16", name: "Kekoa Morales", votes: 0, rank: 16 },
        { id: "4-17", name: "Haley Gutierrez", votes: 0, rank: 17 },
        { id: "4-18", name: "Kai Castillo", votes: 0, rank: 18 },
      ],
      totalVotes: 0,
      endDate: "2025-10-15",
      category: "Fashion",
      imageUrl: demo4,
    },
    {
      id: "5",
      title: "Winter Collection",
      description: "Cozy winter fashion and cold weather essentials...",
      status: "completed",
      contestants: [
        { id: "5-1", name: "Freya Olsen", votes: 850, rank: 1 },
        { id: "5-2", name: "Bjorn Schmidt", votes: 720, rank: 2 },
        { id: "5-3", name: "Astrid Berg", votes: 680, rank: 3 },
        { id: "5-4", name: "Lars Jorgensen", votes: 620, rank: 4 },
        { id: "5-5", name: "Ingrid Larsen", votes: 580, rank: 5 },
        { id: "5-6", name: "Sven Andersen", votes: 540, rank: 6 },
        { id: "5-7", name: "Hilda Nilsson", votes: 510, rank: 7 },
        { id: "5-8", name: "Gunnar Eriksen", votes: 480, rank: 8 },
        { id: "5-9", name: "Sigrid Hansen", votes: 450, rank: 9 },
        { id: "5-10", name: "Leif Johansson", votes: 420, rank: 10 },
        { id: "5-11", name: "Elsa Pedersen", votes: 400, rank: 11 },
        { id: "5-12", name: "Magnus Dahl", votes: 380, rank: 12 },
        { id: "5-13", name: "Solveig Holm", votes: 360, rank: 13 },
        { id: "5-14", name: "Stian Lund", votes: 340, rank: 14 },
        { id: "5-15", name: "Marta Solberg", votes: 320, rank: 15 },
        { id: "5-16", name: "Vidar Nilsen", votes: 300, rank: 16 },
        { id: "5-17", name: "Kari Amundsen", votes: 280, rank: 17 },
        { id: "5-18", name: "Torstein Haugen", votes: 260, rank: 18 },
        { id: "5-19", name: "Runa Iversen", votes: 240, rank: 19 },
        { id: "5-20", name: "Einar Bakke", votes: 220, rank: 20 },
        { id: "5-21", name: "Liv Strand", votes: 200, rank: 21 },
        { id: "5-22", name: "Jorgen Lie", votes: 180, rank: 22 },
        { id: "5-23", name: "Siv Aas", votes: 160, rank: 23 },
        { id: "5-24", name: "Oddvar Moe", votes: 140, rank: 24 },
        { id: "5-25", name: "Britt Sand", votes: 120, rank: 25 },
        { id: "5-26", name: "Arne Foss", votes: 100, rank: 26 },
        { id: "5-27", name: "Tone Berg", votes: 90, rank: 27 },
        { id: "5-28", name: "Per Lunde", votes: 80, rank: 28 },
        { id: "5-29", name: "Anne Kristiansen", votes: 70, rank: 29 },
        { id: "5-30", name: "Knut Sorensen", votes: 60, rank: 30 },
        { id: "5-31", name: "Mona Jacobsen", votes: 50, rank: 31 },
        { id: "5-32", name: "Steinar Olsen", votes: 40, rank: 32 },
      ],
      totalVotes: 4500,
      endDate: "2025-08-30",
      category: "Nightlife",
      imageUrl: demo5,
    },
    {
      id: "6",
      title: "Athleisure",
      description: "Sporty fashion meets everyday comfort and style...",
      status: "active",
      contestants: [
        { id: "6-1", name: "Jordan Carter", votes: 680, rank: 1 },
        { id: "6-2", name: "Taylor Morgan", votes: 590, rank: 2 },
        { id: "6-3", name: "Casey Parker", votes: 520, rank: 3 },
        { id: "6-4", name: "Riley Jordan", votes: 480, rank: 4 },
        { id: "6-5", name: "Alex Morgan", votes: 440, rank: 5 },
        { id: "6-6", name: "Drew Bennett", votes: 410, rank: 6 },
        { id: "6-7", name: "Blair Foster", votes: 380, rank: 7 },
        { id: "6-8", name: "Morgan Hayes", votes: 350, rank: 8 },
        { id: "6-9", name: "Cameron Reed", votes: 320, rank: 9 },
        { id: "6-10", name: "Quinn Sullivan", votes: 300, rank: 10 },
        { id: "6-11", name: "Avery Collins", votes: 280, rank: 11 },
        { id: "6-12", name: "Rowan Gallagher", votes: 260, rank: 12 },
        { id: "6-13", name: "Skyler Vance", votes: 240, rank: 13 },
        { id: "6-14", name: "Peyton Rhodes", votes: 220, rank: 14 },
        { id: "6-15", name: "Dakota Shaw", votes: 200, rank: 15 },
        { id: "6-16", name: "Emerson Cross", votes: 180, rank: 16 },
        { id: "6-17", name: "Finley Stone", votes: 160, rank: 17 },
        { id: "6-18", name: "Harper Wells", votes: 140, rank: 18 },
        { id: "6-19", name: "Sawyer Grant", votes: 120, rank: 19 },
        { id: "6-20", name: "Justice Ford", votes: 100, rank: 20 },
        { id: "6-21", name: "Phoenix Miles", votes: 90, rank: 21 },
        { id: "6-22", name: "River Brooks", votes: 80, rank: 22 },
        { id: "6-23", name: "Sailor Knight", votes: 70, rank: 23 },
        { id: "6-24", name: "Arden Lane", votes: 60, rank: 24 },
        { id: "6-25", name: "Reese Fox", votes: 50, rank: 25 },
        { id: "6-26", name: "Tatum Cole", votes: 40, rank: 26 },
        { id: "6-27", name: "London Pierce", votes: 30, rank: 27 },
        { id: "6-28", name: "Memphis Hunt", votes: 20, rank: 28 },
      ],
      totalVotes: 3200,
      endDate: "2025-10-05",
      category: "Nightlife",
      imageUrl: demo6,
    },
  ]);

  // Convert campaigns to HotOrNotEvent format for the cards component
  const getEventsFromCampaigns = (
    campaignsList: Campaign[]
  ): HotOrNotEvent[] => {
    return campaignsList.map((campaign) => ({
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      status: campaign.status === "draft" ? "upcoming" : campaign.status,
      contestants: campaign.contestants || [],
      totalVotes: campaign.totalVotes || 0,
      endDate: campaign.endDate || "",
      endsAt: campaign.endDate || "",
      category: campaign.category,
      categories: [campaign.category],
      imageUrl: campaign.imageUrl,
    }));
  };

  const getActiveCampaigns = () =>
    campaigns.filter((campaign) => campaign.status === "active");

  const addCampaign = (newCampaign: Omit<Campaign, "id">) => {
    const campaign: Campaign = {
      ...newCampaign,
      id: Date.now().toString(),
    };
    // In a real app, you would set state here
    console.log("Adding campaign:", campaign);
    return campaign;
  };

  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    // In a real app, you would update state here
    console.log("Updating campaign:", id, updates);
  };

  const deleteCampaign = (id: string) => {
    // In a real app, you would update state here
    console.log("Deleting campaign:", id);
  };

  return {
    campaigns,
    getEventsFromCampaigns,
    getActiveCampaigns,
    addCampaign,
    updateCampaign,
    deleteCampaign,
  };
}
