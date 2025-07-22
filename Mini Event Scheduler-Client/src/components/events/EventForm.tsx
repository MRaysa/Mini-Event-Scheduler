import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import type { Event, EventFormData, AIAnalysis } from "../../types";
import { Button } from "../common/Button";
import { Sparkles, Check, X, ChevronDown } from "lucide-react";

interface EventFormProps {
  /** Callback when form is submitted */
  onSubmit: (event: Omit<Event, "id" | "createdAt" | "archived">) => void;
  /** Callback when form is cancelled */
  onCancel: () => void;
  /** Optional initial event data for edit mode */
  initialEvent?: Event;
}

// Predefined keyword lists for AI-based categorization
const CATEGORY_KEYWORDS = {
  Work: ["meeting", "project", "client", "office", "deadline", "presentation"],
  Personal: ["family", "birthday", "friends", "doctor", "vacation", "shopping"],
  Other: ["class", "volunteer", "maintenance", "flight", "exam", "community"],
};

export function EventForm({
  onSubmit,
  onCancel,
  initialEvent,
}: EventFormProps) {
  // Form control and state management
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<EventFormData>({
    mode: "onChange",
    defaultValues: {
      title: initialEvent?.title || "",
      time: initialEvent?.time || "",
      location: initialEvent?.location || "",
      notes: initialEvent?.notes || "",
      category: initialEvent?.category || "Work",
    },
  });

  // State for AI analysis results and loading status
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis>({
    show: false,
    loading: false,
  });

  // Watched form values for dynamic validation and AI analysis
  const watchedTitle = watch("title");
  const watchedNotes = watch("notes");
  const watchedDate = watch("date");
  const watchedTime = watch("time");

  /**
   * Set default time when component mounts (for new events only)
   */
  useEffect(() => {
    const now = new Date();
    const defaultTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    if (!initialEvent) {
      setValue("time", defaultTime);
    }
  }, [setValue, initialEvent]);

  /**
   * Validate date and time whenever they change
   */
  useEffect(() => {
    validateDateTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedDate, watchedTime]);

  /**
   * Validates the selected date and time
   * @returns {boolean} True if date/time is valid
   */
  const validateDateTime = () => {
    let isValidDateTime = true;

    // Clear previous errors
    clearErrors("date");
    clearErrors("time");

    // Validate date is not in the past
    if (watchedDate) {
      const selectedDate = new Date(watchedDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setError("date", {
          type: "manual",
          message: "Date cannot be in the past",
        });
        isValidDateTime = false;
      }
    }

    // Validate time is not in the past if date is today
    if (watchedDate && watchedTime) {
      const selectedDate = new Date(watchedDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate.getTime() === today.getTime()) {
        const [hours, minutes] = watchedTime.split(":").map(Number);
        const now = new Date();
        const selectedTime = new Date();
        selectedTime.setHours(hours, minutes);

        if (selectedTime < now) {
          setError("time", {
            type: "manual",
            message: "Time cannot be in the past for today",
          });
          isValidDateTime = false;
        }
      }
    }

    return isValidDateTime;
  };

  /**
   * Analyzes event title and notes to suggest category and
   * @param {string} title - Event title
   * @param {string} notes - Event description
   * @returns {object} Analysis results with category, and confidence
   */
  const categorizeEvent = (title: string, notes: string) => {
    const combinedText = `${title} ${notes}`.toLowerCase();
    const categoryScores = {
      Work: 0,
      Personal: 0,
      Other: 0,
    };

    // Count keyword matches for each category
    Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
      keywords.forEach((keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, "gi");
        const matches = combinedText.match(regex);
        if (matches) {
          categoryScores[category as keyof typeof categoryScores] +=
            matches.length;
        }
      });
    });

    // Determine best category based on highest score
    const bestCategory = Object.entries(categoryScores).reduce((a, b) =>
      categoryScores[a[0] as keyof typeof categoryScores] >
      categoryScores[b[0] as keyof typeof categoryScores]
        ? a
        : b
    )[0];

    // Calculate confidence percentage
    const maxScore = Math.max(...Object.values(categoryScores));
    const totalMatches = Object.values(categoryScores).reduce(
      (sum, score) => sum + score,
      0
    );

    let confidence = 60; // Base confidence
    if (maxScore > 0) {
      confidence = Math.min(
        95,
        60 + (maxScore / Math.max(totalMatches, 1)) * 35
      );
    }

    return {
      category: bestCategory as "Work" | "Personal" | "Other",
      confidence: Math.round(confidence),
      matchedKeywords: categoryScores,
    };
  };

  /**
   * Handles form submission
   * @param {EventFormData} data - Form data
   */
  const onSubmitForm = (data: EventFormData) => {
    if (validateDateTime()) {
      onSubmit(data);
    }
  };

  /**
   * Triggers AI analysis of the event details
   */
  const handleAnalyze = () => {
    if (!validateDateTime() || !watchedTitle || !watchedNotes) return;

    setAiAnalysis({ show: true, loading: true });

    // Simulate AI processing delay
    setTimeout(() => {
      const analysis = categorizeEvent(watchedTitle, watchedNotes);
      setAiAnalysis({
        show: true,
        loading: false,
        category: analysis.category,

        confidence: analysis.confidence,
      });
    }, 1000);
  };

  /**
   * Applies AI recommendations to the form
   */
  const applyRecommendations = () => {
    if (aiAnalysis.category) {
      setValue("category", aiAnalysis.category);
    }
    setAiAnalysis({ show: false, loading: false });
  };

  // Calculate minimum time if date is today
  const today = new Date().toISOString().split("T")[0];
  const now = new Date();
  const currentHour = String(now.getHours()).padStart(2, "0");
  const currentMinute = String(now.getMinutes()).padStart(2, "0");
  const minTime =
    watchedDate === today ? `${currentHour}:${currentMinute}` : "00:00";

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      {/* Title Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Event Title *
        </label>
        <Controller
          name="title"
          control={control}
          rules={{ required: "Event title is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g. Meeting with faculty"
            />
          )}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <Controller
          name="notes"
          control={control}
          rules={{ required: "Description is required" }}
          render={({ field }) => (
            <textarea
              {...field}
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.notes ? "border-red-500" : "border-gray-300"
              }`}
              rows={3}
              placeholder="Describe your event"
            />
          )}
        />
        {errors.notes && (
          <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
        )}
      </div>

      {/* AI Analysis Section */}
      {aiAnalysis.show && (
        <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
          {aiAnalysis.loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  AI Analysis Complete (Confidence: {aiAnalysis.confidence}%)
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{aiAnalysis.category}</span>
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={applyRecommendations}
                className="w-full flex items-center justify-center gap-2 bg-blue-200"
              >
                <Check className="w-4 h-4" />
                Apply AI Recommendations
              </Button>
            </>
          )}
        </div>
      )}

      {/* AI Analyze Button */}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={handleAnalyze}
          disabled={!watchedTitle || !watchedNotes}
          className="flex items-center gap-2 bg-blue-900"
        >
          <Sparkles className="w-4 h-4" />
          AI Analyze
        </Button>
      </div>

      {/* Date and Time Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date *
          </label>
          <Controller
            name="date"
            control={control}
            rules={{ required: "Date is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="date"
                min={today}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.date ? "border-red-500" : "border-gray-300"
                }`}
              />
            )}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time *
          </label>
          <Controller
            name="time"
            control={control}
            rules={{ required: "Time is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="time"
                min={watchedDate === today ? minTime : undefined}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.time ? "border-red-500" : "border-gray-300"
                }`}
              />
            )}
          />
          {errors.time && (
            <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
          )}
        </div>
      </div>

      {/* Location Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location *
        </label>
        <Controller
          name="location"
          control={control}
          rules={{ required: "Location is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.location ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter event location"
            />
          )}
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
        )}
      </div>

      {/* Category Field */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <div className="relative">
                <select
                  {...field}
                  className="w-full px-3 py-2 border rounded-lg appearance-none bg-white pr-10"
                >
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            )}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          <X className="w-4 h-4 mr-1" />
          Cancel
        </Button>
        <Button type="submit">
          {initialEvent ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  );
}
