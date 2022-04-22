import * as I from './';

/**
 * !COLORS TAKEN FROM!
 * https://en.wikipedia.org/wiki/List_of_Crayola_crayon_colors
 */

export const alltime = {
    "Red": "#ed0a3f",
    "Maroon": "#c32148",
    "Scarlet": "#fd0e35",
    "Brick Red": "#c62d42",
    "English Vermilion": "#cc474b",
    "Madder Lake": "#cc3336",
    "Permanent Geranium Lake": "#e12c2c",
    "Maximum Red": "#d92121",
    "Chestnut": "#b94e48",
    "Orange-Red": "#ff5349",
    "Sunset Orange": "#fe4c40",
    "Bittersweet": "#fe6f5e",
    "Dark Venetian Red": "#b33b24",
    "Venetian Red": "#cc553d",
    "Light Venetian Red": "#e6735c",
    "Vivid Tangerine": "#ff9980",
    "Middle Red": "#e58e73",
    "Burnt Orange": "#ff7034",
    "Red-Orange": "#ff681f",
    "Orange": "#ff8833",
    "Macaroni and Cheese": "#ffb97b",
    "Middle Yellow Red": "#ecac76",
    "Mango Tango": "#e77200",
    "Yellow-Orange": "#ffae42",
    "Maximum Yellow Red": "#f2ba49",
    "Banana Mania": "#fbe7b2",
    "Maize": "#f2c649",
    "Orange-Yellow": "#f8d568",
    "Goldenrod": "#fcd667",
    "Dandelion": "#fed85d",
    "Yellow": "#fbe870",
    "Green-Yellow": "#f1e788",
    "Middle Yellow": "#ffeb00",
    "Olive Green": "#b5b35c",
    "Spring Green": "#ecebbd",
    "Maximum Yellow": "#fafa37",
    "Canary": "#ffff99",
    "Lemon Yellow": "#ffff9f",
    "Maximum Green Yellow": "#d9e650",
    "Middle Green Yellow": "#acbf60",
    "Inchworm": "#afe313",
    "Light Chrome Green": "#bee64b",
    "Yellow-Green": "#c5e17a",
    "Maximum Green": "#5e8c31",
    "Asparagus": "#7ba05b",
    "Granny Smith Apple": "#9de093",
    "Fern": "#63b76c",
    "Middle Green": "#4d8c57",
    "Green": "#01a638",
    "Medium Chrome Green": "#6ca67c",
    "Forest Green": "#5fa777",
    "Sea Green": "#93dfb8",
    "Shamrock": "#33cc99",
    "Mountain Meadow": "#1ab385",
    "Jungle Green": "#29ab87",
    "Caribbean Green": "#00cc99",
    "Tropical Rain Forest": "#00755e",
    "Middle Blue Green": "#8dd9cc",
    "Pine Green": "#01796f",
    "Maximum Blue Green": "#30bfbf",
    "Robin's Egg Blue": "#00cccc",
    "Teal Blue": "#008080",
    "Light Blue": "#8fd8d8",
    "Aquamarine": "#95e0e8",
    "Turquoise Blue": "#6cdae7",
    "Outer Space": "#2d383a",
    "Sky Blue": "#76d7ea",
    "Middle Blue": "#7ed4e6",
    "Blue-Green": "#0095b7",
    "Blue Ribbon": "#0B10A2",
    "Pacific Blue": "#009dc4",
    "Cerulean": "#02a4d3",
    "Maximum Blue": "#47abcc",
    "Blue (I)": "#2eb4e6",
    "Cerulean Blue": "#339acc",
    "Cornflower": "#93ccea",
    "Green-Blue": "#2887c8",
    "Midnight Blue": "#003366",
    "Navy Blue": "#0066cc",
    "Denim": "#1560bd",
    "Blue (III)": "#0066ff",
    "Cadet Blue": "#a9b2c3",
    "Periwinkle": "#c3cde6",
    "Blue (II)": "#4570e6",
    "Bluetiful": "#3c69e7",
    "Wild Blue Yonder": "#7a89b8",
    "Indigo": "#4f69c6",
    "Manatee": "#8d90a1",
    "Cobalt Blue": "#8c90c8",
    "Celestial Blue": "#7070cc",
    "Blue Bell": "#9999cc",
    "Maximum Blue Purple": "#acace6",
    "Violet-Blue": "#766ec8",
    "Blue-Violet": "#6456b7",
    "Ultramarine Blue": "#3f26bf",
    "Middle Blue Purple": "#8b72be",
    "Purple Heart": "#652dc1",
    "Royal Purple": "#6b3fa0",
    "Violet (II)": "#8359a3",
    "Medium Violet": "#8f47b3",
    "Wisteria": "#c9a0dc",
    "Lavender (I)": "#bf8fcc",
    "Vivid Violet": "#803790",
    "Maximum Purple": "#733380",
    "Purple Mountains' Majesty": "#d6aedd",
    "Fuchsia": "#c154c1",
    "Pink Flamingo": "#fc74fd",
    "Violet (I)": "#732e6c",
    "Brilliant Rose": "#e667ce",
    "Orchid": "#e29cd2",
    "Plum": "#8e3179",
    "Medium Rose": "#d96cbe",
    "Thistle": "#d8bfd8",
    "Mulberry": "#c8509b",
    "Red-Violet": "#bb3385",
    "Middle Purple": "#d982b5",
    "Maximum Red Purple": "#a63a79",
    "Jazzberry Jam": "#a50b5e",
    "Eggplant": "#614051",
    "Magenta": "#f653a6",
    "Cerise": "#da3287",
    "Wild Strawberry": "#ff3399",
    "Lavender (II)": "#fbaed2",
    "Cotton Candy": "#ffb7d5",
    "Carnation Pink": "#ffa6c9",
    "Violet-Red": "#f7468a",
    "Razzmatazz": "#e30b5c",
    "Piggy Pink": "#fdd7e4",
    "Carmine": "#e62e6b",
    "Blush": "#db5079",
    "Tickle Me Pink": "#fc80a5",
    "Mauvelous": "#f091a9",
    "Salmon": "#ff91a4",
    "Middle Red Purple": "#a55353",
    "Mahogany": "#ca3435",
    "Melon": "#febaad",
    "Pink Sherbert": "#f7a38e",
    "Burnt Sienna": "#e97451",
    "Brown": "#af593e",
    "Sepia": "#9e5b40",
    "Fuzzy Wuzzy": "#87421f",
    "Beaver": "#926f5b",
    "Tumbleweed": "#dea681",
    "Raw Sienna": "#d27d46",
    "Van Dyke Brown": "#664228",
    "Tan": "#fa9d5a",
    "Desert Sand": "#edc9af",
    "Peach": "#ffcba4",
    "Burnt Umber": "#805533",
    "Apricot": "#fdd5b1",
    "Almond": "#eed9c4",
    "Raw Umber": "#665233",
    "Shadow": "#837050",
    "Raw Sienna (I)": "#e6bc5c",
    "Gold (I)": "#92926e",
    "Gold (II)": "#e6be8a",
    "Silver": "#c9c0bb",
    "Copper": "#da8a67",
    "Antique Brass": "#c88a65",
    "Black": "#000000",
    "Charcoal Gray": "#736a62",
    "Gray": "#8b8680",
    "Blue-Gray": "#c8c8cd",
    "Timberwolf": "#d9d6cf",
    "White": "#ffffff",
    "Crayellow": "#f1d651",
    "Cool Mint": "#ddebec",
    "Oatmeal": "#d9dad2",
    "Powder Blue": "#c0d5f0"
};

export function alltimeColorSeries() {
    return I.toColorSeries("crayon", "crayola", "all-time", alltime);
}

export const silverSwirls = {
    "Aztec Gold": "#C39953",
    "Burnished Brown": "#A17A74",
    "Cerulean Frost": "#6D9BC3",
    "Cinnamon Satin": "#CD607E",
    "Copper Penny": "#AD6F69",
    "Cosmic Cobalt": "#2E2D88",
    "Glossy Grape": "#AB92B3",
    "Granite Gray": "#676767",
    "Green Sheen": "#6EAEA1",
    "Lilac Luster": "#AE98AA",
    "Mistry Moss": "#BBB477",
    "Mystic Maroon": "#AD4379",
    "Pearly Purple": "#B768A2",
    "Pewter Blue": "#8BA8B7",
    "Polished Pine": "#5DA493",
    "Quick Silver": "#A6A6A6",
    "Rose Dust": "#9£5E6F",
    "Rusty Red": "#DA2C43",
    "Showdow Blue": "#778BA5",
    "Shiny Shamrock": "#5FA778",
    "Steel Teal": "#5F8A8B",
    "Sugar Plum": "#914E75",
    "Twilight Lavendar": "#8A496B",
    "Wintergreen Dream": "#56887D",
};

export function silverSwirlsColorSeries() {
    return I.toColorSeries("crayon", "crayola", "silver-swirls", silverSwirls);
}

export const multicultural = {
    "Apricot": "#FDD5B1",
    "Black": "#000000",
    "Burnt Sienna": "#E97451",
    "Mahogany": "#CA3435",
    "Peach": "#FFCBA4",
    "Sepia": "#9E6B40",
    "Tan": "#FA9D5A",
    "White": "#FFFFFF"
};

export function multiculturalColorSeries() {
    return I.toColorSeries("crayon", "crayola", "multicultural", multicultural);
}

export const gemstones = {
    "Amethyst": "#64609A",
    "Citrine": "#933709",
    "Emerald": "#14A989",
    "Jade": "'469A84",
    "Jasper": "#D05340",
    "Lapis Lazuli": "#436CB9",
    "Malachite": "#469496",
    "Moonstone": "#3AA8C1",
    "Onyx": "#353839",
    "Peridot": "#ABAD48",
    "Pink Pearl": "#B07080",
    "Rose Quartz": "#BD559C",
    "Ruby": "#AA4069",
    "Sapphire": "#2D5DA1",
    "Smokey Topaz": "832A0D",
    "Tiger's Eye": "#B56917"
};

export function gemstonesColorSeries() {
    return I.toColorSeries("crayon", "crayola", "gemstones", gemstones);
}

export const pearlBrite = {
    "Aqua Pearl": "#5FBED7",
    "Black Coral Pearl": "#54626F",
    "Caribbean Green Pearl": "#6ADA8E",
    "Cultured Pearl": "#F5F5F5",
    "Key Lime Pearl": "E8F48C",
    "Mandarin Pearl": "#F37A48",
    "Midnight Pearl": "#702670",
    "Mystic Pearl": "#D65282",
    "Ocean Blue Pearl": "#4F42B5",
    "Ocean Green Pearl": "#48BF91",
    "Orchid Pearl": "#7B4259",
    "Rose Pearl": "#F03865",
    "Salmon Pearl": "#F1444A",
    "Sunny Pearl": "#F2F27A",
    "Sunset Pearl": "#F1CC79",
    "Turqoise Pearl": "#3BBCD0"
};

export function pearlBriteColorSeries() {
    return I.toColorSeries("crayon", "crayola", "pearl-brite", pearlBrite);
}

export const metallic = {
    "Alloy Orange": "#C46210",
    "B'dazzled Blue": "#2E5894",
    "Big Dip O' Ruby": "#9C2542",
    "Bittersweet Shimmer": "#BF4F51",
    "Blast Off Bronze": "#A57164",
    "Cyber Grape": "#58427C",
    "Deep Space Sparkle": "#4A646C",
    "Gold Fusion": "#85754E",
    "Illuminating Emerald": "#319177",
    "Metallic Seaweed": "#0A7E8C",
    "Robot Canary": "#9C7C38",
    "Razzmic Berry": "#8D4E85",
    "Sheen Green": "#8FD400",
    "Shimmering Blush": "#D98695",
    "Sonic Silver": "#757575",
    "Steel Blue": "#0081AB",
    "Cheese Grater": "#C89F56",
    "Iron Indigo": "#184FA1",
    "Magnetic Magenta": "#BF3981",
    "Cobalt Cool": "#028AAE",
    "Acid Wash Jeans": "#5CB2C5",
    "Petrified Forest": "#005B39",
    "Rose Gold": "#C88CA4",
    "Gold Medal": "#C5BC42"
};

export function metallicColorSeries() {
    return I.toColorSeries("crayon", "crayola", "metallic-FX", metallic);
}

export const gel = {
    "#FF3399": "#FF3399",
    "#FF6699": "#FF6699",
    "#F26D7D": "#F26D7D",
    "#F58345": "#F58345",
    "#FFBF7F": "#FFBF7F",
    "#F5FF7D": "#F5FF7D",
    "#99FF99": "#99FF99",
    "#12E3DB": "#12E3DB",
    "#00B6BD": "#00B6BD",
    "#0081FF": "#0081FF",
    "#7092BE": "#7092BE",
    "#3F48CC": "#3F48CC",
    "#7853A8": "#7853A8",
    "#A349A4": "#A349A4",
    "#8F5873": "#8F5873",
    "#FFFFFF": "#FFFFFF"
};

export function gelColorSeries() {
    return I.toColorSeries("crayon", "crayola", "gel", gel);
}

export const pearl = {
    "Antique Gray": "#9F9F9F",
    "Apple Orchard": "#BF3F3F",
    "Berry Parfait": "#A43482",
    "Black Pearl": "#3A3A3A",
    "Bubble Gum": "#DF9ACA",
    "Butternut Squash": "#E74F00",
    "Caribbean Sea": "#67CD95",
    "Cloudy Sky": "#548CD0",
    "Hot Cocoa": "#8F482F",
    "Iridescent Indigo": "#3C32CD",
    "Lavender Silk": "#6B4D82",
    "Leafy Canopy": "#94DDCB",
    "Liquid Gold": "#FFD966",
    "Mango Purée": "#FF6137",
    "Moonlit Pond": "#4F2CD0",
    "Ocean Foam": "#62C9D3",
    "Orange Peel": "#FF8021",
    "Pesto": "#5F7B4A",
    "Pink Luster": "#FFB2E7",
    "Red Satin": "#9F3434",
    "Sea Glass": "#C4EA7F",
    "Shooting Star": "#FFFF65",
    "Snow Drift": "#F3F3F3",
    "Sunset Shimmer": "#F79015"
};

export function pearlColorSeries() {
    return I.toColorSeries("crayon", "crayola", "pearl", pearl);
}

export const constructionPaper = {
    "#FFA3B1": "#FFA3B1",
    "#F3715A": "#F3715A",
    "#F37B70": "#F37B70",
    "#FFAD59": "#FFAD59",
    "#FFE599": "#FFE599",
    "#F8FC98": "#F8FC98",
    "#B4FFB4": "#B4FFB4",
    "#12E3DB": "#12E3DB",
    "#00BCD4": "#00BCD4",
    "#03A9F4": "#03A9F4",
    "#4848FF": "#4848FF",
    "#6A35CE": "#6A35CE",
    "#AA55AA": "#AA55AA",
    "#7F7FBF": "#7F7FBF",
    "#795548": "#795548",
    "#FFFFFF": "#FFFFFF"
};

export function constructionPaperColorSeries() {
    return I.toColorSeries("crayon", "crayola", "construction-paper", constructionPaper);
}

export const colorsOfTheWorld = {
    "Deep Almond": "#986A5A",
    "Deep Golden": "#8D5B28",
    "Deep Rose": "#B86F69",
    "Deepest Almond": "#513529",
    "Extra Deep Almond": "#6E5046",
    "Extra Deep Golden": "#5F452E",
    "Extra Deep Rose": "#6C4D4B",
    "Extra Light Almond": "#EEE6CF",
    "Light Almond": "#E6B9B3",
    "Light Golden": "#EDDBC7",
    "Light Medium Almond": "#E0B5A4",
    "Light Medium Golden": "#F0C9A2",
    "Light Medium Rose": "#F4AFB2",
    "Light Rose": "#FAC7C3",
    "Medium Almond": "#D19C7D",
    "Medium Deep Almond": "#AC8065",
    "Medium Deep Golden": "#A16B4F",
    "Medium Deep Rose": "#EE8E99",
    "Medium Golden": "#DEA26C",
    "Very Deep Almond": "#88605E",
    "Very Deep Rose": "#8F6C68",
    "Very Light Almond": "#E6D2D3",
    "Very Light Golden": "#F0DFCF",
    "Very Light Rose": "#F7E1E3",
    "Black Hair": "#000000",
    "Blonde Hair": "#FFFF99",
    "Blue Eyes": "#6CDAE7",
    "Brown Eyes": "#AF593E",
    "Brown Hair": "#9E5B40",
    "Green Eyes": "#7BA05B",
    "Hazel Eyes": "#D27D46",
    "Red Hair": "#CA3435"
};

export function colorsOfTheWorldColorSeries() {
    return I.toColorSeries("crayon", "crayola", "colors-of-the-world", colorsOfTheWorld);
}