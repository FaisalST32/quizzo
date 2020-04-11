import { IQuestion } from './IQuestion';
export interface IQuiz {
    name?: string;
    roomCode: string;
    startedAtUtc?: Date;
    stoppedAtUtc?: Date;
    questions?: IQuestion[];
    adminCode?: number;
    isReady?: boolean;
}