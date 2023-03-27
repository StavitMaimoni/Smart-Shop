import { CategoryModel } from "./category-model";

export class ProductModel {
    public _id: string;
    public categoryId: string;
    public name: string;
    public price: number;
    public quantity: number;
    public imageName: string;
    public image: FileList;
    public category: CategoryModel;
    public highlight: boolean;
    public highlightedName: string;
}
