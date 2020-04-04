import { IQuestion } from './IQuestion';
export interface IQuiz {
    Name: string;
    RoomCode: string;
    StartedAtUTC?: Date;
    StoppedAtUTC?: Date;
    Questions: IQuestion[];
}