import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEvents, createEvent, archiveEvent, deleteEvent } from "../api";

// Get all events
export const useEvents = () =>
  useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

// Create event
export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

// Archive event
export const useArchiveEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

// Delete event
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
