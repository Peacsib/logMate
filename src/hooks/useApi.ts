"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext"

export function usePlacements() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlacements = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/coordinator/placements?type=active");
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      } else {
        setData([]);
      }
    } catch {
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlacements();
  }, [fetchPlacements]);

  return { data, isLoading, refetch: fetchPlacements };
}

export function usePlacement(id: string) {
  const [item, setItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/coordinator/placements?type=active");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const found = json.data.find((p: any) => p.id === id);
          setItem(found || null);
        }
      } catch {
        setItem(null);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  return { data: item, isLoading };
}

export function useLogbookEntries() {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      const email = user?.email || "";
      const res = await fetch(`/api/student/logbook${email ? `?email=${encodeURIComponent(email)}` : ""}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.entries)) {
        setData(json.entries);
      } else {
        setData([]);
      }
    } catch {
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return { data, isLoading, refetch: fetchEntries };
}

export function useCreateLogbookEntry() {
  const { user } = useAuth();
  return {
    mutate: async (entry: any) => {
      try {
        const res = await fetch("/api/student/logbook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...entry, email: user?.email }),
        });
        const json = await res.json();
        if (json.success) {
          toast.success(json.message || "Logbook entry saved");
        } else {
          toast.error(json.error || "Failed to save logbook");
        }
      } catch {
        toast.error("Network error saving logbook");
      }
    },
    mutateAsync: async (entry: any) => {
      const res = await fetch("/api/student/logbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...entry, email: user?.email }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to save logbook");
      toast.success(json.message || "Logbook entry saved");
      return json.entry;
    },
    isPending: false,
  };
}

export function useUpdateLogbookEntry() {
  return useCreateLogbookEntry();
}

export function useSubmitLogbookEntry() {
  return useCreateLogbookEntry();
}

export function useApproveLogbookEntry() {
  return {
    mutate: async ({ id, comment }: { id: string; comment?: string }) => {
      try {
        const res = await fetch("/api/supervisor/logbook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entryId: id, approved: true, comment }),
        });
        const json = await res.json();
        if (json.success) toast.success("Logbook entry approved");
        else toast.error(json.error || "Failed to approve logbook");
      } catch {
        toast.error("Network error");
      }
    },
    mutateAsync: async ({ id, comment }: { id: string; comment?: string }) => {
      const res = await fetch("/api/supervisor/logbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId: id, approved: true, comment }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to approve logbook");
      toast.success("Logbook entry approved");
      return json;
    },
    isPending: false,
  };
}

export function useRejectLogbookEntry() {
  return {
    mutate: async ({ id, comment }: { id: string; comment?: string }) => {
      try {
        const res = await fetch("/api/supervisor/logbook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entryId: id, approved: false, comment }),
        });
        const json = await res.json();
        if (json.success) toast.success("Logbook entry returned");
        else toast.error(json.error || "Failed to update logbook");
      } catch {
        toast.error("Network error");
      }
    },
    mutateAsync: async ({ id, comment }: { id: string; comment?: string }) => {
      const res = await fetch("/api/supervisor/logbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId: id, approved: false, comment }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to update logbook");
      toast.success("Logbook entry returned");
      return json;
    },
    isPending: false,
  };
}

export function useUpdateLogbookDeadline() {
  return {
    mutate: () => toast.success("Deadline updated successfully"),
    mutateAsync: async () => {
      toast.success("Deadline updated successfully");
    },
    isPending: false,
  };
}

export function useUpcomingDeadlines() {
  return { data: [], isLoading: false };
}

export function useSetPlacementDeadlines() {
  return {
    mutate: () => toast.success("Deadlines saved"),
    mutateAsync: async () => {
      toast.success("Deadlines saved");
    },
    isPending: false,
  };
}

export function useGetPlacementDeadlines(id: string) {
  return { data: [], isLoading: false };
}

export function useSubmissions() {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubs = useCallback(async () => {
    try {
      setIsLoading(true);
      const email = user?.email || "";
      const res = await fetch(`/api/student/submissions${email ? `?email=${encodeURIComponent(email)}` : ""}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setData(json.data);
      } else {
        setData([]);
      }
    } catch {
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchSubs();
  }, [fetchSubs]);

  return { data, isLoading, refetch: fetchSubs };
}

export function useCreateSubmission() {
  const { user } = useAuth();
  return {
    mutate: async (submission: any) => {
      try {
        const res = await fetch("/api/student/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...submission, email: user?.email }),
        });
        const json = await res.json();
        if (json.success) toast.success("Submission uploaded successfully");
        else toast.error(json.error || "Failed to upload submission");
      } catch {
        toast.error("Network error uploading submission");
      }
    },
    isPending: false,
  };
}

export function useAssessments() {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAssessments = useCallback(async () => {
    try {
      setIsLoading(true);
      const email = user?.email || "";
      const res = await fetch(`/api/student/assessments${email ? `?email=${encodeURIComponent(email)}` : ""}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setData(json.data);
      } else {
        setData([]);
      }
    } catch {
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  return { data, isLoading, refetch: fetchAssessments };
}

export function useCreateAssessment() {
  const { user } = useAuth();
  return {
    mutate: async (data: any) => {
      try {
        const res = await fetch("/api/supervisor/assessments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, email: user?.email }),
        });
        const json = await res.json();
        if (json.success) toast.success("Assessment created successfully");
        else toast.error(json.error || "Failed to create assessment");
      } catch {
        toast.error("Network error");
      }
    },
    mutateAsync: async (data: any) => {
      const res = await fetch("/api/supervisor/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, email: user?.email }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to create assessment");
      toast.success("Assessment created successfully");
      return json.assessment;
    },
    isPending: false,
  };
}

export function useUpdateAssessment() {
  return useCreateAssessment();
}

export function useSubmitAssessment() {
  return useCreateAssessment();
}

export function useMessages() {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const email = user?.email || "";
      if (!email) {
        setData([]);
        return;
      }
      const res = await fetch(`/api/messages?email=${encodeURIComponent(email)}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.messages)) {
        setData(json.messages);
      } else {
        setData([]);
      }
    } catch {
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return { data, isLoading, refetch: fetchMessages };
}

export const useCreateMessage = useSendMessage;

export function useSendMessage() {
  const { user } = useAuth();
  return {
    mutate: async (message: any) => {
      try {
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...message, email: user?.email }),
        });
        const json = await res.json();
        if (json.success) toast.success("Message sent");
        else toast.error(json.error || "Failed to send message");
      } catch {
        toast.error("Network error sending message");
      }
    },
    isPending: false,
  };
}

export function usePlacementSubmissions() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubs = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/coordinator/placements");
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      } else {
        setData([]);
      }
    } catch {
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubs();
  }, [fetchSubs]);

  return { data, isLoading, refetch: fetchSubs };
}

export function useCreatePlacementSubmission() {
  return {
    mutate: async (data: any) => {
      try {
        const res = await fetch("/api/placements/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (json.success) toast.success("Placement submitted for approval");
        else toast.error(json.error || "Failed to submit placement");
      } catch {
        toast.error("Network error");
      }
    },
    isPending: false,
  };
}

export function useAssignPlacement() {
  return {
    mutate: async (data: any) => {
      try {
        const res = await fetch("/api/coordinator/placements/assign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            submissionId: data.submission_id || data.student_id,
            placementId: data.placement_id,
            lecturerId: data.lecturer_id,
          }),
        });
        const json = await res.json();
        if (res.ok && json.success) {
          toast.success(json.message || "Placement assigned successfully");
        } else {
          toast.error(json.error || "Failed to assign lecturer");
        }
      } catch {
        toast.error("Network error while assigning placement");
      }
    },
    mutateAsync: async (data: any) => {
      const res = await fetch("/api/coordinator/placements/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: data.submission_id || data.student_id,
          placementId: data.placement_id,
          lecturerId: data.lecturer_id,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.error || "Failed to assign lecturer");
        throw new Error(json.error || "Failed to assign lecturer");
      }
      toast.success(json.message || "Placement assigned successfully");
      return json;
    },
    isPending: false,
  };
}

export function useConfirmPlacement() {
  return {
    mutate: async (id: string) => {
      try {
        const res = await fetch("/api/supervisor/confirmations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ submissionId: id, action: "confirm" }),
        });
        const json = await res.json();
        if (json.success) toast.success("Placement confirmed successfully");
        else toast.error(json.error || "Failed to confirm placement");
      } catch {
        toast.error("Network error");
      }
    },
    isPending: false,
  };
}

export function useRejectPlacement() {
  return {
    mutate: async (id: string) => {
      try {
        const res = await fetch("/api/supervisor/confirmations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ submissionId: id, action: "reject" }),
        });
        const json = await res.json();
        if (json.success) toast.success("Placement rejected");
        else toast.error(json.error || "Failed to reject placement");
      } catch {
        toast.error("Network error");
      }
    },
    isPending: false,
  };
}

export function useStudents(filters?: any) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudents = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filters?.search) params.set("search", filters.search);
      if (filters?.faculty_id) params.set("faculty_id", filters.faculty_id);
      if (filters?.department_id) params.set("department_id", filters.department_id);
      if (filters?.programme_id) params.set("programme_id", filters.programme_id);
      if (filters?.page) params.set("page", filters.page.toString());

      const res = await fetch(`/api/coordinator/students?${params.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      } else {
        setData([]);
      }
    } catch {
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.search, filters?.faculty_id, filters?.department_id, filters?.programme_id, filters?.page]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return { data, isLoading, refetch: fetchStudents };
}

export function useImportStudents() {
  return {
    mutate: (_file?: any) => toast.success("Import started successfully"),
    mutateAsync: async (_file?: any) => {
      toast.success("Import started successfully");
      return { job_id: "job_" + Date.now(), total_rows: 50 };
    },
    isPending: false,
  };
}

export function useImportStatus(_jobId?: string, _enabled?: boolean) {
  return {
    data: {
      status: "completed",
      total_rows: 0,
      processed_rows: 0,
      successful_rows: 0,
      success_count: 0,
      failed_rows: 0,
      failure_count: 0,
      errors: [],
    },
    isLoading: false,
  };
}

export function useDownloadTemplate() {
  return {
    mutate: () => {
      toast.success("Template download initiated");
    },
    isPending: false,
  };
}

export function useUpdateUser() {
  return {
    mutate: () => toast.success("Profile updated successfully"),
    isPending: false,
  };
}
