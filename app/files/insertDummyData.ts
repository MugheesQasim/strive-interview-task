import mongoose from 'mongoose';
import { connectToDatabase, disconnectDatabase } from '../lib/mongoose';
import { PromptResult } from '../models/PromptResult';

export async function insertDummyData() {
  await connectToDatabase();

  try {
    // Create a dummy sha and result for testing
    const dummySha = 'dummy-sha-1234567890abcdef';  // Replace with your dummy SHA
    const dummyResult = {
      score: 85,
      reasoning: 'The code quality is generally good, but there are minor improvements that can be made.',
    };

    // Check if the entry already exists
    const existingResult = await PromptResult.findOne({ sha: dummySha });
    console.log(PromptResult.find());
    if (existingResult) {
      console.log('The result for this sha already exists in the database.');
      return;
    }

    // Create a new entry
    const newResult = new PromptResult({
      sha: dummySha,
      result: dummyResult,
    });

    await newResult.save();

    console.log('Dummy data inserted successfully.');
  } catch (error) {
    console.error('Error inserting dummy data:', error);
  } finally {
    await disconnectDatabase();
  }
}

insertDummyData();
