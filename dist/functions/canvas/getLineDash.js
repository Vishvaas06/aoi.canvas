"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../");
exports.default = new __1.AoiFunction({
    name: "$getLineDash",
    description: "Returns the line dash pattern used when stroking lines.",
    params: [
        {
            name: "canvas",
            description: "Name of the canvas to set the line dash in.",
            type: __1.ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof __1.CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found.",
            optional: true
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [name] = ctx.params;
        const canvas = name
            ? ctx.data.canvasManager?.get(name)
            : !name && ctx.data.canvas && ctx.data.canvas[ctx.data.canvas.length - 1] instanceof __1.CanvasBuilder
                ? ctx.data.canvas[ctx.data.canvas.length - 1] : null;
        if (!canvas)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to get the line dash from.");
        data.result = JSON.stringify(canvas.ctx.getLineDash());
        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});
//# sourceMappingURL=getLineDash.js.map