import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  Link,
  Skeleton,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { MainTable, TimingTable } from "./Table";
import type { Main } from "@/data";

const Bento = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<Main | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(import.meta.env.PUBLIC_SHEETS_API);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setData(await response.json());
        setIsLoaded(true);
        if (data) {
          setTimeout(() => {
            setIsLoaded(true);
          }, 500);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const festItem = data?.body?.fest;

  return (
    <>
      <section className="md:grid grid-cols-7 grid-rows-5 gap-4 flex flex-col grid-flow-col sm:max-h-[85vh] my-8">
        <Card className={` col-span-5 row-span-4 w-full`}>
          <Skeleton
            disableAnimation
            className="h-full bg-inherit dark:bg-inherit overflow-y-auto"
            isLoaded={isLoaded}>
            <CardBody>
              {data?.body ? (
                <MainTable
                  meals={data?.body?.meals}
                  columns={data?.body?.columns}
                  className=""
                />
              ) : (
                <div>Sorry, somethig went</div>
              )}
            </CardBody>
          </Skeleton>
        </Card>
        <Card className={`row-span-1 col-span-5 `}>
          <Skeleton
            disableAnimation
            className="h-full bg-inherit dark:bg-inherit overflow-y-auto"
            isLoaded={isLoaded}>
            <CardBody>
              {data?.body ? (
                <TimingTable timings={data?.body?.timings} />
              ) : (
                <div>Sorry, somethig went</div>
              )}
            </CardBody>
          </Skeleton>
        </Card>
        <div className="row-span-5 col-span-2 w-full flex flex-col-reverse sm:flex-col gap-4">
          <Card className="min-h-[20%] h-auto">
            <Skeleton
              disableAnimation
              className="h-full bg-inherit dark:bg-inherit overflow-y-auto"
              isLoaded={isLoaded}>
              <CardHeader className="flex gap-3">
                <Image
                  alt="nextui logo"
                  height={40}
                  radius="sm"
                  src="https://avatars.githubusercontent.com/u/99102582?s=48&v=4"
                  width={40}
                />
                <div className="flex flex-col">
                  <p className="text-md font-medium">MUJ Mess</p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p>Mess Time table.</p>
              </CardBody>
              <Divider />
              <CardFooter>
                <Link
                  isExternal
                  showAnchorIcon
                  className="h-fit"
                  href="https://github.com/ItheNerd/FoodTimeTable">
                  Visit source code on GitHub.
                </Link>
              </CardFooter>
            </Skeleton>
          </Card>
          <Card className="w-full grow">
            <Skeleton
              disableAnimation
              className="h-full relative bg-inherit dark:bg-inherit overflow-y-auto"
              isLoaded={isLoaded}>
              <CardBody>
                {festItem ? (
                  <div key={festItem.date.toString()}>
                    <h2>
                      Date: {new Date(festItem.date).toLocaleDateString()}
                    </h2>
                    <p>Day: {festItem.day}</p>
                    <p>Breakfast: {festItem.breakfast}</p>
                    <p>Lunch: {festItem.lunch}</p>
                    <p>Snacks: {festItem.snacks}</p>
                    <p>Dinner: {festItem.dinner}</p>
                  </div>
                ) : (
                  <p>No Fest for now</p>
                )}
              </CardBody>
            </Skeleton>
          </Card>
        </div>
      </section>
    </>
  );
};

export default Bento;
