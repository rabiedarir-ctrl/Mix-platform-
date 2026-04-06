import CityWorld from "./cityWorld.js";
import PlayerFull from "../player/player_full.js";

export default class CityWorldFull {
    constructor(engine) {
        this.engine = engine;
        this.scene = engine.getScene();
        this.camera = engine.getCamera();

        this.city = new CityWorld(this.scene);

        this.player = new PlayerFull(this.camera, this.scene, {
            speed: 0.2,
            groundMesh: this.city.ground
        });

        this.engine.addUpdateFunction(() => this.update());
    }

    update() {
        this.city.update();
        this.player.update();
    }
}
