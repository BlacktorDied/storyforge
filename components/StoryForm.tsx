import { LoaderCircle } from "lucide-react";

import Button from "./ui/Button";
import InfoTooltip from "./ui/InfoTooltip";
import MultiSelectWithMode from "./ui/MultiSelectWithMode";
import SelectField from "./ui/SelectField";
import SelectWithCustomOption from "./ui/SelectWithCustomOption";
import {
  CLASSES,
  ENCOUNTER_COUNT_BY_SESSION_LENGTH,
  GENRES,
  LEVELS,
  PARTY_SIZES,
  RACES,
  SESSION_LENGTHS,
  SETTINGS,
  type SessionLength,
} from "@/lib/data";
import type { SelectionMode } from "@/lib/types";

type Props = {
  genre: string;
  onGenreChange: (value: string) => void;
  customGenre: string;
  onCustomGenreChange: (value: string) => void;
  genreError: string | null;
  onGenreTouch: () => void;
  onGenreValidationReset: () => void;

  setting: string;
  onSettingChange: (value: string) => void;
  customSetting: string;
  onCustomSettingChange: (value: string) => void;
  settingError: string | null;
  onSettingTouch: () => void;
  onSettingValidationReset: () => void;

  raceMode: SelectionMode;
  onRaceModeChange: (value: SelectionMode) => void;
  selectedRaces: string[];
  onSelectedRacesChange: (value: string[]) => void;
  raceError: string | null;
  onRaceTouch: () => void;
  onRaceValidationReset: () => void;

  classMode: SelectionMode;
  onClassModeChange: (value: SelectionMode) => void;
  selectedClasses: string[];
  onSelectedClassesChange: (value: string[]) => void;
  classError: string | null;
  onClassTouch: () => void;
  onClassValidationReset: () => void;

  sessionLength: SessionLength;
  onSessionLengthChange: (value: SessionLength) => void;

  partySize: string;
  onPartySizeChange: (value: string) => void;

  level: string;
  onLevelChange: (value: string) => void;

  loading: boolean;
  onGenerate: () => void;
};

export default function StoryForm({
  genre,
  onGenreChange,
  customGenre,
  onCustomGenreChange,
  genreError,
  onGenreTouch,
  onGenreValidationReset,

  setting,
  onSettingChange,
  customSetting,
  onCustomSettingChange,
  settingError,
  onSettingTouch,
  onSettingValidationReset,

  raceMode,
  onRaceModeChange,
  selectedRaces,
  onSelectedRacesChange,
  raceError,
  onRaceTouch,
  onRaceValidationReset,

  classMode,
  onClassModeChange,
  selectedClasses,
  onSelectedClassesChange,
  classError,
  onClassTouch,
  onClassValidationReset,

  sessionLength,
  onSessionLengthChange,

  partySize,
  onPartySizeChange,

  level,
  onLevelChange,

  loading,
  onGenerate,
}: Props) {
  return (
    <aside className="space-y-4">
      <SelectWithCustomOption
        id="genre-field"
        label="Genre"
        options={GENRES}
        value={genre}
        onValueChange={onGenreChange}
        customValue={customGenre}
        onCustomValueChange={onCustomGenreChange}
        error={genreError}
        onTouch={onGenreTouch}
        onValidationReset={onGenreValidationReset}
      />

      <SelectWithCustomOption
        id="setting-field"
        label="Setting"
        options={SETTINGS}
        value={setting}
        onValueChange={onSettingChange}
        customValue={customSetting}
        onCustomValueChange={onCustomSettingChange}
        error={settingError}
        onTouch={onSettingTouch}
        onValidationReset={onSettingValidationReset}
      />

      <MultiSelectWithMode
        id="races-field"
        label="Allowed Races"
        options={RACES}
        mode={raceMode}
        onModeChange={onRaceModeChange}
        selectedOptions={selectedRaces}
        onSelectedOptionsChange={onSelectedRacesChange}
        allDescription="Use all core D&D 5e races from the 2014 Player’s Handbook."
        error={raceError}
        onTouch={onRaceTouch}
        onValidationReset={onRaceValidationReset}
      />

      <MultiSelectWithMode
        id="classes-field"
        label="Allowed Classes"
        options={CLASSES}
        mode={classMode}
        onModeChange={onClassModeChange}
        selectedOptions={selectedClasses}
        onSelectedOptionsChange={onSelectedClassesChange}
        allDescription="Use all classic D&D 5e classes from the 2014 Player’s Handbook."
        error={classError}
        onTouch={onClassTouch}
        onValidationReset={onClassValidationReset}
      />

      <div>
        <div>
          <label className="font-semibold">Session Length</label>
          <InfoTooltip
            text={SESSION_LENGTHS.map(
              (length) =>
                `${length}: ${ENCOUNTER_COUNT_BY_SESSION_LENGTH[length]} encounters`,
            ).join("\n")}
          />
        </div>

        <SelectField
          value={sessionLength}
          onChange={(e) =>
            onSessionLengthChange(e.target.value as SessionLength)
          }
        >
          {SESSION_LENGTHS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </SelectField>
      </div>

      <div>
        <label className="block font-semibold">Party Size</label>
        <SelectField
          value={partySize}
          onChange={(e) => onPartySizeChange(e.target.value)}
        >
          {PARTY_SIZES.map((p) => (
            <option key={p} value={p}>
              {p} players
            </option>
          ))}
        </SelectField>
      </div>

      <div>
        <div>
          <label className="font-semibold">Character Level</label>
          <InfoTooltip text="Recommended level for the player character." />
        </div>

        <SelectField
          value={level}
          onChange={(e) => onLevelChange(e.target.value)}
        >
          {LEVELS.map((lvl) => (
            <option key={lvl} value={lvl}>
              Level {lvl}
            </option>
          ))}
        </SelectField>
      </div>

      <Button onClick={onGenerate} disabled={loading}>
        {loading && <LoaderCircle className="size-4 animate-spin" />}

        {loading ? "Generating..." : "Generate"}
      </Button>
    </aside>
  );
}
