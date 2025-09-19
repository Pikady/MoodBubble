'use client';

import useSWR from 'swr';
import { getUserNotes } from '@/app/actions/notes';
import { Note } from '@/lib/types';

export function useNotes() {
  const { data, error, mutate, isLoading } = useSWR<Note[]>(
    'user-notes',
    getUserNotes,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    notes: data || [],
    isLoading,
    error,
    mutate,
  };
}

export function useNotesByType() {
  const { notes, ...rest } = useNotes();

  const notesByType = notes.reduce((acc, note) => {
    if (!acc[note.type]) {
      acc[note.type] = [];
    }
    acc[note.type].push(note);
    return acc;
  }, {} as Record<string, Note[]>);

  return {
    notesByType,
    ...rest,
  };
}