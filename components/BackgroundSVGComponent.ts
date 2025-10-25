import { Locator } from '@playwright/test';

export class BackgroundSVGComponent {
    readonly self: Locator;

    // ---- Background
    readonly svgShapeBG: Locator;

    // ---- SVG Shapes
    readonly svgShapeOutTop: Locator;
    readonly svgShapeInTop: Locator;
    readonly svgShapeOutBottom: Locator;
    readonly svgShapeInBottom: Locator;

    constructor(self: Locator) {
        this.self = self;

        this.svgShapeBG = this.self.locator('#svg-bg');
        this.svgShapeOutTop = this.svgShapeBG.locator('> path.out-top');
        this.svgShapeInTop = this.svgShapeBG.locator('> path.in-top');
        this.svgShapeOutBottom = this.svgShapeBG.locator('> path.out-bottom');
        this.svgShapeInBottom = this.svgShapeBG.locator('> path.in-bottom');
    }
}