export type AssetType = "image" | "audio" | "config" | "svg" | "other";

export interface AssetMeta {
    path: string;
    type: AssetType;
}

export const RES = {
    public: {
        image: {
            adjustHorizontal: {path:'public/image/adjust-horizontal.png',type:'image'} as AssetMeta,
            direction: {path:'public/image/direction.png',type:'image'} as AssetMeta
        },
        svg: {
            adjustHorizontal: {path:'public/svg/adjust-horizontal.svg',type:'svg'} as AssetMeta,
            direction: {path:'public/svg/direction.svg',type:'svg'} as AssetMeta
        }
    }
};
