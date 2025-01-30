import Article from "./article.type";

export default interface Topic{
        title: string;
        summary: string;
        active: boolean;
        link: string;
        children?: Topic[];
        articles?: Article[];
}