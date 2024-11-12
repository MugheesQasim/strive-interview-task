## Getting Started
Step 1: Create a .env file on your local. Provide your GitHub and Mistral AI tokens there. You can get tokens from the following links:

[GitHub Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)

[Mistral AI Token](https://docs.aicontentlabs.com/articles/mistral-ai-api-key/)

These env variables need to be added (Add tokens without single quotations):

**`GITHUB_TOKEN`**='replace_your_github_token_here'

**`MISTRAL_API_KEY`**='replace_your_mistral_token_here'

Step 2: Install dependencies using the following command:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Step 3: Run the development server on your local:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Introduction
### Problem: 
Code quality is essential for creating maintainable, efficient, and error-free software. High quality code reduces makes it easier to extend or modify features without breaking existing functionality. Clean, well-documented code enhances readability and prevents hair-pulling moments during debugging.
### Solution:
What if there is a web app which will automatically fetch code from your git repo and give you a rating of your code quality and a bonus reasoning also? Well, this app is exactly doing this. There are 3 options:

Option 1: You can either give a file sha and it will fetch the code from the file, and provide you with a rating. 

Option 2: You can provide a commit id and it will fetch all the files and show you the code quality of all the files in a user friendly UI.

Option 3: You can provide a Pull Request Id and it will fetch all the related files and provide you their code quality in the result UI. 


## Technologies
FrontEnd: Next.JS

BackEnd: Next.JS

Database: MongoDB

Apis: GitHub, OpenAI


## Time Frame
~10-13 hours

~1 hour    ->  understanding the requirements and designing an architecture

1-2 hours  ->  going through documentation

5 hours    ->  development

4-5 hours  ->  debugging and testing


## Engineering
FrontEnd: 

The frontend is intuitive and can be tested after running the project locally. I am using 3 options in the home page. Each option directs to a new page showing a form to the user. After submitting the report, the user will be redirected to the result page. Every option has a different result page. As the sha of commits and ids of Pull Requests will have multiple files, so the result pages of these options will contain a left box where user can select the file and a right one where the user can see the rating provided by the openai api for the selected file.

BackEnd: 

The backend is made using the next.js as well. The apis are separate for each option.
Database: There are 2 possibilites to use MongoDB here. One can be to store all the results after the query using sha as the key in the form of history which user can see anytime just like the ChatGPT history feature. Other possibility is to increase performance. For example, if the user makes a same query again, the code should not make another prompt request to the openai api because openai api charges for the tokens. Instead, the code will fetch the same result from the MongoDB as the sha will be same.

Apis: 

GitHub api is being used to fetch the code from the repository automatically.
OpenAI api is being used to give it the prompt and fetch the result to show it to the user.

Both approaches are using the token based approach which will be provided using the .env file.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
