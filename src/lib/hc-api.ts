import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export async function hcRequest(body: object) {
  const { data, error } = await supabase.functions.invoke('hc-promotions', { body });
  if (error) {
    if (error instanceof FunctionsHttpError) {
      const payload = await error.context.json().catch(() => null);
      throw new Error(payload?.error || 'High Command request failed.');
    }
    throw new Error(error.message);
  }
  return data;
}