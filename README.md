<center>  
  <img src="https://readme-typing-svg.herokuapp.com?font=Times+new+Roman&size=30&letterSpacing=1px&duration=3000&pause=1000&color=F72C75&width=435&lines=Welcome+to+Dishcovery!"/>  
</center>

## Table of Contents
- [💡 Problem Statement & Solution](#-problem-statement--solution)
- [📽️ Visit Us](#-visit-us)
- [🚀 Getting Started](#-getting-started)
- [🧰 Resources](#-resources)
- [🖼️ Screenshots](#-screenshots)
- [⚙️ Key Features](#-key-features)
- [🌟 Additional Features](#-additional-features)
- [🖥️ Architecture & Tech Stack](#-architecture--tech-stack)
- [👥 About Us](#-about-us)

---

## 💡 Problem Statement & Solution

### Problem Statement
Online meal platforms have grown increasingly a part of everyday life, changing the manner in which individuals seek out, organize, and prepare food. With more individuals seeking dining ideas on the internet, the necessity for intelligent, intuitive systems beyond mere static recipe databases is increasingly pressing.

### Solution
Dishcovery was designed and developed as a response to the evolving necessity. It is a smart full-stack web application that employs artificial intelligence, cloud computing, and modern web development frameworks to deliver a highly interactive and customized dining experience.

Dishcovery is not just a cookbook; it is an intelligent cooking companion that interacts with users through dynamic interfaces and AI-powered suggestions. ReactJS powers a seamless frontend, Python Flask handles backend logic and APIs, Firebase provides secure real-time authentication and database access, and Docker ensures consistent environment deployments. Google’s Generative AI further enables personalized recipe generation based on user preferences, pantry inventory, and dietary needs.

Dishcovery simplifies the user’s culinary journey from recipe discovery and planning to inventory management through an integrated platform that’s intelligent, responsive, and scalable.

---

## 📽️ Visit Us

### 🔗 [Live App - Render](https://dishcovery-f.onrender.com)

---



## 🚀 Getting Started
Before running the project, make sure you have the necessary files downloaded:
1. **API keys**: Set up required API keys for Firebase and Gemini API key.
2. **Firebase and Docker config**: Ensure the Firebase project is set up and the necessary credentials are configured in your React app.

Note : This project requires a Gemini API key; please **create your own API key** to use the project.


## Setup:

### For running it locally

### Setting up Docker Frontend
```bash
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]
```
### Setting up Docker Backend
```bash
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
```

```bash
git clone https://github.com/arnavparekar/Dishcovery
```
```bash
cd Dishcovery
```
```bash
docker-compose up --build
```
---

## 🧰 Resources

- [React Docs](https://react.dev/learn)
- [Firebase Docs](https://firebase.google.com/docs)
- [Flask Docs](https://flask.palletsprojects.com/en/stable/)
- [Render Docs](https://render.com/docs)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Google Generative AI Docs](https://ai.google.dev/)
---


## 🖼️ Screenshots
<pre>
<img src = "https://github.com/arnavparekar/Dishcovery/blob/arnav/frontend/src/assets/home_page1.png">
<img src = "https://github.com/arnavparekar/Dishcovery/blob/arnav/frontend/src/assets/signin.png">  
<img src = "https://github.com/arnavparekar/Dishcovery/blob/arnav/frontend/src/assets/login.png">  
<img src = "https://github.com/arnavparekar/Dishcovery/blob/arnav/frontend/src/assets/home_page2.png">  
<img src= "https://github.com/arnavparekar/Dishcovery/blob/arnav/frontend/src/assets/create_recipe1.png">  
<img src = "https://github.com/arnavparekar/Dishcovery/blob/arnav/frontend/src/assets/create_recipe2.png">
<img src= "https://github.com/arnavparekar/Dishcovery/blob/arnav/frontend/src/assets/create_recipe3.png">  
<img src= "https://github.com/arnavparekar/Dishcovery/blob/arnav/frontend/src/assets/recipe1.png">  
<img src= "https://github.com/arnavparekar/Dishcovery/blob/arnav/frontend/src/assets/recipe2.png">  
<img src= "https://github.com/arnavparekar/Dishcovery/blob/arnav/frontend/src/assets/recipe3.png">  
<img src= "https://github.com/arnavparekar/Dishcovery/blob/arnav/frontend/src/assets/recipe4.png">  
<img src= "https://github.com/arnavparekar/Dishcovery/blob/arnav/frontend/src/assets/meal_plan1.png">
<img src= "https://github.com/arnavparekar/Dishcovery/blob/arnav/frontend/src/assets/meal_plan2.png">
<img src= "https://github.com/arnavparekar/Dishcovery/blob/arnav/frontend/src/assets/pantry1.png">
<img src= "https://github.com/arnavparekar/Dishcovery/blob/arnav/frontend/src/assets/pantry2.png">
<img src= "https://github.com/arnavparekar/Dishcovery/blob/arnav/frontend/src/assets/pantry3.png">
</pre>

---
## ⚙️ Key Features
1. **AI-Powered Create Recipe Module:**
   - Users enter ingredients or a dish idea. The Gemini API, via Flask, returns a detailed recipe generated in real time.
2. **Recipe Discovery Module:**
   - Displays recipes stored in Firestore. Users can explore, search, and filter recipes by ingredients, cuisine, or cooking time.
3. **Grocery List Generator Module:**
   - Automatically generates grocery lists based on planned meals and required pantry items.
4. **Authentication Module:**
   - Handles login and signup using Firebase Authentication. Once logged in, users gain access to AI generation, meal planning, and personalized storage.
---

## 🌟 Additional Features
1. **Responsive UI:**
   - Mobile-friendly, intuitive interface for recipe browsing, recipe planning, and culinary management.
2. **Meal Planning:**
   - Allows users to drag and drop meals into calendar slots and save their weekly meal plans to Firestore.
2. **Review and Sharing:**
   - Enables users to review recipes, give ratings, and read feedback from others to make better meal decisions.
---

## 🖥️ Architecture & Tech Stack
1. **Frontend:**
   - React: UI Framework
   - Figma: Designing Tool
2. **Backend:**
   - Flask: Python web server for APIs
   - Gemini Generative AI: AI-powered recipe generation
   - Gunicorn: Production WSGI server
3. **Database:**
   - Firebase Auth: Authentication
   - Firebase Firestore: NoSQL Database
   - Firebase Storage: Recipe image hosting
4. **Hosting and Deployment:**
   - Docker: Multi-container management
   - Render: Cloud hosting for frontend and backend


---

# Hi, We are the makers of Dishcovery! 👋
## 👥 About Us

Meet the creators behind Dishcovery – Arnav, Ritesh, Ninad and Laksh. 
Dishcovery is the result of a passionate effort by a team of developers dedicated to transforming how users interact with food digitally. With the rise of smart applications and AI-driven personalization, we envisioned a platform that moves beyond static recipes to become a dynamic culinary assistant.
Our team believes in building software that blends intelligence with usability. By integrating modern technologies like Google's Generative AI, Docker, Firebase, and a scalable React + Flask architecture, we set out to create a platform that could grow with its users. Whether you're a home cook experimenting with what's in your pantry or someone planning meals for the week, Dishcovery is tailored to enhance your journey.
It’s a practical, real-world application of cloud computing principles, containerized deployments, and AI integrations. Built with a developer and user first mindset. Dishcovery is our vision of what the future of food platforms looks like: personalized, intelligent, scalable, and joyful.
We are proud to present Dishcovery as a cloud-integrated smart web app that redefines convenience, creativity, and customization in the kitchen.



- Arnav Parekar - [Arnav Parekar](https://linkedin.com/in/arnav-parekar-b55786287/)
- Ritesh Chaudhari - [Ritesh Chaudhari](https://www.linkedin.com/in/ritesh-chaudhari-b77120283/)
- Ninad Mahajan - [Ninad Mahajan](https://www.linkedin.com/in/ninad-mahajan-014a0b28b/)
- Laksh Jain - [Laksh Jain](https://www.linkedin.com/in/laksh-jain-6b308323b/)

## Happy coding ❤️

Made with love ❤️
---
