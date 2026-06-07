"use client";

import FieldError from "@/components/ui/FieldError";
import SelectField from "@/components/ui/SelectField";
import TextareaField from "@/components/ui/TextareaField";
import TextInput from "@/components/ui/TextInput";
import type {
  EncounterCheckField,
  EncounterCreatureField,
  EncounterPuzzleField,
  EncounterPuzzleListField,
  EncounterTextField,
} from "@/lib/storyFields";
import {
  encounterCheckTypes,
  encounterPuzzleTypes,
  type EncounterCheck,
  type EncounterCreature,
  type EncounterPuzzle,
  type ParsedEncounter,
} from "@/lib/types";

import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import SaveCancelBar from "./SaveCancelBar";

type EncounterCardProps = {
  encounterIndex: number;
  encounter: ParsedEncounter;
  draftEncounter?: ParsedEncounter;
  errors?: Partial<Record<EncounterTextField, string>>;
  fieldErrors: Record<string, string>;
  isEditing: boolean;
  getCheckErrorKey: (
    encounterIndex: number,
    checkIndex: number,
    field: EncounterCheckField,
  ) => string;
  getCreatureErrorKey: (
    encounterIndex: number,
    creatureIndex: number,
    field: EncounterCreatureField,
  ) => string;
  getPuzzleErrorKey: (
    encounterIndex: number,
    field: EncounterPuzzleField,
  ) => string;
  getPuzzleListErrorKey: (
    encounterIndex: number,
    field: EncounterPuzzleListField,
    itemIndex: number,
  ) => string;
  onStartEdit: () => void;
  onFieldChange: (field: EncounterTextField, value: string) => void;
  onCheckFieldChange: <K extends EncounterCheckField>(
    checkIndex: number,
    field: K,
    value: EncounterCheck[K],
  ) => void;
  onCreatureFieldChange: <K extends EncounterCreatureField>(
    creatureIndex: number,
    field: K,
    value: EncounterCreature[K],
  ) => void;
  onPuzzleFieldChange: <K extends EncounterPuzzleField>(
    field: K,
    value: EncounterPuzzle[K],
  ) => void;
  onPuzzleListItemChange: (
    field: EncounterPuzzleListField,
    itemIndex: number,
    value: string,
  ) => void;
  onDelete: () => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function EncounterCard({
  encounterIndex,
  encounter,
  draftEncounter,
  errors = {},
  fieldErrors,
  isEditing,
  getCheckErrorKey,
  getCreatureErrorKey,
  getPuzzleErrorKey,
  getPuzzleListErrorKey,
  onStartEdit,
  onFieldChange,
  onCheckFieldChange,
  onCreatureFieldChange,
  onPuzzleFieldChange,
  onPuzzleListItemChange,
  onDelete,
  onSave,
  onCancel,
}: EncounterCardProps) {
  const activeEncounter = draftEncounter ?? encounter;

  return (
    <div className="border-border bg-surface print-card group rounded border p-3">
      {isEditing ? (
        <div className="space-y-2">
          <TextInput
            value={activeEncounter.title}
            onChange={(event) => onFieldChange("title", event.target.value)}
            className="font-semibold"
            hasError={Boolean(errors.title)}
            placeholder="Encounter title"
            aria-invalid={Boolean(errors.title)}
          />
          <FieldError error={errors.title} />
          <TextareaField
            value={activeEncounter.content}
            onChange={(event) => onFieldChange("content", event.target.value)}
            hasError={Boolean(errors.content)}
            placeholder="Encounter description"
            aria-invalid={Boolean(errors.content)}
          />
          <FieldError error={errors.content} />

          <EditableChecks
            encounterIndex={encounterIndex}
            checks={activeEncounter.checks}
            fieldErrors={fieldErrors}
            getErrorKey={getCheckErrorKey}
            onFieldChange={onCheckFieldChange}
          />

          <EditableCreatures
            encounterIndex={encounterIndex}
            creatures={activeEncounter.creatures}
            fieldErrors={fieldErrors}
            getErrorKey={getCreatureErrorKey}
            onFieldChange={onCreatureFieldChange}
          />

          {activeEncounter.puzzle && (
            <EditablePuzzle
              encounterIndex={encounterIndex}
              puzzle={activeEncounter.puzzle}
              fieldErrors={fieldErrors}
              getErrorKey={getPuzzleErrorKey}
              getListErrorKey={getPuzzleListErrorKey}
              onFieldChange={onPuzzleFieldChange}
              onListItemChange={onPuzzleListItemChange}
            />
          )}

          <SaveCancelBar onSave={onSave} onCancel={onCancel} />
        </div>
      ) : (
        <>
          <div className="items-centre flex justify-between gap-3">
            <h4 className="font-semibold">{encounter.title}</h4>
            <div className="flex shrink-0 gap-1 transition">
              <EditButton onClick={onStartEdit} />
              <DeleteButton
                onClick={onDelete}
                confirmLabel="Delete encounter?"
              />
            </div>
          </div>
          <p className="whitespace-pre-line">{encounter.content}</p>
          <EncounterDetails encounter={encounter} />
        </>
      )}
    </div>
  );
}

function parseNumberInput(value: string) {
  if (value.trim() === "") {
    return Number.NaN;
  }

  return Number(value);
}

type EditableChecksProps = {
  encounterIndex: number;
  checks: EncounterCheck[];
  fieldErrors: Record<string, string>;
  getErrorKey: (
    encounterIndex: number,
    checkIndex: number,
    field: EncounterCheckField,
  ) => string;
  onFieldChange: <K extends EncounterCheckField>(
    checkIndex: number,
    field: K,
    value: EncounterCheck[K],
  ) => void;
};

function EditableChecks({
  encounterIndex,
  checks,
  fieldErrors,
  getErrorKey,
  onFieldChange,
}: EditableChecksProps) {
  if (checks.length === 0) return null;

  return (
    <div className="space-y-3">
      <h5 className="font-semibold">Checks</h5>
      {checks.map((check, checkIndex) => {
        const error = (field: EncounterCheckField) =>
          fieldErrors[getErrorKey(encounterIndex, checkIndex, field)];

        return (
          <div
            key={`${check.type}-${checkIndex}`}
            className="border-border space-y-2 rounded border p-3"
          >
            <p className="text-sm font-semibold">Check {checkIndex + 1}</p>
            <SelectField
              value={check.type}
              onChange={(event) =>
                onFieldChange(
                  checkIndex,
                  "type",
                  event.target.value as EncounterCheck["type"],
                )
              }
              hasError={Boolean(error("type"))}
              aria-invalid={Boolean(error("type"))}
            >
              {encounterCheckTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </SelectField>
            <FieldError error={error("type")} />

            <div className="grid gap-2 md:grid-cols-3">
              <div>
                <TextInput
                  value={check.ability}
                  onChange={(event) =>
                    onFieldChange(checkIndex, "ability", event.target.value)
                  }
                  hasError={Boolean(error("ability"))}
                  placeholder="Ability"
                  aria-invalid={Boolean(error("ability"))}
                />
                <FieldError error={error("ability")} />
              </div>
              <div>
                <TextInput
                  value={check.skillOrTool ?? ""}
                  onChange={(event) =>
                    onFieldChange(checkIndex, "skillOrTool", event.target.value)
                  }
                  hasError={Boolean(error("skillOrTool"))}
                  placeholder="Skill or tool"
                  aria-invalid={Boolean(error("skillOrTool"))}
                />
                <FieldError error={error("skillOrTool")} />
              </div>
              <div>
                <TextInput
                  type="number"
                  value={Number.isNaN(check.dc) ? "" : check.dc}
                  onChange={(event) =>
                    onFieldChange(
                      checkIndex,
                      "dc",
                      parseNumberInput(event.target.value),
                    )
                  }
                  hasError={Boolean(error("dc"))}
                  placeholder="DC"
                  aria-invalid={Boolean(error("dc"))}
                />
                <FieldError error={error("dc")} />
              </div>
            </div>

            <TextareaField
              value={check.purpose}
              onChange={(event) =>
                onFieldChange(checkIndex, "purpose", event.target.value)
              }
              hasError={Boolean(error("purpose"))}
              placeholder="Purpose"
              aria-invalid={Boolean(error("purpose"))}
            />
            <FieldError error={error("purpose")} />

            <TextareaField
              value={check.success}
              onChange={(event) =>
                onFieldChange(checkIndex, "success", event.target.value)
              }
              hasError={Boolean(error("success"))}
              placeholder="Success"
              aria-invalid={Boolean(error("success"))}
            />
            <FieldError error={error("success")} />

            <TextareaField
              value={check.failure}
              onChange={(event) =>
                onFieldChange(checkIndex, "failure", event.target.value)
              }
              hasError={Boolean(error("failure"))}
              placeholder="Failure"
              aria-invalid={Boolean(error("failure"))}
            />
            <FieldError error={error("failure")} />
          </div>
        );
      })}
    </div>
  );
}

type EditableCreaturesProps = {
  encounterIndex: number;
  creatures: EncounterCreature[];
  fieldErrors: Record<string, string>;
  getErrorKey: (
    encounterIndex: number,
    creatureIndex: number,
    field: EncounterCreatureField,
  ) => string;
  onFieldChange: <K extends EncounterCreatureField>(
    creatureIndex: number,
    field: K,
    value: EncounterCreature[K],
  ) => void;
};

function EditableCreatures({
  encounterIndex,
  creatures,
  fieldErrors,
  getErrorKey,
  onFieldChange,
}: EditableCreaturesProps) {
  if (creatures.length === 0) return null;

  return (
    <div className="space-y-3">
      <h5 className="font-semibold">Creatures / Stat Blocks</h5>
      {creatures.map((creature, creatureIndex) => {
        const error = (field: EncounterCreatureField) =>
          fieldErrors[getErrorKey(encounterIndex, creatureIndex, field)];

        return (
          <div
            key={`${creature.name}-${creatureIndex}`}
            className="border-border space-y-2 rounded border p-3"
          >
            <p className="text-sm font-semibold">
              Creature {creatureIndex + 1}
            </p>
            <div className="grid gap-2 md:grid-cols-[1fr_8rem]">
              <div>
                <TextInput
                  value={creature.name}
                  onChange={(event) =>
                    onFieldChange(creatureIndex, "name", event.target.value)
                  }
                  hasError={Boolean(error("name"))}
                  placeholder="Creature name"
                  aria-invalid={Boolean(error("name"))}
                />
                <FieldError error={error("name")} />
              </div>
              <div>
                <TextInput
                  type="number"
                  min={1}
                  value={
                    Number.isNaN(creature.quantity) ? "" : creature.quantity
                  }
                  onChange={(event) =>
                    onFieldChange(
                      creatureIndex,
                      "quantity",
                      parseNumberInput(event.target.value),
                    )
                  }
                  hasError={Boolean(error("quantity"))}
                  placeholder="Quantity"
                  aria-invalid={Boolean(error("quantity"))}
                />
                <FieldError error={error("quantity")} />
              </div>
            </div>

            <TextareaField
              value={creature.role}
              onChange={(event) =>
                onFieldChange(creatureIndex, "role", event.target.value)
              }
              hasError={Boolean(error("role"))}
              placeholder="Role"
              aria-invalid={Boolean(error("role"))}
            />
            <FieldError error={error("role")} />

            <TextareaField
              value={creature.combatTrigger}
              onChange={(event) =>
                onFieldChange(
                  creatureIndex,
                  "combatTrigger",
                  event.target.value,
                )
              }
              hasError={Boolean(error("combatTrigger"))}
              placeholder="Combat trigger"
              aria-invalid={Boolean(error("combatTrigger"))}
            />
            <FieldError error={error("combatTrigger")} />

            <TextareaField
              value={creature.goal}
              onChange={(event) =>
                onFieldChange(creatureIndex, "goal", event.target.value)
              }
              hasError={Boolean(error("goal"))}
              placeholder="Goal"
              aria-invalid={Boolean(error("goal"))}
            />
            <FieldError error={error("goal")} />
          </div>
        );
      })}
    </div>
  );
}

type EditablePuzzleProps = {
  encounterIndex: number;
  puzzle: EncounterPuzzle;
  fieldErrors: Record<string, string>;
  getErrorKey: (encounterIndex: number, field: EncounterPuzzleField) => string;
  getListErrorKey: (
    encounterIndex: number,
    field: EncounterPuzzleListField,
    itemIndex: number,
  ) => string;
  onFieldChange: <K extends EncounterPuzzleField>(
    field: K,
    value: EncounterPuzzle[K],
  ) => void;
  onListItemChange: (
    field: EncounterPuzzleListField,
    itemIndex: number,
    value: string,
  ) => void;
};

function EditablePuzzle({
  encounterIndex,
  puzzle,
  fieldErrors,
  getErrorKey,
  getListErrorKey,
  onFieldChange,
  onListItemChange,
}: EditablePuzzleProps) {
  const error = (field: EncounterPuzzleField) =>
    fieldErrors[getErrorKey(encounterIndex, field)];
  const listError = (field: EncounterPuzzleListField, itemIndex: number) =>
    fieldErrors[getListErrorKey(encounterIndex, field, itemIndex)];

  return (
    <div className="border-border space-y-2 rounded border p-3">
      <h5 className="font-semibold">Puzzle</h5>
      <SelectField
        value={puzzle.type}
        onChange={(event) =>
          onFieldChange("type", event.target.value as EncounterPuzzle["type"])
        }
        hasError={Boolean(error("type"))}
        aria-invalid={Boolean(error("type"))}
      >
        {encounterPuzzleTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </SelectField>
      <FieldError error={error("type")} />

      <TextareaField
        value={puzzle.prompt}
        onChange={(event) => onFieldChange("prompt", event.target.value)}
        hasError={Boolean(error("prompt"))}
        placeholder="Puzzle prompt"
        aria-invalid={Boolean(error("prompt"))}
      />
      <FieldError error={error("prompt")} />

      <TextareaField
        value={puzzle.answer}
        onChange={(event) => onFieldChange("answer", event.target.value)}
        hasError={Boolean(error("answer"))}
        placeholder="Puzzle answer"
        aria-invalid={Boolean(error("answer"))}
      />
      <FieldError error={error("answer")} />

      <EditablePuzzleList
        label="Hints"
        field="hints"
        values={puzzle.hints}
        getError={listError}
        onChange={onListItemChange}
      />

      <EditablePuzzleList
        label="Alternate Solutions"
        field="alternateSolutions"
        values={puzzle.alternateSolutions}
        getError={listError}
        onChange={onListItemChange}
      />
    </div>
  );
}

type EditablePuzzleListProps = {
  label: string;
  field: EncounterPuzzleListField;
  values: string[];
  getError: (field: EncounterPuzzleListField, itemIndex: number) => string;
  onChange: (
    field: EncounterPuzzleListField,
    itemIndex: number,
    value: string,
  ) => void;
};

function EditablePuzzleList({
  label,
  field,
  values,
  getError,
  onChange,
}: EditablePuzzleListProps) {
  if (values.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">{label}</p>
      {values.map((value, itemIndex) => {
        const error = getError(field, itemIndex);

        return (
          <div key={`${field}-${itemIndex}`}>
            <TextareaField
              value={value}
              onChange={(event) =>
                onChange(field, itemIndex, event.target.value)
              }
              hasError={Boolean(error)}
              placeholder={`${label} ${itemIndex + 1}`}
              aria-invalid={Boolean(error)}
            />
            <FieldError error={error} />
          </div>
        );
      })}
    </div>
  );
}

function EncounterDetails({ encounter }: { encounter: ParsedEncounter }) {
  const hasDetails =
    encounter.checks.length > 0 ||
    encounter.creatures.length > 0 ||
    encounter.puzzle !== null;

  if (!hasDetails) return null;

  return (
    <div className="mt-3 space-y-3 text-sm">
      {encounter.checks.length > 0 && (
        <div>
          <h5 className="font-semibold">Checks</h5>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            {encounter.checks.map((check, index) => {
              const label = [
                check.ability,
                check.skillOrTool ? `(${check.skillOrTool})` : null,
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <li key={`${check.type}-${index}`}>
                  <span className="font-medium">
                    {check.type}: {label} DC {check.dc}
                  </span>
                  <span> - {check.purpose}</span>
                  <br />
                  <span>Success: {check.success}</span>
                  <br />
                  <span>Failure: {check.failure}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {encounter.creatures.length > 0 && (
        <div>
          <h5 className="font-semibold">Creatures / Stat Blocks</h5>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            {encounter.creatures.map((creature, index) => (
              <li key={`${creature.name}-${index}`}>
                <span className="font-medium">
                  {creature.quantity} x {creature.name}
                </span>
                <span> - {creature.role}</span>
                <br />
                <span>Trigger: {creature.combatTrigger}</span>
                <br />
                <span>Goal: {creature.goal}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {encounter.puzzle && (
        <div>
          <h5 className="font-semibold">Puzzle</h5>
          <p className="mt-1 whitespace-pre-line">
            <span className="font-medium">{encounter.puzzle.type}: </span>
            {encounter.puzzle.prompt}
          </p>
          <p>
            <span className="font-medium">Answer: </span>
            {encounter.puzzle.answer}
          </p>
          <p>
            <span className="font-medium">Hints: </span>
            {encounter.puzzle.hints.join("; ")}
          </p>
          <p>
            <span className="font-medium">Alternate solutions: </span>
            {encounter.puzzle.alternateSolutions.join("; ")}
          </p>
        </div>
      )}
    </div>
  );
}
