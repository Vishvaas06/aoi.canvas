"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../");
exports.default = new __1.AoiFunction({
    name: "$fillRect",
    description: "Draws a filled rectangle.",
    params: [
        {
            name: "canvas",
            description: "The canvas name to draw rect on.",
            type: __1.ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof __1.CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found.",
            optional: true
        },
        {
            name: "x",
            description: "The rect start X coordinate.",
            type: __1.ParamType.Number
        },
        {
            name: "y",
            description: "The rect start Y coordinate.",
            type: __1.ParamType.Number
        },
        {
            name: "width",
            description: "The rect width.",
            type: __1.ParamType.Number
        },
        {
            name: "height",
            description: "The rect height.",
            type: __1.ParamType.Number
        },
        {
            name: "radius",
            description: "The rect corners radius.",
            type: __1.ParamType.Number,
            check: (x) => !!(x >= 0),
            rest: true,
            optional: true
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [name, x, y, width, height, radius] = ctx.params;
        const canvas = name
            ? ctx.data.canvasManager?.get(name)
            : !name && ctx.data.canvas && ctx.data.canvas[ctx.data.canvas.length - 1] instanceof __1.CanvasBuilder
                ? ctx.data.canvas[ctx.data.canvas.length - 1] : null;
        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to draw a filled rectangle on.");
        await canvas.rect(__1.FillOrStrokeOrClear.fill, x, y, width, height, radius && radius.length === 1 ? radius[0] : radius);
        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});
//# sourceMappingURL=fillRect.js.map