"user server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { getCourseById, getUserProgress } from "@/db/queries";
import { userProgress } from "@/db/schema";
import db from "@/db/drizzle";

export const upsertUserProgress = async (courseId: number) => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  const course = await getCourseById(courseId);

  if (!course) {
    throw new Error("Course not found");
  }

  //TODO/ ENABLE ONCE UNITS AND LESSONS ARE ADDED
  // if(!course.units.length || !course.units[0].lessons.length){
  //   throw new Error("Course not found");
  // }

  const existingUsingProgress = await getUserProgress();

  if (existingUsingProgress) {
    await db.update(userProgress).set({
      activeCourseId: courseId,
      userName: user.firstName || " User",
      userImageSrc: user.imageUrl || "/mascot.svg",
    });
  }
};
