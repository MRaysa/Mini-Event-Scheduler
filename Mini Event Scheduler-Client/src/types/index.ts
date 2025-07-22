export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  notes?: string;
  category: "Work" | "Personal" | "Other";
  archived: boolean;
  createdAt: string;
  location: string;
  tags: string[];
  _id?: string;
}

export interface FilterOptions {
  category?: "Work" | "Personal" | "Other";
  searchTerm?: string;
}

export interface EventFormData {
  title: string;
  date: string;
  time: string;
  location: string;
  notes: string;
  category: "Work" | "Personal" | "Other";
  tags: string[];
}

export interface AIAnalysis {
  show: boolean;
  loading: boolean;
  category?: "Work" | "Personal" | "Other";
  tags?: string[];
  confidence?: number;
}
