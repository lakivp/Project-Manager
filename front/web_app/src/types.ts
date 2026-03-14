export interface Task {
    id: number,
    naziv:string,
    opis: string,
    prioritet: string,
    pocetak: string,
    kraj: string,
    idParent: number,
    idProjekat: number,
    idLabel: number,
    status: number,
    labelNaziv: string,
}

export interface Project {
    projectName: string;
    deadline: string;
    timeLeft: number;
}

export interface Label{
    id: number,
    naziv: string,
    idProjekat: number,
}