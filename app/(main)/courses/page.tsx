import { getCourses, getUserProgress } from "@/db/queries";
import { List } from "./list";

const CoursesPage = async () => {
  const coursesdata = getCourses();
  const userProgressdata = getUserProgress();

  const [courses, userProgress] = await Promise.all([
    coursesdata,
    userProgressdata,
  ]);
  return (
    <div className="h-full max-w-[912px] px-3 mx-auto">
      <h1 className="text-2xl font-bold text-neutral-700">Language Courses</h1>
      <List courses={courses} activeCourseId={userProgress?.activeCourseId} />
    </div>
  );
};
export default CoursesPage;
