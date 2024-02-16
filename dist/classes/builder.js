"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasBuilder = exports.Filters = void 0;
const canvas_1 = require("@napi-rs/canvas");
const util_1 = require("./util");
// Stuff
exports.Filters = ["none", "blur", "sepia", "grayscale", "brightness", "contrast", "invert", "saturate"];
// Builder
class CanvasBuilder {
    static ctx;
    static gradients;
    util = util_1.CanvasUtil;
    constructor(width, height) {
        CanvasBuilder.ctx = (0, canvas_1.createCanvas)(width, height).getContext("2d");
        CanvasBuilder.gradients = new Map();
    }
    drawImage = async (image, x, y, width, height, radius) => {
        image = await (0, canvas_1.loadImage)(image);
        width ??= image.width;
        height ??= image.height;
        const ctx = CanvasBuilder.ctx;
        if (radius && !Array.isArray(radius) && radius > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.arcTo(x + width, y, x + width, y + height, radius);
            ctx.arcTo(x + width, y + height, x, y + height, radius);
            ctx.arcTo(x, y + height, x, y, radius);
            ctx.arcTo(x, y, x + width, y, radius);
            ctx.closePath();
            ctx.clip();
        }
        else if (radius && Array.isArray(radius)) {
            const [lTop = 0, rTop = 0, lBottom = 0, rBottom = 0] = radius;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x + lTop, y);
            ctx.arcTo(x + width, y, x + width, y + height, rTop);
            ctx.arcTo(x + width, y + height, x, y + height, rBottom);
            ctx.arcTo(x, y + height, x, y, lBottom);
            ctx.arcTo(x, y, x + width, y, lTop);
            ctx.closePath();
            ctx.clip();
        }
        ;
        ctx.drawImage(image, x, y, width, height);
        return;
    };
    fillText = (text, x, y, font, color, maxWidth, textAlign, textBaseline) => {
        const ctx = CanvasBuilder.ctx;
        const oldfont = ctx.font;
        const oldcolor = ctx.fillStyle;
        const oldalign = ctx.textAlign;
        const oldbaseline = ctx.textBaseline;
        if (typeof color === "string" && color?.trim()?.startsWith("gradient:"))
            color = this.getGradient(color?.trim().split(":").slice(1).join(":")) ?? color;
        ctx.font = font;
        ctx.fillStyle = color;
        if (textAlign)
            this.setTextAlign(textAlign);
        if (textBaseline)
            ctx.textBaseline = textBaseline;
        ctx.fillText(text, x, y, maxWidth);
        ctx.font = oldfont;
        ctx.fillStyle = oldcolor;
        ctx.textAlign = oldalign;
        ctx.textBaseline = oldbaseline;
        return;
    };
    strokeText = (text, x, y, font, color, lineWidth, maxWidth, textAlign, textBaseline) => {
        const ctx = CanvasBuilder.ctx;
        const oldfont = ctx.font;
        const oldcolor = ctx.strokeStyle;
        const oldwidth = ctx.lineWidth;
        const oldalign = ctx.textAlign;
        const oldbaseline = ctx.textBaseline;
        if (typeof color === "string" && color?.trim()?.startsWith("gradient:"))
            color = this.getGradient(color?.trim().split(":").slice(1).join(":")) ?? color;
        ctx.font = font;
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth ?? 10;
        if (textAlign)
            this.setTextAlign(textAlign);
        if (textBaseline)
            ctx.textBaseline = textBaseline;
        ctx.strokeText(text, x, y, maxWidth);
        ctx.font = oldfont;
        ctx.strokeStyle = oldcolor;
        ctx.lineWidth = oldwidth;
        ctx.textAlign = oldalign;
        ctx.textBaseline = oldbaseline;
        return;
    };
    fillRect = (color, x, y, width, height, radius) => {
        const ctx = CanvasBuilder.ctx;
        width ??= ctx.canvas.width;
        height ??= ctx.canvas.height;
        const oldcolor = ctx.fillStyle;
        if (typeof color === "string" && color?.trim()?.startsWith("gradient:"))
            color = this.getGradient(color?.trim().split(":").slice(1).join(":")) ?? color;
        ctx.fillStyle = color;
        if (radius) {
            ctx.beginPath();
            ctx.roundRect(x, y, width, height, radius);
            ctx.closePath();
            ctx.fill();
        }
        else
            ctx.fillRect(x, y, width, height);
        ctx.fillStyle = oldcolor;
        return;
    };
    strokeRect = (color, x, y, width, height, strokeWidth, radius) => {
        const ctx = CanvasBuilder.ctx;
        width ??= ctx.canvas.width;
        height ??= ctx.canvas.height;
        const oldcolor = ctx.strokeStyle;
        const oldwidth = ctx.lineWidth;
        if (typeof color === "string" && color?.trim()?.startsWith("gradient:"))
            color = this.getGradient(color?.trim().split(":").slice(1).join(":")) ?? color;
        ctx.strokeStyle = color;
        ctx.lineWidth = strokeWidth ?? 10;
        if (radius) {
            ctx.beginPath();
            ctx.roundRect(x, y, width, height, radius);
            ctx.closePath();
            ctx.stroke();
        }
        else
            ctx.strokeRect(x, y, width, height);
        ctx.strokeStyle = oldcolor;
        ctx.lineWidth = oldwidth;
        return;
    };
    clearRect = (x, y, width, height, radius) => {
        const ctx = CanvasBuilder.ctx;
        width ??= ctx.canvas.width;
        height ??= ctx.canvas.height;
        if (radius && !Array.isArray(radius) && radius > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.arcTo(x + width, y, x + width, y + height, radius);
            ctx.arcTo(x + width, y + height, x, y + height, radius);
            ctx.arcTo(x, y + height, x, y, radius);
            ctx.arcTo(x, y, x + width, y, radius);
            ctx.closePath();
            ctx.clip();
        }
        else if (radius && Array.isArray(radius)) {
            const [lTop = 0, rTop = 0, lBottom = 0, rBottom = 0] = radius;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x + lTop, y);
            ctx.arcTo(x + width, y, x + width, y + height, rTop);
            ctx.arcTo(x + width, y + height, x, y + height, rBottom);
            ctx.arcTo(x, y + height, x, y, lBottom);
            ctx.arcTo(x, y, x + width, y, lTop);
            ctx.closePath();
            ctx.clip();
        }
        ;
        ctx.clearRect(x, y, width, height);
        return;
    };
    drawLines = (type, color, startX, startY, lines, strokeWidth) => {
        const ctx = CanvasBuilder.ctx;
        if (typeof color === "string" && color?.trim()?.startsWith("gradient:"))
            color = this.getGradient(color?.trim().split(":").slice(1).join(":")) ?? color;
        const drawlines = () => {
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            for (var line of lines) {
                line = line?.trim();
                const split = line?.split(":")?.map(x => !isNaN(parseFloat(x)) ? parseFloat(x) : 0);
                if (line?.startsWith("move:"))
                    ctx.moveTo(split[1], split[2]);
                else if (line?.startsWith("bezier:"))
                    ctx.bezierCurveTo(split[1], split[2], split[3], split[4], split[5], split[6]);
                else if (line?.startsWith("quadric:"))
                    ctx.quadraticCurveTo(split[1], split[2], split[3], split[4]);
                else
                    ctx.lineTo(split[0], split[1]);
            }
            ctx.closePath();
        };
        if (type === 0) {
            const oldcolor = ctx.strokeStyle;
            ctx.fillStyle = color;
            drawlines();
            ctx.fill();
            ctx.fillStyle = oldcolor;
        }
        else if (type === 1) {
            const oldcolor = ctx.strokeStyle;
            const oldwidth = ctx.lineWidth;
            ctx.strokeStyle = color;
            ctx.lineWidth = strokeWidth ?? 10;
            drawlines();
            ctx.stroke();
            ctx.strokeStyle = oldcolor;
            ctx.lineWidth = oldwidth;
        }
        return;
    };
    measureText = (text, font) => {
        const ctx = CanvasBuilder.ctx;
        const oldcolor = ctx.fillStyle;
        const oldfont = ctx.font;
        ctx.fillStyle = "#000000";
        ctx.font = font;
        const res = ctx.measureText(text);
        ctx.fillStyle = oldcolor;
        ctx.font = oldfont;
        return res;
    };
    setTextAlign = (align) => {
        const ctx = CanvasBuilder.ctx;
        const aligns = {
            start: "end",
            right: "left",
            center: "center",
            left: "right",
            end: "start"
        };
        if (aligns[align])
            ctx.textAlign = align;
        return;
    };
    filter = (method, name, value) => {
        const ctx = CanvasBuilder.ctx;
        if (name && !exports.Filters.find(x => x === name))
            return;
        if (value && isNaN(value))
            return;
        if (method === "add") {
            if (!name || !value)
                return;
            const PxOrPerc = name === "grayscale" || name === "sepia" ? "%" :
                (name === "blur" ? "px" : "");
            ctx.filter = this.util.parseFilters((ctx.filter === "none" ? "" : ctx.filter) + `${name}(${value + PxOrPerc})`)?.map(x => x?.raw)?.join(" ")?.trim();
        }
        else if (method === "set") {
            if (!name || !value)
                return;
            const PxOrPerc = name === "grayscale" || name === "sepia" ? "%" :
                (name === "blur" ? "px" : "");
            ctx.filter = `${name}(${value + PxOrPerc})`;
        }
        else if (method === "remove") {
            if (!name)
                return;
            let filters = this.util.parseFilters(ctx.filter);
            const index = filters.findIndex((obj) => obj?.filter === name);
            if (index !== -1)
                filters.splice(index, 1);
            ctx.filter = filters.length > 0 ? filters?.map(x => x?.raw)?.join(" ")?.trim() : "none";
        }
        else if (method === "clear")
            ctx.filter = "none";
        else if (method === "get")
            return ctx.filter;
        else if (method === "parse")
            return this.util.parseFilters(ctx.filter);
        return;
    };
    createGradient = (name, type, options) => {
        const ctx = CanvasBuilder.ctx;
        let gradient;
        if (type === 0) {
            if (typeof options[0] !== "number" || typeof options[1] !== "number" || typeof options[2] !== "number" || typeof options[3] !== "number")
                return;
            gradient = ctx.createLinearGradient(options[0], options[1], options[2], options[3]);
        }
        else if (type === 1) {
            if (typeof options[0] !== "number" || typeof options[1] !== "number" || typeof options[2] !== "number" || typeof options[3] !== "number" || typeof options[4] !== "number" || typeof options[5] !== "number")
                return;
            gradient = ctx.createRadialGradient(options[0], options[1], options[2], options[3], options[4], options[5]);
        }
        else if (type === 2) {
            if (typeof options[0] !== "number" || typeof options[1] !== "number" || typeof options[2] !== "number")
                return;
            gradient = ctx.createConicGradient(options[0], options[1], options[2]);
        }
        if (gradient)
            CanvasBuilder.gradients.set(name, gradient);
        return;
    };
    addColorStop = (gradient, offset, color) => {
        if (!CanvasBuilder.gradients.has(gradient))
            return;
        CanvasBuilder.gradients.get(gradient)?.addColorStop(offset, color);
        return;
    };
    setShadow = (blur, color, offset) => {
        const ctx = CanvasBuilder.ctx;
        ctx.shadowBlur = blur;
        ctx.shadowColor = color;
        if (offset && !Array.isArray(offset)) {
            ctx.shadowOffsetX = offset;
            ctx.shadowOffsetY = offset;
        }
        else if (offset && Array.isArray(offset)) {
            const [x = 0, y = 0] = offset;
            ctx.shadowOffsetX = x;
            ctx.shadowOffsetY = y;
        }
        ;
        return;
    };
    rotate = (angle) => {
        const ctx = CanvasBuilder.ctx;
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.translate(-centerX, -centerY);
        return;
    };
    trim = () => {
        let ctx = CanvasBuilder.ctx, canvas = ctx.canvas, pixels = ctx.getImageData(0, 0, canvas.width, canvas.height), l = pixels.data.length, i, bound = {
            top: canvas.height,
            left: canvas.width,
            right: 0,
            bottom: 0
        }, x, y;
        for (i = 0; i < l; i += 4) {
            if (pixels.data[i + 3] === 0)
                continue;
            x = (i / 4) % canvas.width;
            y = Math.floor((i / 4) / canvas.width);
            if (x < bound.left)
                bound.left = x;
            if (y < bound.top)
                bound.top = y;
            if (y > bound.bottom)
                bound.bottom = y;
            if (x > bound.right)
                bound.right = x;
        }
        const height = bound.bottom - bound.top + 1;
        const width = bound.right - bound.left + 1;
        const trimmed = ctx.getImageData(bound.left, bound.top, width, height);
        canvas.width = width;
        canvas.height = height;
        ctx.putImageData(trimmed, 0, 0);
    };
    getContext = () => CanvasBuilder.ctx;
    getGradient = (name) => CanvasBuilder.gradients.get(name);
    render = () => {
        return CanvasBuilder.ctx.canvas.toBuffer("image/png");
    };
}
exports.CanvasBuilder = CanvasBuilder;
//# sourceMappingURL=builder.js.map