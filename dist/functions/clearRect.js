"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../classes");
exports.default = {
    name: "$clearRect",
    info: {
        description: "Erases pixels in a rect area.",
        parameters: [
            {
                name: "canvas",
                description: "The canvas name.",
                type: "string",
                required: true
            },
            {
                name: "x",
                description: "The rect X position.",
                type: "number",
                required: false
            },
            {
                name: "y",
                description: "The rect Y position.",
                type: "number",
                required: false
            },
            {
                name: "width",
                description: "The rect width.",
                type: "number",
                required: true
            },
            {
                name: "height",
                description: "The rect height.",
                type: "number",
                required: true
            },
            {
                name: "radius",
                description: "The rect corners radius.",
                type: "number",
                required: false
            }
        ],
        examples: [
        /*{
            description: "This will create new 512x512 canvas with red rect.",
            code: `$attachCanvas[mycanvas;red.png]
                   $fillRect[mycanvas;#FF0000;0;0;512;512]
                   $createCanvas[mycanvas;512;512]`?.split("\n").map(x => x?.trim()).join("\n"),
            images: []
        }*/
        ]
    },
    code: async (d) => {
        let data = d.util.aoiFunc(d);
        let [canvas = "canvas", x = "0", y = "0", width, height, radius] = data.inside.splits;
        if (!d.data.canvases || !(d.data.canvases instanceof classes_1.CanvasManager) || !d.data.canvases.get(canvas) || !(d.data.canvases.get(canvas) instanceof classes_1.CanvasBuilder))
            return d.aoiError.fnError(d, "custom", {}, `No canvas with provided name found.`);
        d.data.canvases.get(canvas)?.clearRect(x, y, width, height(radius?.trim()?.startsWith("[") && radius?.trim().endsWith("]") ? JSON.parse(radius) : parseFloat(radius)));
        return {
            code: d.util.setCode(data),
            data: d.data
        };
    }
};
//# sourceMappingURL=clearRect.js.map