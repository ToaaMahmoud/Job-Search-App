# **Job Search App**

This application facilitates job searching relevant to specific domains or areas of interest. Different components can be created under `src`, which serves as the root folder. These components include program code for API calls, posting job details, and error handling for incorrect entries.

## **Features**

- **Filter Option:** Allows users to find the required job efficiently.
- **User Data Management:** Handles user-related data.
- **Company Data Management:** Handles company-related data.
- **Job Applications:** Manages job applications.

## **APIs**

### **User APIs**

1. **Sign Up**
2. **Sign In**
   - Sign in using email, recovery email, or mobile number and password.
   - Update status to online after sign-in.
3. **Update Account**
   - Update email, mobile number, recovery email, DOB, last name, or first name.
   - Ensure no conflicts with existing data.
   - User must be logged in.
4. **Delete Account**
   - Only the account owner can delete their data.
   - User must be logged in.
5. **Get User Account Data**
   - Only the account owner can retrieve their data.
   - User must be logged in.
6. **Get Profile Data for Another User**
   - Send the userId in params or query.
7. **Update Password**
8. **Forget Password**
   - Ensure data security, especially for OTP and new password.
9. **Get All Accounts Associated with a Specific Recovery Email**


### **Company APIs**

1. **Add Company**
   - Authorization required (role: Company_HR).
2. **Update Company Data**
   - Only the company owner can update data.
   - Authorization required (role: Company_HR).
3. **Delete Company Data**
   - Only the company owner can delete data.
   - Authorization required (role: Company_HR).
4. **Get Company Data**
   - Send the companyId in params to get desired company data.
   - Return all jobs related to this company.
   - Authorization required (role: Company_HR).
5. **Search for a Company by Name**
   - Authorization required (role: Company_HR and User).
6. **Get All Applications for a Specific Job**
   - Company owner can view applications for their jobs only.
   - Return each application with user data, not userId.
   - Authorization required (role: Company_HR).


  ### **Jobs APIs**

1. **Add Job**
   - Authorization required (role: Company_HR).
2. **Update Job**
   - Authorization required (role: Company_HR).
3. **Delete Job**
   - Authorization required (role: Company_HR).
4. **Get All Jobs with Company Information**
   - Authorization required (role: User, Company_HR).
5. **Get All Jobs for a Specific Company**
   - Authorization required (role: User, Company_HR).
   - Send the company name in query to get jobs.
6. **Get All Jobs Matching Filters**
   - Filter by working time, job location, seniority level, job title, and technical skills.
   - Authorization required (role: User, Company_HR).
7. **Apply to Job**
   - Add a new document in the application collection with new data.
   - Authorization required (role: User).


## **API Documentation**

[Link to Detailed Postman Documentation](https://documenter.getpostman.com/view/37432663/2sAYBREtJh)





     
