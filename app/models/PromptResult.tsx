import mongoose, { Schema, Document } from 'mongoose';

interface IResult {
  score: number;
  reasoning: string;
}

interface IPromptResult extends Document {
  sha: string;
  result: IResult;
}

const PromptResultSchema = new Schema<IPromptResult>({
  sha: { type: String, required: true, unique: true },
  result: {
    score: { type: Number, required: true },
    reasoning: { type: String, required: true },
  },
});

const PromptResult = mongoose.models.PromptResult || mongoose.model<IPromptResult>('PromptResult', PromptResultSchema);

export { PromptResult };
export type { IPromptResult };
