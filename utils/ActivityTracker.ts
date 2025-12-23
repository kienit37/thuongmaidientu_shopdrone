import { supabase } from '../supabaseClient';

export const ActivityTracker = {
    async track(action: string, details: string) {
        try {
            const { error } = await supabase.from('activity_logs').insert([
                { action, details }
            ]);
            if (error) console.error("Error tracking activity:", error);
        } catch (e) {
            console.error("Exception tracking activity:", e);
        }
    }
};
