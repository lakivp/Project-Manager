export interface GanttTask{
    id: number;
    text:string;
    start_date:Date;
    duration:number;
    progress:number;
    priority:string;
    parent?:number;
    opis:string;
    idProjekat:number;
    idLabel:number;
    kraj:Date;
}