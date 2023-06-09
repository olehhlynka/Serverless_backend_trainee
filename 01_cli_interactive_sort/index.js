const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const prompt = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

const retrieveWordsFromInput = (userInput) => {
  const values = userInput.trim().split(" ");
  return values.filter(
    (val) => !val.match(/^-?\d+(\.\d+)?$/)
  );
};

const retrieveNumbersFromInput = (userInput) => {
  const values = userInput.trim().split(" ");
  return values.filter((val) =>
    val.match(/^-?\d+(\.\d+)?$/)
  );
};

const sortWordsAlphabetically = (words) => {
  return words.sort();
};

const sortNumbersAsc = (numbers) => {
  return numbers.sort((a, b) => a - b);
};

const sortNumbersDesc = (numbers) => {
  return numbers.sort((a, b) => b - a);
};

const sortWordsByLengthAsc = (words) => {
  return words.sort((a, b) => a.length - b.length);
};

const getUnique = (values) => {
  return values.filter(
    (value, index, array) => array.indexOf(value) === index
  );
};

const main = async () => {
  try {
    while (true) {
      const userInput = await prompt(
        "Enter words or numbers separated by space: "
      );

      const words = retrieveWordsFromInput(userInput);
      const numbers = retrieveNumbersFromInput(userInput);

      const userChoice = await prompt(`\
  1. Sort words alphabetically
  2. Show numbers from lesser to greater
  3. Show numbers from bigger to smaller
  4. Display words in ascending order by number of letters in the word
  5. Show only unique words
  6. Display only unique values
  
  Select (1-6) and press ENTER: `);

      switch (userChoice) {
        case "1": {
          console.log(sortWordsAlphabetically(words));
          break;
        }
        case "2": {
          console.log(sortNumbersAsc(numbers));
          break;
        }
        case "3": {
          console.log(sortNumbersDesc(numbers));
          break;
        }
        case "4": {
          console.log(sortWordsByLengthAsc(words));
          break;
        }
        case "5": {
          console.log(getUnique(words));
          break;
        }
        case "6": {
          console.log(getUnique([...numbers, ...words]));
          break;
        }
        case "exit": {
          rl.close();
          process.exit(0);
        }
        default:
          break;
      }
    }
  } catch (e) {
    console.error(e);
  }
};

main();
