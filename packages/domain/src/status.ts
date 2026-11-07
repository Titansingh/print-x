/**
 * Visual tone for status presentation (badges, banners). This is a UI concern
 * only; actual order/job/QC states and transitions are owned by the backend.
 */
export const statusTones = ["neutral", "info", "success", "warning", "error"] as const;

export type StatusTone = (typeof statusTones)[number];
