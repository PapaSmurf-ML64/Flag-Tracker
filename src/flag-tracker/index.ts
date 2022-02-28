import { EventHandler } from 'modloader64_api/EventHandler';
import { IModLoaderAPI, IPlugin } from 'modloader64_api/IModLoaderAPI';
import { IZ64Main } from 'Z64Lib/API/Common/IZ64Main';
import { Z64 } from 'Z64Lib/API/imports';
import { parseFlagChanges } from './parseFlagChanges';
import { InjectCore } from 'modloader64_api/CoreInjection';
export default class checkFlags implements IPlugin{

    ModLoader!: IModLoaderAPI;

	flags: Map<string, Buffer> = new Map();

	@InjectCore() core!: IZ64Main;

    preinit(): void {
    }

    init(): void {
    }

    postinit(): void {
    }

    onTick(frame?: number): void {
        if (this.flags.size === 0) return;

        let scenes = this.core.OOT!.save.permSceneData;
        let events = this.core.OOT!.save.eventFlags;
        let inf = this.core.OOT!.save.infTable;
        let item = this.core.OOT!.save.itemFlags;
        let skulls = this.core.OOT!.save.skulltulaFlags;

        let scenes_diff = parseFlagChanges(scenes, this.flags.get("scenes")!);
        let events_diff = parseFlagChanges(events, this.flags.get("events")!);
        let inf_diff = parseFlagChanges(inf, this.flags.get("inf")!);
        let item_diff = parseFlagChanges(item, this.flags.get("item")!);
        let skulls_diff = parseFlagChanges(skulls, this.flags.get("skulls")!);

        if (Object.keys(scenes_diff).length > 0){
            this.ModLoader.logger.info("Scenes: " + JSON.stringify(scenes_diff));
        }
        if (Object.keys(events_diff).length > 0){
            this.ModLoader.logger.info("Events: " + JSON.stringify(events_diff));
        }
        if (Object.keys(inf_diff).length > 0){
            this.ModLoader.logger.info("InfTable: " + JSON.stringify(inf_diff));
        }
        if (Object.keys(item_diff).length > 0){
            this.ModLoader.logger.info("Item: " + JSON.stringify(item_diff));
        }
        if (Object.keys(skulls_diff).length > 0){
            this.ModLoader.logger.info("Skulls: " + JSON.stringify(skulls_diff));
        }
    }

    @EventHandler(Z64.OotEvents.ON_SCENE_CHANGE)
    onSceneChange(scene: number){
        if (this.flags.size === 0){
            this.flags.set("scenes", this.core.OOT!.save.permSceneData);
            this.flags.set("events", this.core.OOT!.save.eventFlags);
            this.flags.set("inf", this.core.OOT!.save.infTable);
            this.flags.set("item", this.core.OOT!.save.itemFlags);
            this.flags.set("skulls", this.core.OOT!.save.skulltulaFlags);
        }
    }

}