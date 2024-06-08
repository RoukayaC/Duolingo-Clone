import { cache } from "react";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
import {
  courses,
  userProgress,
  units,
  lessons,
  challengeProgress,
} from "@/db/schema";

export const getUserProgress = cache(async () => {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }
  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.user_id, userId),
    with: {
      activeCourse: true,
    },
  });
  return data;
});

export const getUnits = cache(async () => {
  const { userId } = await auth();
  const userProgress = await getUserProgress();
  if (!userId || !userProgress?.activeCourse) {
    return [];
  }

  //TODO :CONFIRM WHETHER ORDER IS NEEDED
  const data = await db.query.units.findMany({
    where: eq(units.courseId, userProgress.activeCourse.id),
    with: {
      lessons: {
        with: {
          challenges: {
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId),
              },
            },
          },
        },
      },
    },
  });

  const normalizedData = data.map((unit) => {
    const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
      const allCompletedChallenges = lesson.challenges.every((challenge) => {
        return (
          challenge.challengeProgress &&
          challenge.challengeProgress.length > 0 &&
          challenge.challengeProgress.every((progress) => progress.completed)
        );
      });
      return {
        ...lesson,
        completed: allCompletedChallenges,
      };
    });
    return { ...unit, lessons: lessonsWithCompletedStatus };
  });

  return normalizedData;
});

export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany();
  return data;
});

export const getCourseById = cache(async (courseId: number) => {
  const data = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    //to do :populate units and lessons
  });
  return data;
});
