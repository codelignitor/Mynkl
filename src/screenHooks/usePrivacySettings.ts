import { useState, useEffect, useCallback, useRef } from "react";
import Toast from "react-native-toast-message";
import {
  getPrivacySettings,
  savePrivacySettings,
  PrivacySettingsPayload,
} from "@/src/services/apis";

// ─── Toggle key ───────────────────────────────────────────────────────────────
export type ToggleKey = keyof PrivacySettingsPayload;

// ─── Map: component setting key → API field name ──────────────────────────────
// This lets the UI use readable keys while the hook translates to API fields.
export const SETTING_KEY_MAP: Record<string, ToggleKey> = {
  moodmap_contribution:     "moodmap_contribution_enabled",
  approximate_location:     "approximate_location_enabled",
  ai_insights:              "ai_summary_processing_enabled",
  open_to_talk:             "open_to_talk_enabled",
  show_mood:                "show_mood_publicly",
  community_support:        "community_support_enabled",
  receive_direct_hugs:      "receive_direct_hugs_enabled",
  anonymous_hugs:           "receive_anonymous_hugs",
  ai_affirmations:          "ai_affirmations_enabled",
  haptic_feedback:          "haptic_feedback_enabled",
  personal_ai_analysis:     "personal_ai_analysis_enabled",
  mood_diary:               "mood_diary_history_enabled",
  personalized_suggestions: "personalized_suggestions_enabled",
  anonymous_mode:           "anonymous_mode_enabled",
  presence_visibility:      "presence_visibility_enabled",
};

// ─── Default toggles (all false) ───────────────────────────────────────────────
const DEFAULT_TOGGLES: Record<string, boolean> = Object.fromEntries(
  Object.keys(SETTING_KEY_MAP).map((k) => [k, false])
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert API response → local toggle state */
const apiToToggles = (
  data: PrivacySettingsPayload
): Record<string, boolean> => {
  const result: Record<string, boolean> = {};
  for (const [uiKey, apiKey] of Object.entries(SETTING_KEY_MAP)) {
    result[uiKey] = data[apiKey] ?? true;
  }
  return result;
};

/** Convert local toggle state → API payload */
const togglesToPayload = (
  toggles: Record<string, boolean>
): PrivacySettingsPayload => {
  const payload: Partial<PrivacySettingsPayload> = {};
  for (const [uiKey, apiKey] of Object.entries(SETTING_KEY_MAP)) {
    (payload as any)[apiKey] = toggles[uiKey] ?? true;
  }
  return payload as PrivacySettingsPayload;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function usePrivacySettings() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(DEFAULT_TOGGLES);
  const [isLoading, setIsLoading] = useState(true);   // initial fetch
  const [isSaving, setIsSaving] = useState(false);    // save in progress
  const [hasError, setHasError] = useState(false);

  // Track pending save to debounce rapid toggle changes
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingToggles = useRef<Record<string, boolean>>(DEFAULT_TOGGLES);

  // ── Fetch on mount ──────────────────────────────────────────────────────────
  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const data = await getPrivacySettings();
      const mapped = apiToToggles(data);
      setToggles(mapped);
      pendingToggles.current = mapped;
    } catch (err) {
      setHasError(true);
      Toast.show({
        type: "error",
        text1: "Couldn't load settings",
        text2: "Pull down to retry.",
        position: "top",
        visibilityTime: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
    return () => {
      // Cancel any pending debounced save on unmount
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [fetchSettings]);

  // ── Save (debounced 800 ms after last toggle) ───────────────────────────────
  const scheduleSave = useCallback((latestToggles: Record<string, boolean>) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        setIsSaving(true);
        const payload = togglesToPayload(latestToggles);
        await savePrivacySettings(payload);
        Toast.show({
          type: "success",
          text1: "Settings saved",
          position: "top",
          visibilityTime: 2000,
        });
      } catch (err) {
        Toast.show({
          type: "error",
          text1: "Couldn't save settings",
          text2: "Please try again.",
          position: "top",
          visibilityTime: 3000,
        });
        // Revert to last known good state from server on failure
        fetchSettings();
      } finally {
        setIsSaving(false);
      }
    }, 800);
  }, [fetchSettings]);

  // ── Toggle a single setting ─────────────────────────────────────────────────
  const handleToggle = useCallback(
    (key: string) => {
      setToggles((prev) => {
        const next = { ...prev, [key]: !prev[key] };
        pendingToggles.current = next;
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave]
  );

  // ── Manual save (for explicit Save button if ever needed) ───────────────────
  const saveNow = useCallback(async () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    try {
      setIsSaving(true);
      const payload = togglesToPayload(pendingToggles.current);
      await savePrivacySettings(payload);
      Toast.show({
        type: "success",
        text1: "Settings saved",
        position: "top",
        visibilityTime: 2000,
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Couldn't save settings",
        text2: "Please try again.",
        position: "top",
        visibilityTime: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    toggles,
    isLoading,
    isSaving,
    hasError,
    handleToggle,
    saveNow,
    retry: fetchSettings,
  };
}