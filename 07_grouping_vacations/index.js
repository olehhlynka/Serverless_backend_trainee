import { readFile, writeFile } from "node:fs/promises";

const sourceFilePath = new URL(
  "./vacations.json",
  import.meta.url
);
const resultFilePath = new URL(
  "./grouped_vacations.json",
  import.meta.url
);

const mergeUserVacationsDates = (userVacations) => {
  return userVacations.reduce((acc, curr) => {
    acc.push({
      startDate: curr.startDate,
      endDate: curr.endDate,
      ...(curr.status && { status: curr.status }),
    });
    return acc;
  }, []);
};

const fileContents = await readFile(sourceFilePath);
const vacations = JSON.parse(fileContents);
const userNames = new Set(
  vacations.map((entry) => entry.user.name)
);

const vacationsSortedByUsers = Array.from(userNames).map(
  (userName) => {
    return vacations.filter(
      (vacationData) => vacationData.user.name === userName
    );
  }
);

const groupedVacations = vacationsSortedByUsers.map(
  (userVacations) => {
    const sampleUser = userVacations[0];
    const userObj = {
      userId: sampleUser.user._id,
      userName: sampleUser.user.name,
    };
    const vacationDates =
      mergeUserVacationsDates(userVacations);
    userObj.vacations = vacationDates;
    return userObj;
  }
);

await writeFile(
  resultFilePath,
  JSON.stringify(groupedVacations)
);
