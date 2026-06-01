import type { SelectionMode } from "@/lib/types";
import { validateSelectionValue, validateTextValue } from "@/lib/validation";

export type GenerationFormValues = {
  genre: string;
  customGenre: string;
  setting: string;
  customSetting: string;
  raceMode: SelectionMode;
  selectedRaces: string[];
  classMode: SelectionMode;
  selectedClasses: string[];
};

export type GenerationFormErrors = {
  genreError: string | null;
  settingError: string | null;
  raceError: string | null;
  classError: string | null;
};

export type GenerationErrorFieldId =
  | "genre-field"
  | "setting-field"
  | "races-field"
  | "classes-field";

export function getGenerationFormErrors({
  genre,
  customGenre,
  setting,
  customSetting,
  raceMode,
  selectedRaces,
  classMode,
  selectedClasses,
}: GenerationFormValues): GenerationFormErrors {
  return {
    genreError:
      genre === "Other"
        ? validateTextValue(
            customGenre,
            "genre",
            40,
            "Please enter a custom genre.",
          )
        : null,
    settingError:
      setting === "Other"
        ? validateTextValue(
            customSetting,
            "setting",
            40,
            "Please enter a custom setting.",
          )
        : null,
    raceError:
      raceMode === "custom"
        ? validateSelectionValue(selectedRaces, "race")
        : null,
    classError:
      classMode === "custom"
        ? validateSelectionValue(selectedClasses, "class")
        : null,
  };
}

export function getFirstGenerationErrorField(
  errors: GenerationFormErrors,
): GenerationErrorFieldId | null {
  if (errors.genreError) return "genre-field";
  if (errors.settingError) return "setting-field";
  if (errors.raceError) return "races-field";
  if (errors.classError) return "classes-field";

  return null;
}
