export const USE_MOCK = false;

export const MOCK_RESULT = JSON.stringify({
  title: "Test Adventure",
  setting: "Test setting text.",
  background: "Test background text.",
  adventureHook: "Test hook text.",
  mainQuest: "Test quest text.",
  encounters: [
    {
      title: "Encounter 1: Test Encounter",
      content: "Test encounter content.",
    },
    {
      title: "Encounter 2: Final Test Encounter",
      content: "Test final encounter content.",
    },
  ],
  npcs: [
    {
      name: "Test NPC",
      race: "Human",
      class: "Fighter",
      role: "Test role",
      location: "Test location",
      motivation: "Test motivation",
      description: "Test description",
    },
  ],
});
