# Web application to book travel attractions (HereI) <br/>
![Alt text](/design-doc/AppImg.png)


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