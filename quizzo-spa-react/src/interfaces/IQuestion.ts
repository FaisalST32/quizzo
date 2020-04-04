import { IAnswer } from "./IAnswer";

export interface IQuestion {
    Id: string;
    QuestionText: string;
    Answers: IAnswer[]
}