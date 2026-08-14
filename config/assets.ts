export type AssetType = "image" | "audio" | "config" | "svg" | "other";

export interface AssetMeta {
    path: string;
    type: AssetType;
}

export const RES = {
    public: {
        image: {
            adjustHorizontal: {path:'public/image/adjust-horizontal.png',type:"image"},
            direction: {path:'public/image/direction.png',type:"image"}
        },
        svg: {
            adjustHorizontal: {path:'public/svg/adjust-horizontal.svg',type:"svg"},
            direction: {path:'public/svg/direction.svg',type:"svg"}
        }
    }
};

export const ASSET_GROUP: Record<AssetType, AssetMeta[]> = {
    "audio": [],
    "config": [],
    "image": [{path:'public/image/adjust-horizontal.png',type:"image"},{path:'public/image/direction.png',type:"image"}],
    "other": [],
    "svg": [{path:'public/svg/adjust-horizontal.svg',type:"svg"},{path:'public/svg/direction.svg',type:"svg"}],
};
