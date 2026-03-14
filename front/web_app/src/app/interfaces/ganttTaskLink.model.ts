export interface GanttTaskLink{
    id: number;
    //type: string;//tip veze (finish_to_start,start_to_start,finish_to_finish)
    source: number; //id izvornog taska
    target: number; // id ciljnog taska 
    type:string; 
}