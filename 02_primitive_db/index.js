import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import readline from "readline";

const DB_FILENAME = "users_db.txt";
const DB_PATH = path.join(path.resolve(), DB_FILENAME);

const ageAnswerValidator = (input) => {
  const age = Number(input);
  if (!Number.isInteger(age) || age <= 0 || age > 120) {
    return "Incorrect value for age!";
  }
  return true;
};

const nameAnswerValidator = (input) => {
  if (/^\s+$/.test(input)) {
    return "Incorrect value for name!";
  }
  return true;
};

const confirmationValidator = async (input) => {
  if (/^[YyNn]$/.test(input)) {
    return true;
  }
  return "Please provide either Y or N!";
};

const userNameIsNotEmpty = (userData) => {
  return userData.userName;
};

const saveToDB = (userData) => {
  fs.appendFile(DB_PATH, userData + "\n", (err) => {
    if (err) {
      console.error(err);
    }
  });
};

const readDB = () => {
  return new Promise((resolve, reject) => {
    const entries = [];
    const readStream = fs.createReadStream(DB_PATH, "utf8");
    const rl = readline.createInterface({
      input: readStream,
      crlfDelay: Infinity,
    });
    rl.on("line", (line) => {
      entries.push(line);
    });
    rl.on("close", () => {
      readStream.close();
      resolve(entries);
    });
    readStream.on("error", (error) => {
      reject(error);
    });
  });
};

const searchUserInDB = async (userName) => {
  return (await readDB())
    .map((user) => JSON.parse(user))
    .find(
      (user) =>
        user.userName.toLowerCase() ===
        userName.toLowerCase()
    );
};

const userCreationQuestions = [
  {
    type: "input",
    name: "userName",
    message:
      "Enter the user's name. To cancel press ENTER:",
    validate: nameAnswerValidator,
  },
  {
    type: "list",
    name: "userGender",
    message: "Choose your gender:",
    choices: ["male", "female"],
    when: userNameIsNotEmpty,
  },
  {
    type: "input",
    name: "userAge",
    message: "Enter your age:",
    validate: ageAnswerValidator,
    when: userNameIsNotEmpty,
  },
];

const searchConfirmQuestion = [
  {
    type: "input",
    name: "searchConfirm",
    message: "Would you like to search user in DB? (Y/N)",
    validate: confirmationValidator,
    filter(input) {
      return input.toUpperCase();
    },
  },
];

const searchUserQuestion = [
  {
    type: "input",
    name: "userName",
    message:
      "Enter the user's name to search for in the DB:",
    validate: (input) => {
      if (/^\s*$/.test(input)) {
        return "Incorrect value for name!";
      }
      return true;
    },
  },
];

const populateDBWithUsers = async () => {
  while (true) {
    const userData = await inquirer.prompt(
      userCreationQuestions
    );
    if (!userData.userName) {
      break;
    }
    saveToDB(JSON.stringify(userData));
  }
};

const showUsersInDB = async () => {
  const users = (await readDB()).map((user) =>
    JSON.parse(user)
  );
  console.log(users);
};

const searchForUser = async () => {
  const searchAnswer = await inquirer.prompt(
    searchUserQuestion
  );
  const searchResult = await searchUserInDB(
    searchAnswer.userName
  );
  if (searchResult) {
    console.log(`User ${searchAnswer.userName} was found`);
    console.log(searchResult);
    return;
  }
  console.log(
    `User ${searchAnswer.userName} was NOT found`
  );
};

const workWithSavedUsers = async () => {
  const confirmAnswer = await inquirer.prompt(
    searchConfirmQuestion
  );
  if (confirmAnswer.searchConfirm === "Y") {
    await showUsersInDB();
    await searchForUser();
  }
  process.exit(0);
};

const main = async () => {
  await populateDBWithUsers();
  await workWithSavedUsers();
};

main();
