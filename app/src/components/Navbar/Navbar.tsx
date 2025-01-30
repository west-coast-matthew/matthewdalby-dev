import { FC } from "react";

export class MenuItem{
    title: string;
    link?: string;

    constructor(title:string, link?:string){
        this.title = title;
        this.link = link;
    }
}

export interface Props{
    menuItems?:Array<MenuItem>;
}

const getMockMenuItems = ()=>{
    const items:Array<MenuItem> = [];

    items.push(new MenuItem('Blog','link1'));
    items.push(new MenuItem('Hydro!','link2'));

    return items;
}

const NavBar:FC<Props> =({menuItems=getMockMenuItems()})=>{
    
    const getTokens = ()=>{
        
        const tokens = menuItems.map((item:MenuItem, index)=>{
            return <span key={index}>
                {
                    item.link? 'aa' : <>bbb</>
                }
                
            { (index<menuItems.length -1) && ' / ' }
            </span>;
        });

        return (tokens);
    }

    return(
        <div>{ 
            getTokens()
        }</div>
    )
}

export default NavBar;