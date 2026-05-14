import InfoTooltip from "./InfoTooltip";
import MultiSelectWithMode from "./MultiSelectWithMode";
import SelectWithCustomOption from "./SelectWithCustomOption";
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
  setGenre: (value: string) => void;
  customGenre: string;
  setCustomGenre: (value: string) => void;
  genreError: string;
  touchGenreField: () => void;
  resetGenreValidation: () => void;

  setting: string;
  setSetting: (value: string) => void;
  customSetting: string;
  setCustomSetting: (value: string) => void;
  settingError: string;
  touchSettingField: () => void;
  resetSettingValidation: () => void;

  raceMode: SelectionMode;
  setRaceMode: (value: SelectionMode) => void;
  selectedRaces: string[];
  setSelectedRaces: (value: string[]) => void;
  raceError: string;
  touchRaceField: () => void;
  resetRaceValidation: () => void;

  classMode: SelectionMode;
  setClassMode: (value: SelectionMode) => void;
  selectedClasses: string[];
  setSelectedClasses: (value: string[]) => void;
  classError: string;
  touchClassField: () => void;
  resetClassValidation: () => void;

  sessionLength: SessionLength;
  setSessionLength: (value: SessionLength) => void;

  partySize: string;
  setPartySize: (value: string) => void;

  level: string;
  setLevel: (value: string) => void;

  loading: boolean;
  onGenerate: () => void;
};

const selectClassName =
  "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function StoryForm({
  genre,
  setGenre,
  customGenre,
  setCustomGenre,
  genreError,
  touchGenreField,
  resetGenreValidation,

  setting,
  setSetting,
  customSetting,
  setCustomSetting,
  settingError,
  touchSettingField,
  resetSettingValidation,

  raceMode,
  setRaceMode,
  selectedRaces,
  setSelectedRaces,
  raceError,
  touchRaceField,
  resetRaceValidation,

  classMode,
  setClassMode,
  selectedClasses,
  setSelectedClasses,
  classError,
  touchClassField,
  resetClassValidation,

  sessionLength,
  setSessionLength,

  partySize,
  setPartySize,

  level,
  setLevel,

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
        setValue={setGenre}
        customValue={customGenre}
        setCustomValue={setCustomGenre}
        error={genreError}
        onTouch={touchGenreField}
        resetValidation={resetGenreValidation}
      />

      <SelectWithCustomOption
        id="setting-field"
        label="Setting"
        options={SETTINGS}
        value={setting}
        setValue={setSetting}
        customValue={customSetting}
        setCustomValue={setCustomSetting}
        error={settingError}
        onTouch={touchSettingField}
        resetValidation={resetSettingValidation}
      />

      <MultiSelectWithMode
        id="races-field"
        label="Allowed Races"
        options={RACES}
        mode={raceMode}
        setMode={setRaceMode}
        selected={selectedRaces}
        setSelected={setSelectedRaces}
        allDescription="Use all core D&D 5e races from the 2014 Player’s Handbook."
        error={raceError}
        onTouch={touchRaceField}
        resetValidation={resetRaceValidation}
      />

      <MultiSelectWithMode
        id="classes-field"
        label="Allowed Classes"
        options={CLASSES}
        mode={classMode}
        setMode={setClassMode}
        selected={selectedClasses}
        setSelected={setSelectedClasses}
        allDescription="Use all classic D&D 5e classes from the 2014 Player’s Handbook."
        error={classError}
        onTouch={touchClassField}
        resetValidation={resetClassValidation}
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

        <select
          value={sessionLength}
          onChange={(e) => setSessionLength(e.target.value as SessionLength)}
          className={selectClassName}
        >
          {SESSION_LENGTHS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-semibold">Party Size</label>
        <select
          value={partySize}
          onChange={(e) => setPartySize(e.target.value)}
          className={selectClassName}
        >
          {PARTY_SIZES.map((p) => (
            <option key={p} value={p}>
              {p} players
            </option>
          ))}
        </select>
      </div>

      <div>
        <div>
          <label className="font-semibold">Character Level</label>
          <InfoTooltip text="Recommended level for the player character." />
        </div>

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className={selectClassName}
        >
          {LEVELS.map((lvl) => (
            <option key={lvl} value={lvl}>
              Level {lvl}
            </option>
          ))}
        </select>
      </div>

      <button
        className="bg-primary hover:bg-primary-hover inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
        onClick={onGenerate}
        disabled={loading}
      >
        {loading && (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        )}

        {loading ? "Generating..." : "Generate"}
      </button>
    </aside>
  );
}
