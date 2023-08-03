export const DEFAULT_EVENT_NAME = "complete";

export const DEFAULT_MANIFEST = [
  // background
  { src: "bg/river.png", id: "river" },
  { src: "bg/land.png", id: "land" },
  { src: "bg/start_line.png", id: "start_line" },
  { src: "bg/start_line.png", id: "end_line" },
  // others
  { src: "box_name.png", id: "box_name" },
  // characters
  { src: "characters/default.png", id: "duck1" },
  { src: "characters/normal.png", id: "duck2" },
  { src: "characters/daredevil.png", id: "duck3" },
  { src: "characters/green.png", id: "duck4" },
  { src: "characters/lgbt.png", id: "duck5" },
  { src: "characters/pikachu.png", id: "duck6" },
  { src: "characters/red.png", id: "duck7" },
  { src: "characters/theif.png", id: "duck8" },
  { src: "characters/warrior.png", id: "duck9" },
  { src: "characters/wizard.png", id: "duck10" },
  { src: "characters/clown.png", id: "duck11" },
];

export const DEFAULT_MANIFEST_PATH = "./assets/img/manifest/";

export const DEFAULT_LOAD_MANIFEST_PARAMS = [
  DEFAULT_MANIFEST,
  true,
  DEFAULT_MANIFEST_PATH
];

export function useLoader(
  eventHandler,
  eventName = DEFAULT_EVENT_NAME,
  loadManifestParams = DEFAULT_LOAD_MANIFEST_PARAMS,
) {
  const loader = new createjs.LoadQueue(false, null, true);
  loader.addEventListener(eventName, eventHandler);
  loader.loadManifest(...loadManifestParams);

  return loader;
}