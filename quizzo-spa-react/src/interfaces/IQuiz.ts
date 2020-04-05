import { IQuestion } from './IQuestion';
export interface IQuiz {
    name: string;
    roomCode: string;
    startedAtUTC?: Date;
    stoppedAtUTC?: Date;
    questions: IQuestion[];
}