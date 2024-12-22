interface ColorStop {
    offset: number;
    color: string;
    opacity?: number;
}

interface FabricGradient {
    type: 'linear';
    colorStops: ColorStop[];
}

interface CustomGradient {
    type: 'gradient';
    stops: ColorStop[];
}

type GradientColor = FabricGradient | CustomGradient;
type Color = string | GradientColor;

export function isFabricGradient(color: any): color is FabricGradient {
    return color?.type === 'linear' && Array.isArray(color.colorStops);
}

export function isCustomGradient(color: any): color is CustomGradient {
    return color?.type === 'gradient' && Array.isArray(color.stops);
}


export function isGradientColor(color: any): color is GradientColor {
    return isFabricGradient(color) || isCustomGradient(color);
}