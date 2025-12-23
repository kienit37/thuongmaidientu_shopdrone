
import { CookieManager } from './CookieManager';
import { supabase } from '../supabaseClient';

export const SessionTracker = {
    init: async () => {
        // --- Cookie Session logic ---
        const visitCount = parseInt(CookieManager.get('visit_count') || '0');
        CookieManager.set('visit_count', (visitCount + 1).toString(), 365);

        const lastVisit = CookieManager.get('last_visit');
        const now = new Date().toLocaleString('vi-VN');
        CookieManager.set('last_visit', now, 365);

        // --- Session Storage logic ---
        if (!sessionStorage.getItem('ss_start_time')) {
            const ssId = Math.random().toString(36).substring(2, 15);
            sessionStorage.setItem('ss_start_time', new Date().toISOString());
            sessionStorage.setItem('ss_id', ssId);

            // Log visit to Supabase if it's a new session
            try {
                await supabase.from('site_visits').insert([{ session_id: ssId }]);
            } catch (error) {
                console.error('Error logging visit:', error);
            }
        }

        console.log(`[KIEN DRONE] Welcome back! Visit count: ${visitCount + 1}. Session started at: ${sessionStorage.getItem('ss_start_time')}`);
    },

    updateLastPage: (path: string) => {
        sessionStorage.setItem('ss_last_page', path);
    },

    getSnapshot: () => ({
        visitCount: CookieManager.get('visit_count'),
        lastVisit: CookieManager.get('last_visit'),
        sessionId: sessionStorage.getItem('ss_id'),
        startTime: sessionStorage.getItem('ss_start_time'),
        lastPage: sessionStorage.getItem('ss_last_page')
    }),

    getSiteStats: async () => {
        try {
            // Total visits
            const { count: totalCount } = await supabase
                .from('site_visits')
                .select('*', { count: 'exact', head: true });

            // Today visits
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const { count: todayCount } = await supabase
                .from('site_visits')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', today.toISOString());

            return {
                total: totalCount || 0,
                today: todayCount || 0
            };
        } catch (error) {
            console.error('Error fetching site stats:', error);
            return { total: 0, today: 0 };
        }
    }
};
