# Web application to book travel attractions (HereI) <br/>
![Alt text](/design-doc/AppImg.png)

### Deployment 

This website is deployed on [Heroku](https://thawing-basin-55117.herokuapp.com/)
<br/>
<br/>


### Introduction and technologies.
A full stack app built for users to be able to book attractions prior to or whilst travelling.  
Built in Node.js following CRUD operations this webapp makes use of a PostgreSQL database ontop of the Express.js framework.
Client-side programmed using HTML & CSS & JS.
<br/>

API integration also seen through the below:
  - Stripe payment gateway
  - Bing maps
 
 Other cools technologies:
  - Nodemailer
  - BCrypt 
  - Passport.js
<br/>

### Chanllege 

* Working remotely as a team on the same git branch
* Creating such a large project with so many routes and maintaining consistency across coding and design styles
* Understanidng implenting third-party API
<br/>

### Limitation

* We don't have an admin web console to manage users or events
<br/>

### Future Improvements

Advancements that could be made in the future to improve this website include:

- Google reCaptcha to Register form
- Single sign-on to support multiple social media platform
- Chat functionality with user
- Create review system (including - percentage satisfaction and limiting reviews to travellers who had been on experience)
<br/>

### Installation instructions
1) PSQL database must be created and named: herei
2) Create tables following the schema.sql file stored in the db directory
3) Ensure to run 'npm i' in the terminal to install all dependencies
<br/>

### Design
  - Database: <br/>
  ![Alt text](/design-doc/DB-Diagram.png)

  - Wireframe:<br/>
  ![Alt text](/design-doc/HomeDesign.png)<br/>
  ![Alt text](/design-doc/SearchDesign.png)
<br/>

### Contributors
- [Adrian Marotta](https://github.com/A-Marotta)
- [Cameron Gumley](https://github.com/RustyCG)
- [Karen Cai](https://github.com/gigi0310)
 
