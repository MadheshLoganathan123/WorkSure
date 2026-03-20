import { CreateProfileInput } from '../schemas/profile.schema';
import { supabase } from '../utils/supabaseClient';

export interface WorkerProfile extends CreateProfileInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create a new worker profile.
 */
export const createProfile = async (data: CreateProfileInput): Promise<WorkerProfile> => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .insert([
      {
        name: data.name,
        persona: data.persona,
        location: data.location,
        avg_earnings: data.avgEarnings,
        working_hours: data.workingHours,
      }
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating profile: ${error.message}`);
  }

  return {
    id: profile.id,
    name: profile.name,
    persona: profile.persona,
    location: profile.location,
    avgEarnings: profile.avg_earnings,
    workingHours: profile.working_hours,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  };
};

/**
 * Retrieve a profile by its ID.
 * Returns `null` if no profile exists.
 */
export const getProfileById = async (id: string): Promise<WorkerProfile | null> => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select()
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Postgrest error for no rows found
    throw new Error(`Error fetching profile: ${error.message}`);
  }

  return {
    id: profile.id,
    name: profile.name,
    persona: profile.persona,
    location: profile.location,
    avgEarnings: profile.avg_earnings,
    workingHours: profile.working_hours,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  };
};

/**
 * List all profiles (for development / debugging).
 */
export const getAllProfiles = async (): Promise<WorkerProfile[]> => {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select();

  if (error) {
    throw new Error(`Error fetching all profiles: ${error.message}`);
  }

  return (profiles || []).map(profile => ({
    id: profile.id,
    name: profile.name,
    persona: profile.persona,
    location: profile.location,
    avgEarnings: profile.avg_earnings,
    workingHours: profile.working_hours,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  }));
};
