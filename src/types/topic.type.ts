import Article from "./article.type";

export default interface Topic {
  title: string;
  summary: string;
  active: boolean;
  link: string;
  postedDate?: Date;
  children?: Topic[];
  articles?: Article[];
}
