import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppModule } from './app.module';
import { User } from './modules/user/schemas/user.schema';

const users = [
  {
    name: 'Ada Lovelace',
    email: 'ada.lovelace@example.com',
  },
  {
    name: 'Grace Hopper',
    email: 'grace.hopper@example.com',
  },
  {
    name: 'Alan Turing',
    email: 'alan.turing@example.com',
  },
  {
    name: 'Katherine Johnson',
    email: 'katherine.johnson@example.com',
  },
];

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userModel = app.get<Model<User>>(getModelToken(User.name));
  const shouldReset = process.argv.includes('--reset');

  if (shouldReset) {
    await userModel.deleteMany({});
  }

  await userModel.bulkWrite(
    users.map((user) => ({
      updateOne: {
        filter: { email: user.email },
        update: { $set: user },
        upsert: true,
      },
    })),
  );

  const totalUsers = await userModel.countDocuments();
  await app.close();

  console.log(`Database seeded successfully. Users in database: ${totalUsers}`);
}

seed().catch((error) => {
  console.error('Database seed failed:', error);
  process.exit(1);
});
