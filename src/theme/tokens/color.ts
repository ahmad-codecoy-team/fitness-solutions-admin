import { rgbAlpha } from "@/utils/theme";
import { ThemeColorPresets } from "#/enum";

export const presetsColors = {
	[ThemeColorPresets.Default]: {
		lighter: "#a3d8f4",
		light: "#85b1c7",
		default: "#5942d9",
		dark: "#4a37b8",
		darker: "#3b2c96",
	},
	[ThemeColorPresets.Cyan]: {
		lighter: "#CCF4FE",
		light: "#68CDF9",
		default: "#078DEE",
		dark: "#0351AB",
		darker: "#012972",
	},
	[ThemeColorPresets.Purple]: {
		lighter: "#EBD6FD",
		light: "#B985F4",
		default: "#7635DC",
		dark: "#431A9E",
		darker: "#200A69",
	},
	[ThemeColorPresets.Blue]: {
		lighter: "#D1E9FC",
		light: "#76B0F1",
		default: "#2065D1",
		dark: "#103996",
		darker: "#061B64",
	},
	[ThemeColorPresets.Orange]: {
		lighter: "#FEF4D4",
		light: "#FED680",
		default: "#FDA92D",
		dark: "#B66816",
		darker: "#793908",
	},
	[ThemeColorPresets.Red]: {
		lighter: "#FFE3D5",
		light: "#FF9882",
		default: "#FF3030",
		dark: "#B71833",
		darker: "#7A0930",
	},
};

/**
 * We recommend picking colors with these values for [Eva Color Design](https://colors.eva.design/):
 *  + lighter : 100
 *  + light : 300
 *  + main : 500
 *  + dark : 700
 *  + darker : 900
 */
export const paletteColors = {
	primary: presetsColors[ThemeColorPresets.Blue],
	success: {
		lighter: "#d4f7dc",
		light: "#95d9a9",
		default: "#95d9a9",
		dark: "#7bc294",
		darker: "#62ab7f",
	},
	warning: {
		lighter: "#ffead9",
		light: "#ffb97a",
		default: "#ffb97a",
		dark: "#e6a66d",
		darker: "#cc9460",
	},
	error: {
		lighter: "#ffebee",
		light: "#ff7b92",
		default: "#ff7b92",
		dark: "#e66d83",
		darker: "#cc5f74",
	},
	info: {
		lighter: "#CAFDF5",
		light: "#61F3F3",
		default: "#00B8D9",
		dark: "#006C9C",
		darker: "#003768",
	},
	gray: {
		"100": "#F9FAFB",
		"200": "#F4F6F8",
		"300": "#DFE3E8",
		"400": "#C4CDD5",
		"500": "#919EAB",
		"600": "#637381",
		"700": "#454F5B",
		"800": "#1C252E",
		"900": "#141A21",
	},
};

export const commonColors = {
	white: "#FFFFFF",
	black: "#09090B",
};

export const actionColors = {
	hover: rgbAlpha(paletteColors.gray[500], 0.1),
	selected: rgbAlpha(paletteColors.gray[500], 0.1),
	focus: rgbAlpha(paletteColors.gray[500], 0.12),
	disabled: rgbAlpha(paletteColors.gray[500], 0.48),
	active: rgbAlpha(paletteColors.gray[500], 1),
};

export const lightColorTokens = {
	palette: paletteColors,
	common: commonColors,
	action: actionColors,
	text: {
		primary: "#0f1724",
		secondary: "#8b95a1",
		disabled: paletteColors.gray[500],
	},
	background: {
		default: "#f9fafa",
		paper: "#f9fafa",
		neutral: paletteColors.gray[200],
	},
};

export const darkColorTokens = {
	palette: paletteColors,
	common: commonColors,
	action: actionColors,
	text: {
		primary: commonColors.white,
		secondary: paletteColors.gray[500],
		disabled: paletteColors.gray[600],
	},
	background: {
		default: commonColors.black,
		paper: commonColors.black,
		neutral: "#27272A",
	},
};
