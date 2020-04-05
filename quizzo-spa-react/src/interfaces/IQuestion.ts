import { IAnswer } from "./IAnswer";

export interface IQuestion {
    id?: string;
    questionText: string;
    answers: IAnswer[]
}