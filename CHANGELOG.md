# CHANGELOG

## 1.0.0

- Initial release. The `Dataview` declarations moved here, with their history, from `@mnaoumov/obsidian-lib`, where they were published as `@mnaoumov/obsidian-lib/@types/dataview/*`. Drop the `@types/dataview` prefix to switch: `@mnaoumov/obsidian-lib/@types/dataview/api/inline-api` becomes `@mnaoumov/obsidian-dataview/api/inline-api`
- The declarations track `Dataview` 0.5.68
- `getAPI` and `isPluginEnabled` are implemented, as upstream's `obsidian-dataview` implements them
- `Fields.object`, `DefaultFunctions.object`, `number`, `string` and `any` are spelled as `Dataview` exports them; the obsidian-lib copy had a `$` prefix on each
